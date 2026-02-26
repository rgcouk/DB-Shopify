# Track Specification: Product Detail Page (PDP) Redesign

## Summary
Transform the existing Product Detail Page from a standard technical data grid into a high-fidelity "Lux-Noir" narrative experience that matches the new homepage aesthetic. This involves immersive ingredient storytelling, dynamic "Honey Matrix" HUDs, and premium technical callouts.

## User Story
As a premium customer, I want to see the clinical and biological benefits of the products presented in a visually stunning and informative way, so I can trust the scientific rigor behind the "Wild-Sourced" brand.

## Acceptance Criteria
- [ ] **Hero Section**: Refined cinematic lighting and typography for the product selection area.
- [ ] **Immersive Ingredient Narrative**: Replace the `// CLINICAL_DEEP_DIVE` grid with a section featuring macro photography and floating technical callouts (e.g., Hericenones, Erinacines for Lion's Mane).
- [ ] **Honey Matrix PDP**: Integration of the bioavailability HUD specifically tailored for individual product benefits.
- [ ] **Technical Series Branding**: Consistent use of `SERIES // XXX` labels and sacred geometry watermarks.
- [ ] **Conversion Flow**: Clean, high-contrast "Add to System" button and price display.
- [ ] **Aesthetic Consistency**: Matches the "Lux-Noir" guidelines (obsidian matte backgrounds, high-contrast serif/mono typography).

## Scope
- `app/routes/products.$handle.tsx`: Central component for PDP.
- `app/styles/app.css`: Styling for new narrative sections.
- Asset creation: Macro images for mushrooms and product-specific delivery systems.
