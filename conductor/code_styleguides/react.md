# React Style Guide

## Architecture
- Use **Function Components** with Hooks.
- Prefer **Composition** over large, complex components.
- Keep components small and focused on a single responsibility.

## Props & Typing
- Define Prop types using interfaces or types.
- Destructure props in the function signature.
- Provide default values during destructuring.

## Hooks
- Follow the **Rules of Hooks**.
- Extract complex logic into **Custom Hooks**.
- Use `useCallback` and `useMemo` sparingly, only for performance-critical operations.

## Performance
- Use **React.lazy** for route-level code splitting.
- Minimize object creation in the render body.
- Optimize high-frequency updates with appropriate state management.

## Styling
- Use **Tailwind CSS** for layout and common utilities.
- Use **Vanilla CSS** for complex animations or highly custom components.
- Maintain consistent spacing and color tokens.
