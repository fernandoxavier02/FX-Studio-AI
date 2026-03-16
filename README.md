<p align="center">
  <img src="https://img.shields.io/badge/Claude_Code-Plugin-7C3AED?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDJMNiA3djEwbDYgNSA2LTVWN3oiLz48L3N2Zz4=" alt="Claude Code Plugin">
  <img src="https://img.shields.io/badge/version-2.0.0-blue?style=for-the-badge" alt="Version 2.0.0">
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="MIT License">
  <img src="https://img.shields.io/badge/agents-13-orange?style=for-the-badge" alt="13 Agents">
  <img src="https://img.shields.io/badge/zero_dependencies-black?style=for-the-badge" alt="Zero Dependencies">
</p>

<h1 align="center">Pipeline Orchestrator</h1>

<p align="center">
  <strong>One command. Thirteen agents. Zero guesswork.</strong>
  <br>
  A multi-agent pipeline plugin for <a href="https://claude.ai/code">Claude Code</a> that turns<br>
  <code>/pipeline fix the auth bug</code> into a classified, tested, reviewed, and validated change.
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> &nbsp;&bull;&nbsp;
  <a href="#how-it-works">How It Works</a> &nbsp;&bull;&nbsp;
  <a href="#installation">Installation</a> &nbsp;&bull;&nbsp;
  <a href="#configuration">Configuration</a> &nbsp;&bull;&nbsp;
  <a href="docs/adapter-guide.md">Adapter Guide</a>
</p>

---

## What It Does

You type one command. The pipeline does the rest:

```
> /pipeline fix the login bug that causes double redirect on mobile
```

```
╔══════════════════════════════════════════════════════════╗
║  PIPELINE PROPOSAL                                       ║
╠══════════════════════════════════════════════════════════╣
║  Type:        Bug Fix                                     ║
║  Complexity:  MEDIA                                       ║
║  Pipeline:    bugfix-light                                ║
║  Info-Gate:   CLEAR (no gaps detected)                    ║
║  Batch size:  2-3 tasks                                   ║
╚══════════════════════════════════════════════════════════╝

Confirm this pipeline? (yes / no / adjust)
```

You say **yes**. It writes tests first (TDD), implements the fix, reviews it for security issues, validates the build, and presents you with a Go/No-Go decision — all without you managing individual steps.

---

## Why This Exists

| Without pipeline | With pipeline |
|:---:|:---:|
| "Fix this bug" | "Fix this bug" |
| *you* figure out what's affected | auto-classifies type + complexity |
| *you* remember to write tests | TDD enforced — tests first, always |
| *you* hope nothing else broke | per-batch adversarial review catches issues |
| *you* manually verify the build | checkpoint-validator runs build + tests |
| "I think it works" | Go/No-Go with evidence |

**The pipeline doesn't replace your judgment. It structures it.**

---

## How It Works

```
                        /pipeline [task]
                              │
                 ┌────────────┴────────────┐
                 │   PHASE 0: TRIAGE        │
                 │                          │
                 │  task-orchestrator        │  ← classifies type + complexity
                 │  information-gate         │  ← detects knowledge gaps
                 └────────────┬────────────┘
                              │
                 ┌────────────┴────────────┐
                 │   PHASE 1: PROPOSAL      │
                 │                          │
                 │  "Bug Fix / MEDIA /      │
                 │   bugfix-light"          │
                 │                          │
                 │  Confirm? (yes/no)       │  ← you decide
                 └────────────┬────────────┘
                              │
                 ┌────────────┴────────────┐
                 │   PHASE 2: EXECUTION     │
                 │                          │
                 │  ┌─ TDD ────────────┐    │
                 │  │ quality-gate  ●──│──> │  you approve test scenarios
                 │  │ pre-tester    ●  │    │  tests written (RED)
                 │  └──────────────────┘    │
                 │                          │
                 │  ┌─ Per Batch ───────┐   │
                 │  │ micro-gate     ●  │   │  check before coding
                 │  │ implementer    ●  │   │  write code (GREEN)
                 │  │ checkpoint     ●  │   │  build + test
                 │  │ adversarial    ●  │   │  security review
                 │  │ fix loop    (≤3)  │   │  auto-fix findings
                 │  └──────────────────┘   │
                 └────────────┬────────────┘
                              │
                 ┌────────────┴────────────┐
                 │   PHASE 3: CLOSURE       │
                 │                          │
                 │  sanity-checker           │  ← final validation
                 │  final-validator          │  ← Go / Conditional / No-Go
                 │  finishing-branch         │  ← commit, PR, keep, or discard
                 └──────────────────────────┘
```

---

## Quick Start

### 1. Install

```bash
git clone https://github.com/user/pipeline-orchestrator.git ~/.claude/plugins/pipeline-orchestrator
```

Or add to your Claude Code settings:

```jsonc
// .claude/settings.json
{
  "plugins": ["~/.claude/plugins/pipeline-orchestrator"]
}
```

### 2. Use

