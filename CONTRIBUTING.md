# Contributing to PHC Copilot

Thank you for your interest in contributing to PHC Copilot!

## Development Setup

1. Fork and clone the repository
2. Run `npm install` to install dependencies
3. Copy `.env.example` to `.env.local` and fill in your credentials
4. Run `npm run dev` to start the development server

## Code Style

- **Language:** TypeScript (strict mode)
- **Framework:** Next.js 16 App Router
- **Styling:** Vanilla CSS with CSS-in-JS (`<style jsx>`) for component-scoped styles
- **Components:** Functional components with React hooks
- **Data Layer:** Repository pattern for Firestore access

## Branch Naming

- `feat/` — New features
- `fix/` — Bug fixes
- `docs/` — Documentation changes

## Commit Messages

Follow conventional commits:

```
feat: add medicine expiry alerts
fix: sidebar hover contrast on active nav item
docs: update README with deployment steps
```

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes with clear commit messages
3. Run `npm run build` to verify zero errors
4. Submit a PR with a description of your changes
