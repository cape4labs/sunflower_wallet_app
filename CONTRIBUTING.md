# Contributing

## Pull requests

- All changes go through pull requests, direct pushes to `main` are blocked.
- Open a PR from a feature branch (create it off `main`).
- We squash merge after review and passing checks.
- No force pushes or rebases onto main.
- Keep each pull request focused on a single logical change (one feature, fix, or refactor).

## Commits

- All commits must be signed (see [this](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)).
- All commits must follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

## General Conventions

- Don't create your own names (like "secret phrase" for describing mnemonic) to avoid confusion.
- Keep terminology consistent (if the UI says "mnemonic", code must say "mnemonic" as well). One concept = one name everywhere.
- Stick to English for all identifiers and comments. Follow proper English grammar rules as well.
- Avoid magic numbers and strings - define them as constants with clear names instead.
- Prefer clarity over brevity (`transactionId` is better than `txId`, unless the abbreviation is universally standard).

## Naming Conventions

- camelCase - functions, variables, hooks, utils
- PascalCase - components, classes, types
- UPPER_SNAKE_CASE - constants
