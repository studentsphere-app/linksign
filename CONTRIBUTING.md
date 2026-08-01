# Contributing to linksign

Thank you for your interest in contributing to **linksign**! We welcome contributions of all forms, including bug reports, feature requests, documentation improvements, and code changes.

Please take a moment to review this document to ensure a smooth and efficient collaboration.

---

## Development Setup

This project uses `pnpm` as its package manager. Please ensure you have Node.js and `pnpm` installed.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/studentsphere-app/linksign.git
   cd linksign
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Build the package**:
   ```bash
   pnpm run build
   ```

---

## Workflows

### Running Examples

You can run the interactive example scripts to test changes:
- Run authentication example:
  ```bash
  pnpm run exemple:auth
  ```
- Run timetable/planning example:
  ```bash
  pnpm run exemple:timetable
  ```
- Run profile attributes example:
  ```bash
  pnpm run exemple:profile
  ```

### Development Watch Mode

To automatically rebuild files as you write code:
```bash
pnpm run dev
```

---

## Coding Guidelines

To keep the codebase clean, robust, and maintainable, please follow these rules:

1. **Strict Type Safety**:
   - Avoid using `any`. Use specific types or `unknown` where appropriate.
   - For catch clauses, use `error instanceof Error ? error.message : error` rather than `error: any`.
2. **Code Style**:
   - Use clean, semantic naming conventions.
   - Maintain the existing architecture (separate business logic like `timetable.ts` or `profile.ts` from type interfaces).

---

## Submitting Changes

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Commit your changes**: Write clear, descriptive commit messages.
3. **Push and create a Pull Request**: Submit your pull request to the `main` branch. Ensure that `pnpm run build` compiles with zero errors before opening the PR.
