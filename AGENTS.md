# Repository Guidelines

## Project Structure & Module Organization

This repository contains a Next.js App Router storefront. Routes live in `app/`, reusable UI in `components/`, domain utilities in `lib/`, tests in `tests/`, and Supabase configuration and migrations in `supabase/`. Product and UI requirements are documented in `document/hardware-shop-functional-spec-3-phases-themed.md`.

## Build, Test, and Development Commands

```bash
npm install       # Install dependencies
npm run dev       # Start local development
npm run lint      # Run ESLint
npm test          # Run Vitest
npm run build     # Create a production build
npm run check     # Run lint, tests, and production build
```

Run commands from the repository root and keep generated output out of source directories.

## Coding Style & Naming Conventions

Follow the formatter and linter chosen when implementation is added; commit their configuration with the application. Use two-space indentation for JavaScript, TypeScript, JSON, and CSS unless the selected tool enforces another standard. Prefer descriptive `camelCase` variables and functions, `PascalCase` components/classes, and lowercase kebab-case filenames (for example, `product-card.tsx`). Keep customer-facing copy primarily in Vietnamese, consistent with the functional specification.

## Testing Guidelines

Vitest is configured for domain-level tests under `tests/`. Use behavior-oriented names such as `cart-add-item.test.ts`. Cover the purchase flow, cart state, address entry, and order confirmation as those areas change.

## Commit & Pull Request Guidelines

The repository has no commit history yet, so no established commit convention can be inferred. Use short imperative subjects, optionally scoped (for example, `Add product catalog layout`). Pull requests should explain the change, identify affected paths, include validation commands and results, link related issues, and attach screenshots for UI changes.

## Product and Configuration Notes

Preserve the dark industrial visual direction and palette defined in the specification. Do not add online payment without an explicit product decision. Keep secrets and local environment files out of version control; document required variables in an example environment file.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
