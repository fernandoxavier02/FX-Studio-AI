#!/usr/bin/env node
'use strict';

/**
 * sentinel-hook.cjs — PreToolUse:Agent guard for pipeline-orchestrator.
 *
 * Protocol:
 *   - Exit 0 with no stdout → allow (silent pass)
 *   - Exit 0 with hookSpecificOutput deny → deny this tool call, reason fed to Claude
 *   - Exit 2 with stderr → hard block, stderr fed to Claude
 *
 * Reads sentinel-state.json from PIPELINE_DOC_PATH.
 * NEVER spawns agents, writes files, or emits visual output.
 */

const fs = require('fs');
const path = require('path');

function handleInput(raw) {
  // 1. Parse stdin (tool_input from Claude Code)
  let input;
  try {
    if (!raw || !raw.trim()) return process.exit(0); // empty stdin → allow
    input = JSON.parse(raw.trim());
  } catch {
    return process.exit(0); // unparseable → allow (fail-open)
  }

  // 2. Extract agent identity from tool_input
  const toolInput = input.tool_input || {};
  const fullAgentType = toolInput.subagent_type || toolInput.description || '';
  // "pipeline-orchestrator:core:sentinel" → "sentinel"
  const agentName = fullAgentType.includes(':')
    ? fullAgentType.split(':').pop()
    : fullAgentType.toLowerCase().replace(/[^a-z0-9-]/g, '');

  // 3. Discover state file path
  //    PIPELINE_DOC_PATH is set by the pipeline controller as an env var
  //    or we try to find it from the most recent Pre-*-action folder
  const docPath = process.env.PIPELINE_DOC_PATH || '';
  const stateFilePath = docPath
    ? path.join(docPath, 'sentinel-state.json')
    : '';

  // 4. Try to read state file
  let state;
  if (!stateFilePath) return process.exit(0); // no doc path → allow (bootstrap)
  try {
    state = JSON.parse(fs.readFileSync(stateFilePath, 'utf8'));
  } catch {
    // State file doesn't exist or corrupted → fail-open (bootstrap or recovery)
    return process.exit(0);
  }

  // 5. Schema version check
  if (state.schema_version !== 1) {
    return process.exit(0); // incompatible version → don't interfere
  }

  // 6. Pipeline inactive? → silent pass
  if (!state.pipeline_active) {
    return process.exit(0);
  }

  // 7. Target is sentinel itself? → pass (anti-loop)
  if (agentName === 'sentinel') {
    return process.exit(0);
  }

  // 8. Circuit breaker: 3+ consecutive corrections
  if ((state.consecutive_corrections || 0) >= 3) {
    process.stderr.write(
      'SENTINEL CIRCUIT_BREAKER: 3 consecutive corrections without PASS. ' +
      'Pipeline needs manual intervention. ' +
      'Options: (a) Spawn sentinel agent with mode SEQUENCE_VALIDATION for diagnosis, ' +
      '(b) Ask the user to resolve, (c) Cancel pipeline.'
    );
    return process.exit(2); // hard block — stderr fed to Claude
  }

  // 9. Compare target vs expected_next
  const expected = (state.expected_next || '').toLowerCase();
  const target = agentName.toLowerCase();

  if (target === expected) {
    // MATCH → silent allow
    return process.exit(0);
  }

  // 10. Check if this is a known alias or partial match
  //     e.g., expected "executor-controller" matches "executor-controller"
  //     but also "pipeline-orchestrator:executor:executor-controller" should match
  if (expected && fullAgentType.toLowerCase().endsWith(expected)) {
    return process.exit(0); // suffix match → allow
  }

  // 11. DIVERGENCE — deny with reason
  const output = {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason:
        `SENTINEL DIVERGENCE DETECTED.\n` +
        `  Attempted: "${agentName}"\n` +
        `  Expected:  "${state.expected_next}" (Phase ${state.current_phase || '?'}, Variant: ${state.variant || '?'})\n\n` +
        `ACTION REQUIRED: Spawn the sentinel agent (subagent_type: "pipeline-orchestrator:core:sentinel") ` +
        `with mode SEQUENCE_VALIDATION to diagnose and auto-correct.\n` +
        `Pass these parameters in the prompt:\n` +
        `  - mode: SEQUENCE_VALIDATION\n` +
        `  - state_file_path: ${stateFilePath}\n` +
        `  - trigger: hook_deny\n` +
        `  - deny_reason: Attempted "${agentName}" but expected "${state.expected_next}"`
    }
  };
  console.log(JSON.stringify(output));
  process.exit(0);
}

// Cross-platform stdin reading (works on Windows + Unix)
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => handleInput(input));
