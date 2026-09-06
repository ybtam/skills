# Iris theme and dark mode

Apply the Iris palette from T3 Code to the existing website and add persistent light/dark selection.

## Source and design

Use the exact Iris light palette and its existing dark variant from [themePalettes.ts](https://github.com/pingdotgg/t3code/blob/f8b4c464b4760d73e0ece7e68011c738803d8b69/packages/shared/src/themePalettes.ts). This is a color-theme change: retain the current typography, page structure and content.

The source is MIT licensed, copyright 2026 T3 Tools Inc. Include the required license notice and a source comment with the revision for the copied palette values. Copy only the tokens used by the website, not T3 Code's theme framework or unrelated palettes.

## Color mapping

| Website role | Iris token |
| --- | --- |
| Page/header background | canvas / chrome |
| Primary and secondary text | text / textMuted |
| Card and raised panels | surface / surfaceRaised / surfaceOverlay |
| Borders and inputs | border / input |
| Buttons and emphasized text | accent / accentForeground |
| Secondary controls and hover | secondary / secondaryForeground / toolbarControlHover |
| Focus indication | focus |
| Code and installation commands | codeBackground / codeForeground |

Replace hardcoded green, lime, white and gray values across cards, links, search, buttons, callouts, code blocks and focus states with semantic tokens. Keep hover states and text readable in both modes. Update the small brand/favicon treatment to match Iris. Use the same theme on the standalone 404 page.

## Theme behavior

Add an accessible native selector in the header with System, Light and Dark choices. Default to System and follow operating-system changes while that choice is active. An explicit Light or Dark choice persists across navigation and reloads. Keep the selector usable on mobile and by keyboard.

Apply the saved preference before the first paint. Handle unavailable or invalid local storage without breaking rendering; fall back to System. Keep server-rendered content and the initial client render consistent. Any deliberate root theme-attribute difference must be handled narrowly; do not hide general hydration failures. Respect reduced motion and avoid adding broad color-transition animation.

The 404 page should read the same preference and use the shared palette. Its return-to-catalog link must retain the configured hosting base. It can inherit the preference without adding a second settings UI.

## Implementation boundary

- Add a small shared Iris CSS token source, consumed by the main stylesheet and the generated 404 page.
- Add a focused theme preference module and header control; keep initialization logic reusable by the static 404 generator where practical.
- Update root document initialization, stylesheet colors, favicon, and 404 generation.
- Add attribution and focused verification. No new theme library or dependency is required.
- Preserve both root-path Docker hosting and /skills/ GitHub Pages hosting. Published skill content and standards are outside this change.

## Verification

- Check the copied token values against the pinned upstream source.
- Test preference resolution for missing, invalid and unavailable storage, manual overrides, and System behavior.
- Run lint, formatting, types and tests, then build both hosting variants and validate static output.
- Inspect catalog, a skill, a standards page and 404 in light and dark modes at desktop/mobile widths. Verify focus visibility, contrast, text/controls, persistence, OS preference changes and a clean console.
- Verify dark preference is applied before app hydration and that no light-theme flash is introduced during a reload.
- Deliver verified local changes and screenshots for review. Commit and publication follow when requested.

Implementation starts after the recorded Plannotator approval.