```bash
# Full pipeline — the default
/pipeline fix the login bug that causes double redirect

# Just see the classification — no execution
/pipeline diagnostic add dark mode to settings

# Resume after diagnostic or interruption
/pipeline continue

# Override the classifier
/pipeline --complexa redesign the authentication flow
```

### 3. That's it

No configuration required. The pipeline auto-detects your build and test commands from `package.json`, `Makefile`, `Cargo.toml`, or `pyproject.toml`.

---

## Pipeline Variants

Every task is classified into one of **5 types** and **3 complexity levels**.
SIMPLES tasks run directly. MEDIA and COMPLEXA get a full pipeline.

| Type | SIMPLES | MEDIA | COMPLEXA |
|:-----|:-------:|:-----:|:--------:|
| **Bug Fix** | direct | `bugfix-light` | `bugfix-heavy` |
| **Feature** | direct | `implement-light` | `implement-heavy` |
| **User Story** | direct | `user-story-light` | `user-story-heavy` |
| **Audit** | direct | `audit-light` | `audit-heavy` |
| **UX Simulation** | direct | `ux-sim-light` | `ux-sim-heavy` |

<details>
<summary><strong>What decides the complexity?</strong></summary>

| Level | Files affected | Lines changed | Batch size | Adversarial |
|:------|:-:|:-:|:-:|:---|
| **SIMPLES** | 1–2 | < 30 | all at once | optional |
| **MEDIA** | 3–5 | 30–100 | 2–3 per batch | 3 checklists |
| **COMPLEXA** | 6+ | > 100 | 1 per batch | all 7 checklists |

</details>

---

## The 13 Agents

<table>
<tr>
<td width="33%" valign="top">

### Core

| Agent | Job |
|:------|:----|
| **task-orchestrator** | Classifies and proposes |
| **information-gate** | Detects knowledge gaps |
| **adversarial-batch** | Per-batch security review |
| **checkpoint-validator** | Per-batch build/test |
| **sanity-checker** | Final validation |
| **final-validator** | Go/No-Go decision |
| **finishing-branch** | Git operations |

</td>
<td width="33%" valign="top">

### Executor

| Agent | Job |
|:------|:----|
| **executor-controller** | Manages batches |
| **executor-implementer** | Writes code (1 task) |
| **executor-spec-reviewer** | Checks spec match |
| **executor-quality-reviewer** | SOLID/KISS/DRY |

</td>
<td width="33%" valign="top">

### Quality

| Agent | Job |
|:------|:----|
| **quality-gate-router** | Test scenarios |
| **pre-tester** | Writes tests (RED) |

</td>
</tr>
</table>

---

## Safety Features

The pipeline is designed to **never guess, never loop forever, and never claim success without evidence**.

#### Defense-in-Depth Gates

```
MACRO-GATE (once, after classification)
  "Does a spec exist? Schema defined? Values approved?"
  → Blocks until critical gaps resolved

MICRO-GATE (per task, before coding)
  "Target file exists? Behavior explicit? Values defined?"
  → Stops task if anything is missing
```

#### Adversarial Fix Loop (Max 3)

```
Finding detected
  → Attempt 1: executor-fix tries approach A
  → Attempt 2: executor-fix tries approach B
  → Attempt 3: MUST use different approach than 1 & 2
  → Still failing? STOP. Propose 2 alternatives to user.

Never loops infinitely. Never retries the same approach.
```

#### Stop Rule

```
Build fails → retry once → fails again → STOP PIPELINE
                                          ↓
                                    Escalate to user
                                    with full context
```

#### Verification-Before-Claim

Every assertion that something "works" includes the **actual command** and its **actual output**. No "should work" or "probably fixed."

---

## Configuration

Create `.claude/pipeline.local.md` in your project to customize:

```yaml
---
doc_path: ".pipeline/docs"       # where pipeline docs are saved
spec_path: "specs/"              # where your specs live
build_command: "npm run build"   # your build command
test_command: "npm test"         # your test command
patterns_file: "PATTERNS.md"    # your coding patterns file
---
```

<details>
<summary><strong>Configuration for other stacks</strong></summary>

**Python**
```yaml
---
build_command: "python -m py_compile main.py"
test_command: "pytest"
---
```

**Rust**
```yaml
---
build_command: "cargo build"
test_command: "cargo test"
---
```

**Go**
```yaml
---
build_command: "go build ./..."
test_command: "go test ./..."
---
```

</details>

If no config file exists, the pipeline **auto-detects** from your project structure.

---

## Architecture

```
pipeline-orchestrator/
│
├── skills/pipeline/SKILL.md          # Entry point — what triggers the skill
├── commands/pipeline.md              # The orchestrator — the brain
│
├── agents/
│   ├── core/                         # 7 agents shared across all pipelines
│   ├── executor/                     # 4 agents for implementation
│   └── quality/                      # 2 agents for test generation
│
├── references/
│   ├── pipelines/                    # 10 pipeline variant definitions
│   ├── checklists/                   # 7 adversarial security checklists
│   ├── gates/                        # Macro + micro gate definitions
│   └── glossary.md                   # Term definitions
│
├── docs/
│   ├── adapter-guide.md              # How to integrate into your project
│   └── examples/                     # 3 end-to-end worked examples
│
├── hooks/hooks.json                  # Session startup notification
└── .claude-plugin/plugin.json        # Plugin manifest
```

