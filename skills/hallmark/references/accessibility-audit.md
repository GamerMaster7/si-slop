# Accessibility audit

Loaded only for `audit <target> --accessibility` or an explicit request for an accessibility audit. This is a read-only run. It reports what the available evidence supports and leaves every unexercised path visible.

## The claim

Use [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/) as the baseline. A source review, screenshot or automated run can find failures; none proves conformance by itself. Never write `compliant`, `screen-reader tested` or `passes` unless the receipt names the test, environment and observed result.

Label every conclusion:

| Label | Use it when |
| --- | --- |
| **Verified** | The behaviour was exercised in the named environment and observed. |
| **Source** | The expected mechanism is present in code, but its runtime behaviour was not exercised. |
| **Inferred** | The conclusion comes from a screenshot, description or partial source. |
| **Not tested** | The required state, tool, input method or assistive technology was unavailable. |
| **Not applicable** | The criterion does not apply; say why. |

`sloplint --render` is evidence for the states and widths it actually exercised. Its clean result is not a WCAG conformance result.

## The review

Check only the pages, states and tasks in scope.

**Perceivable.** Inspect landmarks, heading order, labels, instructions and meaningful image alternatives. Check text, non-text UI, focus, error, success and disabled-state contrast against the rendered background. Exercise text resize and reflow at 320 CSS px without loss of content or function. Where audio, video or motion exists, inspect alternatives, controls and reduced-motion behaviour.

**Operable.** Exercise the complete keyboard path: order, visible focus, activation, Escape, focus return and traps. Check bypass links where repeated content needs them. Confirm that hover-only interactions have equivalent keyboard and touch access. For drag, swipe, sortable and custom pointer controls, test the implemented alternatives and record pointer, touch and keyboard separately.

Report target size twice when the results differ. [WCAG 2.2 SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) is Level AA and requires a 24 by 24 CSS px target or an allowed exception such as sufficient spacing. [SC 2.5.5](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced) is Level AAA and uses 44 by 44 CSS px. Hallmark gate 39b separately prefers 44 to 52px marketing-page controls, with compact app controls expanding their hit target.

**Understandable.** Check visible labels and instructions, stable terminology, predictable focus and input, and recovery guidance. Exercise loading, empty, partial, error, success and destructive states that exist; status cannot rely on colour alone.

**Robust.** Inspect each control's name, role, value and state. Prefer native elements where they supply the needed semantics. Exercise status announcements and the keyboard and focus models for dialogs, menus, tabs, comboboxes and disclosures. When assistive-technology testing is available, name the platform, browser, product, version and task. Otherwise mark that path `Not tested`.

## Severity

- **Critical:** blocks a task, traps focus or input, hides essential information, or excludes a user group.
- **Major:** materially impairs completion, comprehension, navigation or recovery, but a workaround exists.
- **Minor:** creates friction or inconsistency without blocking the task.

## Receipt

```markdown
# Accessibility audit - <target>

- Standard: WCAG 2.2 AA
- Scope: <pages, states, components and tasks>
- Evidence: <source, sloplint, rendered browser, keyboard, touch, screen reader>
- Environment: <browser, viewport, OS, assistive technology and versions>

## Summary
- Critical: <N>
- Major: <N>
- Minor: <N>
- Not tested: <material gaps>

## Findings
| Severity | Criterion or Hallmark gate | Location | Evidence | Finding | Remediation |
| --- | --- | --- | --- | --- | --- |
| <level> | <WCAG SC or gate> | <file:line, route, state or element> | <label and observation> | <specific failure> | <specific correction> |

## Task paths
| Task | Input or assistive technology | Expected | Observed | Result and evidence |
| --- | --- | --- | --- | --- |

## Reflow, zoom and responsive behaviour
| Check | Environment | Result and evidence |
| --- | --- | --- |

## Verified strengths
- <one or two concrete strengths supported by evidence>

## Required follow-up
- <manual tests, missing states, owner decisions or none>
```

Keep a `Not tested` row whenever it is a material gap. Omit a table only when the whole section is not applicable, and say why.
