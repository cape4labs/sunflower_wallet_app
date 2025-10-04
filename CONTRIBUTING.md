### General Conventions
- Don't create your own names (like "secret phrase" for describing mnemonic) to avoid confusion.
- Keep terminology consistent (if the UI says "mnemonic", code must say "mnemonic" as well). One concept = one name everywhere.
- Stick to English for all identifiers and comments.
- Avoid magic numbers and strings - define them as constants with clear names instead.
- Prefer clarity over brevity (`transactionId` is better than `txId`, unless the abbreviation is universally standard).

### Naming Conventions
- camelCase - functions, variables, hooks, utils
- PascalCase - components, classes, types
- UPPER_SNAKE_CASE - constants
