# TypeScript Style Guide

## General Principles
- Use **strict mode** for all TypeScript files.
- Prefer **interfaces** over types for object definitions that might need extension.
- Use **functional programming** patterns where appropriate (immutability, pure functions).

## Naming Conventions
- **PascalCase**: Classes, Interfaces, Enums, Types.
- **camelCase**: Functions, Variables, Properties.
- **UPPER_SNAKE_CASE**: Constants.
- **kebab-case**: Filenames (unless it's a Component, then PascalCase).

## Type Safety
- Avoid using `any`. Use `unknown` if the type is truly unknown.
- Use **Explicit Return Types** for exported functions.
- Leverage **Discriminated Unions** for complex state/results.

## Documentation
- Use JSDoc for complex functions and public APIs.
- Keep comments concise and focused on "why", not "what".
