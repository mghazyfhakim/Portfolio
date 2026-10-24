---
name: design-md
description: Use a DESIGN.md design-system file to drive UI generation. Pick a brand style from the VoltAgent/awesome-design-md catalog (84+ analyzed sites: Linear, Stripe, Vercel, Notion, etc.), drop the DESIGN.md into the project root, and build UI that stays visually consistent with it. Use when the user names a brand ("make it look like Linear/Vercel/Stripe"), asks for a design-system-driven build, or wants consistent UI across pages.
---

# DESIGN.md Workflow (VoltAgent/awesome-design-md)

A DESIGN.md is a plain-text design system document (concept from Google Stitch): one
markdown file that any AI agent reads to generate consistent UI. No Figma, no JSON.

## When to use
- The user names an existing brand/product look ("Linear-style", "like Stripe").
- A project needs one consistent look across many pages or sessions.
- You already have a DESIGN.md in the project root — then this file governs your build.

## Workflow
1. **Check for a DESIGN.md in the project root first.** If it exists, read it fully
   and treat it as the binding visual contract. Do not blend it with your defaults.
2. **If none exists and the user named a brand**, fetch one:
   - Catalog index: `skills/design-md/CATALOG-README.md` (lists all 84+ brands).
   - Bundled examples: `skills/design-md/example-vercel/DESIGN.md`,
     `skills/design-md/example-linear/DESIGN.md`.
   - Others: browse https://github.com/VoltAgent/awesome-design-md/tree/main/design-md
     or https://getdesign.md — each brand folder contains a DESIGN.md.
3. **Copy the chosen DESIGN.md to the project root.**
4. **Build UI strictly from its tokens**: colors, type, spacing, components, motion.
   Every visual decision must trace to a line in the file. If the file is silent on
   an axis (e.g. animation), decide once, minimally, and record it in your report.
5. **Report**: which DESIGN.md you used (brand + source), any axis you had to
   decide yourself, and where it deviates from the brand's real site (these files
   are third-party analyses, NOT official brand documents).

## Caveats (honesty rules)
- These files are summaries written by the VoltAgent team, not official brand docs.
- Never claim endorsement by the brand. Never copy trademarked logos.
- If two sources conflict (DESIGN.md vs user's own brand assets), the user's assets win.
