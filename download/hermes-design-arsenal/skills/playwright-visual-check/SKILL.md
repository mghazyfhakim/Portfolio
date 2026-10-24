---
name: playwright-visual-check
description: Drive a real browser via Microsoft Playwright CLI to self-check frontend work before showing it to the user. Take screenshots of the built page, read console and page errors, verify layout at desktop and mobile widths, and fix what is broken. Use after building or editing any web page, or when the user asks to verify/preview/test UI.
---

# Playwright Visual Self-Check (Microsoft Playwright CLI)

You look at what you built before you ship it. A passing build is not a working page.
This skill uses the official Microsoft Playwright CLI (`microsoft/playwright-cli`,
Apache-2.0) — token-efficient CLI commands instead of MCP.

## One-time setup (per machine)
```powershell
npm install -g @playwright/cli@latest
playwright-cli --help
# optional: install the skill for coding agents
playwright-cli install --skills
```
If the CLI is not installed, ask the user or install it; do not fake the check.

## The check loop (run after every build/edit)
```powershell
# 1. open the local page
playwright-cli open http://localhost:3000

# 2. console + page errors FIRST
playwright-cli console
playwright-cli errors

# 3. screenshots — desktop
playwright-cli screenshot --filename .check/desktop-top.png
playwright-cli eval "window.scrollTo(0, document.body.scrollHeight)"
playwright-cli screenshot --filename .check/desktop-bottom.png

# 4. mobile width (Next dev: reload after resizing viewport is not needed; resize then re-shoot)
playwright-cli eval "window.resizeTo(390, 844)"   # or use --viewport on open if supported
playwright-cli screenshot --filename .check/mobile.png

# 5. interaction smoke test: click the main interactive elements by ref from a snapshot
playwright-cli snapshot
playwright-cli click <ref>
playwright-cli errors
playwright-cli close
```

## Pass criteria (all must hold)
- 0 page errors, 0 unexpected console errors (dev-tooling noise excluded).
- Page renders content at both widths — no blank screen, no hydration error screen.
- Every interactive element you built responds (expand/click/navigate) and stays
  keyboard-reachable (Tab reaches it, focus is visible).
- Screenshots show no overlapping text, no clipped content, no broken layout.
- The footer sits at the bottom on short pages and is pushed down on long pages.

## Failure protocol
1. Read the error, find the root cause in code (not in symptoms).
2. Fix, rebuild/reload, rerun the FULL loop (not just the failed step).
3. Max 3 rounds; then report honestly what still fails and why.

## Honesty rules
- Never claim a screenshot you did not take, or a clean console you did not read.
- If the CLI cannot run in the user's environment, say so and propose installing it —
  do not substitute a verbal "it should work".
- Keep screenshots in `.check/` and list their paths in your report so the user can look.