**Progressive disclosure** — Claude Code loads only `SKILL.md` (~80 lines) initially. Agents and references are loaded on-demand as the pipeline progresses. This keeps your context window clean.

---

## Examples

<details>
<summary><strong>Simple Bug Fix</strong> — direct execution, minimal overhead</summary>

```
> /pipeline fix typo in error message on login page

Phase 0: Bug Fix / SIMPLES → DIRETO
Phase 1: Confirmed
Phase 2: 1 task, 1 batch → done
Phase 3: Build passes → GO

Options: (A) Commit  (B) Push+PR  (C) Keep  (D) Discard
```

Full walkthrough: [`docs/examples/simple-bugfix.md`](docs/examples/simple-bugfix.md)

</details>

<details>
<summary><strong>Medium Feature</strong> — TDD, 2 batches, adversarial review</summary>

```
> /pipeline add dark mode toggle to settings page

Phase 0: Feature / MEDIA → implement-light
  Info-gate asks: "Where should the preference be persisted?"
  User: "localStorage"
Phase 1: Confirmed
Phase 2: 2 batches of 2-3 tasks
  Adversarial finds: missing aria-label on toggle
  Fix loop: resolved in 1 attempt
Phase 3: Build + tests pass → GO

Options: (A) Commit  (B) Push+PR  (C) Keep  (D) Discard
```

Full walkthrough: [`docs/examples/medium-feature.md`](docs/examples/medium-feature.md)

</details>

<details>
<summary><strong>Complex Audit</strong> — full 7-checklist adversarial review</summary>

```
> /pipeline audit the authentication module for security vulnerabilities

Phase 0: Audit / COMPLEXA → audit-heavy
  Info-gate asks: "Scope?" → "auth module only"
  Info-gate asks: "Previous baseline?" → "No"
Phase 1: Confirmed
Phase 2: 7 single-task batches, all 7 checklists
  Findings: 2 HIGH, 3 MEDIUM, 2 LOW
Phase 3: Report generated → CONDITIONAL (2 HIGH items pending)
```

Full walkthrough: [`docs/examples/complex-audit.md`](docs/examples/complex-audit.md)

</details>

---

## Adversarial Checklists

7 security-focused checklists, loaded proportionally:

| Checklist | Focus |
|:----------|:------|
| `auth` | Authentication, session management, token handling |
| `input-validation` | Sanitization, type checking, boundary values |
| `error-handling` | Error exposure, graceful degradation, logging |
| `injection` | SQL, XSS, command injection, template injection |
| `data-integrity` | SSOT, schema validation, migration safety |
| `crypto` | Key management, hashing, TLS, secrets handling |
| `business-logic` | Race conditions, state bypass, privilege escalation |

SIMPLES gets `auth` only. MEDIA gets 3. COMPLEXA gets all 7.

---

## How It Compares

|  | Manual review | CI/CD only | **Pipeline Orchestrator** |
|:-|:---:|:---:|:---:|
| Auto-classifies tasks | — | — | Yes |
| Asks before guessing | — | — | Yes |
| TDD enforced | Sometimes | Config-dependent | Always |
| Security review | Manual | Static analysis | 7 contextual checklists |
| Proportional rigor | — | Same for all | Scales with complexity |
| Fix loop with cap | — | Retry forever | Max 3, then escalate |
| Evidence-based claims | — | Logs exist | Every claim needs proof |
| Works with any project | — | Per-project setup | Auto-detects |

---

## Compatibility

**Built for [Claude Code](https://claude.ai/code).** The plugin uses Claude Code's plugin system — agents, skills, commands, hooks, and tool dispatch (`Task`, `AskUserQuestion`, model hints like `sonnet`/`opus`/`haiku`).

The **orchestration concepts** are model-agnostic and would work with any LLM that supports tool use:

| What's portable (the ideas) | What's Claude Code-specific (the glue) |
|:---|:---|
| Classification matrix (5 types × 3 levels) | `.claude-plugin/plugin.json` manifest |
| Defense-in-depth gates (macro + micro) | Agent dispatch via `Task` tool |
| Adaptive batch execution | `SKILL.md` / `commands/*.md` format |
| Per-batch adversarial review with fix cap | `model: sonnet \| opus \| haiku` hints |
| Proportionality, non-invention, TDD | `hooks.json` session hooks |

Porting to Cursor, Windsurf, Codex, or other AI coding tools means adapting the integration layer — the pipeline logic stays the same. And since it's all pure markdown (zero runtime), migration cost is low.

## Requirements

- [Claude Code](https://claude.ai/code) CLI
- That's it. Zero runtime dependencies. Pure markdown.

---

## Contributing

1. Fork this repo
2. Create a feature branch
3. Make your changes
4. Run `/pipeline` on your own changes (yes, it pipelines itself)
5. Submit a PR

---

## License

MIT — use it, fork it, adapt it, ship it.

---

<p align="center">
  <sub>Built with obsessive attention to when AI should stop and ask.</sub>
</p>
