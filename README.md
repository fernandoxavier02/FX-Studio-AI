# Pipeline Orchestrator v2 — Claude Code Plugin

A single-command multi-agent pipeline for Claude Code. Auto-classifies tasks, confirms with you, then executes in adaptive batches with TDD, per-batch adversarial review, defense-in-depth information gates, and Go/No-Go validation.

## How It Works

```
/pipeline [your task description]

Phase 0: Automatic Triage
  task-orchestrator classifies type + complexity
  information-gate detects and resolves knowledge gaps

Phase 1: Proposal + Confirmation
  Presents classification → you confirm (yes/no/adjust)

Phase 2: Batch Execution
  TDD: test scenarios (you approve) → automated tests (RED)
  Implementation: adaptive batches with per-batch validation
    Each batch: micro-gate → implement → checkpoint → adversarial review
    Fix loop: max 3 attempts per finding, then escalates to you

Phase 3: Closure
  sanity-checker → final-validator (Go/Conditional/No-Go) → git options
```

## Installation

```bash
# Clone locally
git clone https://github.com/YOUR-USER/pipeline-orchestrator.git

# Add to Claude Code settings
# In .claude/settings.json:
{
  "plugins": ["path/to/pipeline-orchestrator"]
}
```

## Quick Start

```bash
# Full pipeline — classify, confirm, execute, validate
/pipeline Fix the login bug that causes double redirect

# Diagnostic only — see classification without executing
/pipeline diagnostic Add export feature to reports

# Resume from Phase 2 (after diagnostic or interruption)
/pipeline continue

# Force classification level
/pipeline --simples Fix typo in error message
/pipeline --complexa Redesign authentication flow
```

## Pipeline Variants

5 types × 2 intensities = 10 pipeline variants. SIMPLES tasks use DIRETO (direct execution).

| Type / Complexity | SIMPLES | MEDIA | COMPLEXA |
|-------------------|---------|-------|----------|
| **Bug Fix** | DIRETO | bugfix-light | bugfix-heavy |
| **Feature** | DIRETO | implement-light | implement-heavy |
| **User Story** | DIRETO | user-story-light | user-story-heavy |
| **Audit** | DIRETO | audit-light | audit-heavy |
| **UX Simulation** | DIRETO | ux-sim-light | ux-sim-heavy |

## Architecture

```
pipeline-orchestrator/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest
├── skills/pipeline/
│   └── SKILL.md                 # Entry point (progressive disclosure L1)
├── commands/
│   └── pipeline.md              # Main orchestrator (L2)
├── agents/
│   ├── core/                    # Shared across all pipelines
│   │   ├── task-orchestrator.md   # Classifies + proposes pipeline
│   │   ├── information-gate.md    # Macro-gate: detects knowledge gaps
│   │   ├── adversarial-batch.md   # Per-batch security review
│   │   ├── checkpoint-validator.md # Per-batch build+test validation
│   │   ├── sanity-checker.md      # Final build+test+regression
│   │   ├── final-validator.md     # Pa de Cal: Go/No-Go
│   │   └── finishing-branch.md    # Git operations + closeout
│   ├── executor/                # Implementation team
│   │   ├── executor-controller.md   # Batch orchestration
│   │   ├── executor-implementer-task.md # Per-task implementation
│   │   ├── executor-spec-reviewer.md    # Spec compliance check
│   │   └── executor-quality-reviewer.md # SOLID/KISS/DRY review
│   └── quality/                 # Quality assurance
│       ├── quality-gate-router.md # Plain-language test scenarios
│       └── pre-tester.md          # Automated test creation (RED)
├── references/                  # On-demand content (L4)
│   ├── pipelines/               # 10 pipeline variant definitions
│   ├── checklists/              # 7 adversarial security checklists
│   ├── gates/                   # Macro-gate questions + micro-gate checklist
│   └── glossary.md              # Terminology reference
├── docs/
│   ├── adapter-guide.md         # How to integrate into your project
│   └── examples/                # 3 worked examples
├── hooks/
│   └── hooks.json               # SessionStart notification
└── README.md
```

## Agents

| Agent | Role | Model |
|-------|------|-------|
| task-orchestrator | Classifies type/complexity, spawns info-gate, proposes pipeline | sonnet |
| information-gate | Macro-gate: detects and resolves knowledge gaps before execution | sonnet |
| quality-gate-router | Generates plain-language test scenarios for user approval | opus |
| pre-tester | Converts approved scenarios to automated tests (RED phase) | opus |
| executor-controller | Orchestrates adaptive batch execution with micro-gates | opus |
| executor-implementer-task | Implements ONE task with micro-gate check + TDD | opus |
| executor-spec-reviewer | Verifies implementation matches spec/requirements | sonnet |
| executor-quality-reviewer | Checks SOLID/KISS/DRY/YAGNI compliance | sonnet |
| adversarial-batch | Per-batch security review with fix loop (max 3 attempts) | sonnet |
| checkpoint-validator | Per-batch build + test validation with stop rule | haiku |
| sanity-checker | Final build + tests + regression validation | haiku |
| final-validator | Consolidates results, issues Go/Conditional/No-Go | sonnet |
| finishing-branch | Git operations: commit, PR, keep, discard | sonnet |

## Configuration

Create `.claude/pipeline.local.md` in your project root:

```yaml
---
doc_path: ".pipeline/docs"
spec_path: "specs/"
build_command: "npm run build"
test_command: "npm test"
patterns_file: "PATTERNS.md"
---
```

If no config exists, the pipeline auto-detects from `package.json`, `Makefile`, or common conventions.

## Key Safety Features

| Feature | Description |
|---------|-------------|
| **Defense-in-depth gates** | Macro-gate (after classification) + micro-gate (per task) |
| **Per-batch adversarial** | Review after each batch, not just at the end |
| **Fix loop cap** | Max 3 attempts; 3rd must use different approach; then escalates |
| **Stop rule** | 2 consecutive build/test failures → pipeline stops |
| **Non-invention** | Never guesses — asks the user when info is missing |
| **Verification-before-claim** | Every "it works" needs command + actual output evidence |
| **Proportionality** | Rigor scales with complexity (SIMPLES → light, COMPLEXA → full) |

## Proportionality Table

| Level | Files | Lines | Adversarial | Checkpoint | Final |
|-------|-------|-------|-------------|------------|-------|
| SIMPLES | 1-2 | <30 | Optional | Build only | Minimal |
| MEDIA | 3-5 | 30-100 | 3 checklists | Build + Tests | Standard |
| COMPLEXA | 6+ | >100 | 7 checklists | Full + Regression | Complete |

## Contributing

1. Fork this repo
2. Create a feature branch
3. Make your changes
4. Run `/pipeline` on your own changes (dogfooding!)
5. Submit a PR

## License

MIT
