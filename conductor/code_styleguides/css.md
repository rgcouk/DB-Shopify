# CSS Style Guide

## General Patterns
- Use **Tailwind CSS** utility-first approach for most UI elements.
- Use **CSS Variables** for theme tokens (colors, fonts, spacing).
- Prefer **Flexbox** and **Grid** for layout.

## Organization
- Keep component-specific styles colocated if using Vanilla CSS modules.
- Use a central `app.css` for global tokens and resets.

## Naming (for Vanilla CSS)
- Follow **BEM (Block Element Modifier)** naming convention if not using CSS Modules or Tailwind.

## Responsiveness
- Follow a **mobile-first** approach.
- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, etc.).
- Avoid fixed heights and widths for containers where possible.
