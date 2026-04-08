<div align="center">
  <img src="assets/fx-studio-ai-logo.png" alt="FX Studio AI" width="600"/>
</div>

<h1 align="center">FX Studio AI</h1>

<p align="center">
  <strong>Official plugin marketplace for Claude Code</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-Claude%20Code-blueviolet" alt="Platform"/>
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License"/>
  <img src="https://img.shields.io/badge/language-JavaScript-yellow" alt="Language"/>
</p>

## What It Does

FX Studio AI is the central hub for all FX Studio AI tools for Claude Code. It serves as a plugin marketplace that bundles three specialized plugins into a single installable package, giving you access to orchestration, intelligent routing, and diagnostic tooling in one step.

## Included Plugins

| Plugin | Description |
|--------|-------------|
| **Pipeline Orchestrator** | Single-command multi-agent pipeline with auto-classification, adaptive batching, and adversarial review. |
| **Skill Advisor** | Intelligent routing layer that scans all installed skills, plugins, and MCPs, then recommends the optimal combination for any task. |
| **CC Toolkit** | Swiss Army Knife with 12 diagnostic and productivity skills for Claude Code setup, auditing, and optimization. |

## Installation

```bash
# Add the marketplace
claude plugin add-marketplace https://github.com/fernandoxavier02/FX-Studio-AI

# Install individual plugins
claude plugin add pipeline-orchestrator
claude plugin add skill-advisor
claude plugin add cc-toolkit
```

## Usage

After installation, each plugin's commands are accessible directly:

```bash
# Pipeline Orchestrator -- structured multi-agent execution
/pipeline [task]

# Skill Advisor -- intelligent tool recommendations
/advisor [task]

# CC Toolkit -- diagnostics and productivity
/cc
```

Refer to each plugin's repository for detailed usage instructions.

## License

MIT

---

<div align="center">
  <strong>Built by <a href="https://github.com/fernandoxavier02">Fernando Xavier</a></strong>
  <br/>
  <a href="https://fxstudioai.com">FX Studio AI</a> — Business Automation with AI
</div>
