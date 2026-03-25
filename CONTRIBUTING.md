### Setup Instructions

Before starting, make sure you have completed the [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment). You must also have pnpm of version 10 or higher installed on your machine.

1. Install dependencies in the root directory:

   ```bash
   pnpm i
   ```

2. Start the Metro bundler:

   ```bash
   pnpm run start:mobile
   ```

3. Build for android. Make sure you have an emulator installed or a physical android phone connected.

   ```bash
   pnpm build:mobile
   ```

### Miscellaneous

- Install pre-commit hooks:

  ```bash
  pnpm run prepare
  ```

- Run tests

  ```bash
  pnpm run test:mobile
  ```
