# Complexity Matrix (SSOT)

This is the SINGLE SOURCE OF TRUTH for complexity classification and proportional behavior.
All agents MUST reference this file — never define complexity rules inline.

---

## Classification Criteria

| Dimension | SIMPLES | MEDIA | COMPLEXA |
|-----------|---------|-------|----------|
| Files affected | 1-2 | 3-5 | 6+ |
| Lines changed | < 30 | 30-100 | > 100 |
| Domains | 1 | 2 | 3+ |
| Risk | Low | Medium | High |
| Has spec | No | Optional | Required |
| Auth impact | No | Maybe | Yes |
| Data model change | No | Minor | Structural |

### Boundary Rule

Values at exact boundaries (e.g., exactly 3 files, exactly 30 lines) are classified as the HIGHER complexity level. Example: 3 files = MEDIA, 30 lines = MEDIA.

### Automatic Elevation Rules

1. Touches authentication/authorization -> minimum MEDIA
2. Touches data model/schema -> minimum MEDIA
3. Touches payment/billing LOGIC (write, compute, modify) -> minimum COMPLEXA. Read-only display rendering of billing data -> treat as UI domain, no automatic elevation.
4. Affects 3+ domains -> minimum MEDIA
5. Production incident -> minimum COMPLEXA

---

## Proportional Behavior by Complexity

| Aspect | SIMPLES | MEDIA | COMPLEXA |
|--------|---------|-------|----------|
| **Pipeline** | DIRETO (no pipeline) | Light variant | Heavy variant |
| **Batch size** | All at once | 2-3 tasks | 1 task |
| **TDD tests** | 1 main + 1 edge | 1 main + 1 regression + 1 edge | 1+ main + 2+ regression + 2+ edge |
| **Architecture review** | Skip | Per-batch | Per-batch (deep) |
| **Adversarial checklists** | IF auth touched: auth + injection; ELSE: skip entirely | auth + input-validation + error-handling | All 7 checklists |
| **Checkpoint validation** | Build only | Build + tests | Build + tests + regression |
| **Sanity check** | Build only | Build + tests | Build + tests + regression + coverage |
| **Pa de Cal criteria** | Build passes | Build + tests pass, no high vulns | Build + tests + no vulns + regression + AC met |

---

## Pipeline Routing Matrix

| Type \ Complexity | SIMPLES | MEDIA | COMPLEXA |
|-------------------|---------|-------|----------|
| **Bug Fix** | DIRETO | bugfix-light | bugfix-heavy |
| **Feature** | DIRETO | implement-light | implement-heavy |
| **User Story** | DIRETO | user-story-light | user-story-heavy |
| **Audit** | DIRETO | audit-light | audit-heavy |
| **UX Simulation** | DIRETO | ux-sim-light | ux-sim-heavy |

DIRETO = Direct execution without pipeline (build + test only, max 2 files, < 30 lines).

---

## Adversarial Gate Behavior by Complexity

| Aspect | SIMPLES | MEDIA | COMPLEXA |
|--------|---------|-------|----------|
| **Per-batch gate** | Ask (skippable) | Ask (skippable) | Ask (skippable) |
| **Mandatory override** | If auth/crypto/data touched | If auth/crypto/data touched | If auth/crypto/data touched |
| **Final review gate** | Recommended | Recommended | Strongly recommended |
| **Final review team** | 1 reviewer (security) | 2 reviewers (security + architecture) | 3 reviewers (security + architecture + quality) |
| **Final review intensity** | COMPLEXA (always full) | COMPLEXA (always full) | COMPLEXA (always full) |

### Gate Display Rules

1. Per-batch gate: Show AFTER checkpoint passes, BEFORE review-orchestrator
2. Final gate: Show AFTER sanity-checker, BEFORE final-validator
3. Always show token cost estimate for final review
4. Always show as "RECOMMENDED" or "STRONGLY RECOMMENDED" — never hide
