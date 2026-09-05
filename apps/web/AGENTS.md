# A letter to website contributors

Dear agent,

This is the first real evaluation of our repository setup skill. Keep its catalog sourced from `skills/` and its documentation sourced from `standards/`. The content generator writes an ignored module before type checking and building. The router-generated route tree is checked in so a clean checkout can typecheck before the first Vite build.

Put domain features under `src/contexts/`. Keep framework routes thin when a feature has substantial behavior. The standards route is a layout with an Outlet; its index lists documents and its slug route renders their full content.

Preserve static hosting. UTF-8 and viewport metadata belong in the root document; the former prevents production hydration mismatches on servers without an encoding header. Use the shared config defaults and keep browser-specific TypeScript settings here. The build prerenders every public page, and the root static-output check verifies document bodies and reference links.

Treat motion as support for interaction. Keep keyboard focus, reduced-motion behavior, mobile width, and copy failures usable. Upstream skill ownership stays explicit. Avoid adding server features or local services without a real project requirement.

Thank you,
Yi
