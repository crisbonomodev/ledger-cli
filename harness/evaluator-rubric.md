# Evaluator Rubric

Score each dimension 0-2. An independent evaluator session fills this out —
never the session that implemented the feature.

## Dimensions

1. **Correctness** — does the implementation match the target behavior in feature_list.json?
2. **Contract fidelity** — does it match the data shapes, naming, and file locations
   specified in the sprint contract? (Not just "does it work" — "did it follow the plan.")
3. **Verification** — were the required checks actually re-run by the evaluator,
   independently, not just trusted from the implementer's notes?
4. **Scope discipline** — did it stay within the sprint contract's scope and exclusions?
5. **Reliability** — does the result survive `rm -rf dist && ./init.sh` from clean?
6. **Handoff readiness** — is claude-progress.md accurate and complete?

## Conclusion

- **Accept** — all dimensions score 2, or a documented exception is acceptable.
- **Revise** — specific dimension(s) scored 0-1; list exactly what to fix.
- **Block** — fundamental issue; feature returns to `in_progress` or `not_started`.