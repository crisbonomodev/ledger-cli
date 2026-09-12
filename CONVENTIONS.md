# Coding conventions for this project

- Complex return types belong to src/types/types.md. Do not add them inline in the method.
- Never mutate a saved transaction
- Ledger methods always read the disk from zero at start
- Do not add a CLI Framework
- Every new Ledger method needs a happy path test and an empty/limit validation
- Test descriptions are written in english.