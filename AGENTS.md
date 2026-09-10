# Repository Guidelines

## Project Structure & Module Organization

This repository is currently specification-first. The main product and UI requirements are documented in `document/hardware-shop-functional-spec-3-phases-themed.md`. `skills-lock.json` records the external agent skills selected for the project. Application source, tests, assets, and package metadata have not yet been added; place them in conventional top-level directories such as `src/`, `tests/`, and `public/` as implementation begins.

## Build, Test, and Development Commands

No build, development, or test scripts are configured yet. Once an application framework is introduced, document the canonical commands here and in the project README—for example:

```bash
npm install       # install dependencies
npm run dev       # start the local development server
npm test          # run the test suite
npm run build     # create a production build
```

Run commands from the repository root and keep generated output out of source directories.

## Coding Style & Naming Conventions

Follow the formatter and linter chosen when implementation is added; commit their configuration with the application. Use two-space indentation for JavaScript, TypeScript, JSON, and CSS unless the selected tool enforces another standard. Prefer descriptive `camelCase` variables and functions, `PascalCase` components/classes, and lowercase kebab-case filenames (for example, `product-card.tsx`). Keep customer-facing copy primarily in Vietnamese, consistent with the functional specification.

## Testing Guidelines

No testing framework or coverage threshold is configured. Add tests alongside the relevant feature or under `tests/`, using names that describe behavior (for example, `cart-add-item.test.ts`). Cover the purchase flow, cart state, address entry, and order confirmation when those features exist.

## Commit & Pull Request Guidelines

The repository has no commit history yet, so no established commit convention can be inferred. Use short imperative subjects, optionally scoped (for example, `Add product catalog layout`). Pull requests should explain the change, identify affected paths, include validation commands and results, link related issues, and attach screenshots for UI changes.

## Product and Configuration Notes

Preserve the dark industrial visual direction and palette defined in the specification. Do not add online payment without an explicit product decision. Keep secrets and local environment files out of version control; document required variables in an example environment file.
