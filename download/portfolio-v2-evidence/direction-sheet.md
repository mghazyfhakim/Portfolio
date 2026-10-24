# DIRECTION SHEET — The pinned poster
seed 1703673662 · drawn 2026-10-24 · sector personal-portfolio · tone bold
Brief: Solo full-stack + AI engineer in Bandung, Indonesia; as the only developer at an industrial sealing factory he alone runs its entire live production estate: B2B RFQ platform, ERP admin, AI tax chatbot

| | |
| --- | --- |
| Direction | The pinned poster |
| Hero | Name split to corners |
| Type | Panchang / Switzer |
| Colour | Teal on paper |
| Sections | about (Pinned title, portraits pass) → work (Full panels, one midline row) → proof (Names running off the edges) → stats (Figure on the photograph's edge) → contact (The email as display type) → footer (Photograph half, menu half) |
| Motion | Pinned story |
| Photographs | the "Architecture" set, as atmosphere |

This is the direction for this build. Adopt it. Do not blend it with the layout you would have made anyway,
and do not redraw because it is unfamiliar: unfamiliar is the point. Redraw a slot only when it conflicts
with a stated brand constraint or needs an asset that does not exist, and say why in your report.

The parts of this sheet were written separately and will disagree in small ways. Settle every disagreement in this order:
**house rules** (including type no smaller than 13px and body text of 16px or more) → **the direction** (the idea, the composition habits, where the
one accent goes) → **the type system and the palette** (which face does which job, the five size steps, which colour is the ground and where the
accent goes) → **the hero blueprint** → **the section blueprints**. Under each blueprint below, "Adjusted for this page" lists where it disagrees.
In practice: take geometry from blueprints (columns, proportions, what sits where) and take everything else from above them. Map every size a
blueprint names onto one of your five type steps instead of adding a sixth. Use one button shape, one corner radius and one pair of page margins on
the whole page, whatever individual blueprints say. If a blueprint names a kind of typeface (a light serif, a heavy grotesk), use the dealt face.

## 1. The idea
Something stays put while everything else changes. A title holds its place across the viewport and the images beneath it swap; the name is split to two opposite corners and the page passes between the halves; a single frame stays centred while its contents change. Every scroll step is a new cover of the same magazine. The idea suits subjects that are a series (a book of portraits, a line-up, a collection, a set of projects): the fixed element says what the series is, the changing element shows its members.

Before anything else, write one sentence in your notes: "On this page, <the subject's own material> becomes <the device>."
Fill the first blank from your inventory of what only this client has (its name and what it means, its street, its numbers, its
constraint), then put the nearest competitor in the sentence: if it still works, the idea is the category's, not the client's.
Then name the one live thing the visitor can do on the page (SKILL.md step 4).

## 2. Composition
A sticky layer holds the fixed element for the height of two to three viewports: usually the title at 10–14vw across the middle or top of the screen, or two words pinned to the top-left and bottom-right corners. Under it, a stack of full-height panels scrolls by, each a single large photograph (portrait 4:5, centred, 40–50% of the viewport wide) with one line of caption at the same small size everywhere. The title sits above the images in the stacking order and uses `mix-blend-mode: difference` or a solid colour that reads on every panel. When the pinned run ends, the page releases into ordinary flowing sections with a narrow measure. Build with `position: sticky`; never hijack the scroll.

## 3. Type — Panchang / Switzer
A flat-sided extended grotesk in heavy capitals, wide enough that two words fill the screen, with a neutral sans kept small. Suits portfolios, real estate, travel and brand sites that want a broad, confident wordmark.
```html
<link rel="preconnect" href="https://api.fontshare.com">
<link rel="preconnect" href="https://cdn.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=panchang@700&display=swap" rel="stylesheet">
<link href="https://api.fontshare.com/v2/css?f[]=switzer@400,500&display=swap" rel="stylesheet">
```
- Display: **Panchang** — weight 700 · tracking -0.02em · leading 1.0 · uppercase; four words or fewer per line because the face is very wide
- Text: **Switzer** — 400 for body, 500 for emphasis · leading 1.5 · tracking 0
```css
:root {
  --step-small: clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem);
  --step-body: clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem);
  --step-lead: clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem);
  --step-head: clamp(2rem, 1.3rem + 3.2vw, 4rem);
}
```
The pinned title is the only large type on the page. Captions and body share one small size (15–17px). Tight tracking and solid weight so the title reads over photographs.
The direction decides sizes and how many of them; the type system decides how this face is set. Where the two give different tracking or leading, use the values of the type system: they are tuned to this face.
The display size itself comes from the hero blueprint below.

## 4. Colour — Teal on paper
```css
:root {
  --bg: #f7f9f8;
  --surface: #ebf0ee;
  --ink: #06525c;
  --muted: #2f737d;
  --accent: #06525c;
  --accent-ink: #f7f9f8;
  --field-1: #06525c;  --field-1-ink: #f7f9f8;
}
```
Cool white paper and a single teal used for every word, shape and button, with no black anywhere. The accent is that same teal filled solid, for the button and for one inverted band with paper-coloured type.
One strong title colour against a pale or dark ground. Each panel may take its own flat ground colour sampled from its photograph.

## 5. Imagery
**The project has no photographs of its own yet.** First choice: **real pictures of the subject's world from the open collections**: its city and street in old postcards and photographs, an old map of the neighbourhood, its materials up close, its trade in engravings, museum objects of its kind (references/imagery.md §3). Start with `node /home/z/my-project/.taste-skill-repo/skills/taste-skill/scripts/assets.mjs "bandung postcard"`, then "bandung old map" and "production estate", then queries from your inventory (its street, its materials, its trade's tools and history). Download what you use into the project with `--get` and credit every one on the page (`--credits` prints the footer line). They show the world around the client, never the client's own room, dish, product, person or team. Second, for what no honest picture exists of: draw the subject's own things in code, large, in one flat graphic language and the palette's real colours (its tiles, its windows, its objects; references/imagery.md §8). Third: the dealt photographs, only where an honestly generic picture fits (the sea, the weather, a material), never one a visitor could take for the thing itself and never an unrelated scene. One treatment for all of them. If this direction is built on photographs, plan the set before building (four to six pictures of one family) and reuse them at different crops and scales instead of finding or drawing a new picture for every slot; keep drawings as `<symbol>` + `<use>` or generate them with a small script so the page stays light. List every found picture (with its source and licence), every dealt photograph and every drawing that stands in for photography in your report.

A series of photographs with the same crop ratio and the same framing (all portraits, all objects, all rooms), so that swapping them reads as one image changing. Five to eight in the pinned run.

**Floor (the inspector checks it):** at least four real pictures on the page, usually six to twelve; SVG drawings do not count. One moving picture where an honest clip exists: `node <skill>/scripts/assets.mjs --video "<query>"`, used as a muted loop with a poster frame. Whatever this direction says about pictures, it is carried out with real ones.

Photographs dealt for this build, from the "Architecture" set (structure, lines, bridges, facades and building interiors)
Order of preference for imagery: (1) the project's own photographs and product shots; (2) images you generate, if an image tool is
available; (3) real pictures of the subject's world found in the open collections (assets.mjs, downloaded and credited on the page);
(4) drawings of the subject in code; (5) these. They are real photographs (Unsplash licence, served by picsum.photos) of places, light and
texture. They are atmosphere, never a stand-in for a specific product, dish, person or interface. List the ones you use in your report so
they can be replaced.
- `https://picsum.photos/id/781/1600/1000` — Dark station platform with a row of bright windows, black and white · dark tone · black, white, charcoal · black-and-white · calm area: top · native landscape · photo: Matthew Wiebe
- `https://picsum.photos/id/887/1600/1000` — White apartment block facade with repeating balconies and windows · light tone · white, pale grey, soft red · native landscape · photo: Roman Kraft
- `https://picsum.photos/id/620/1600/1000` — White arched bridge spanning grey water under a pale sky · light tone · white, pale grey, charcoal · black-and-white · calm area: bottom · native landscape · photo: Matthew Wiebe
- `https://picsum.photos/id/693/1600/1000` — Red suspension bridge tower rising from fog above rugged cliffs · mid tone · rust red, grey, dark teal · calm area: left · native landscape · photo: Rob Bye
- `https://picsum.photos/id/855/1600/1000` — Small figure walking past a huge bright yellow wall · light tone · bright yellow, black · calm area: left · native landscape · photo: Rodion Kutsaev
- `https://picsum.photos/id/1081/1600/1000` — Stepped white modern building corner rising into a pale blue sky · light tone · white, pale blue, soft grey · calm area: top · native landscape · photo: Julien Moreau
- `https://picsum.photos/id/954/1600/1000` — Narrow opening in a white wall revealing a white staircase · light tone · off-white, pale beige · calm area: left · native landscape · photo: Todd Quackenbush
- `https://picsum.photos/id/618/1600/1000` — Curving glass and steel lattice roof in black and white · light tone · white, grey, black · black-and-white · native landscape · photo: Mika Ruusunen
The last two path numbers are width and height: request the exact crop you render (`/1200/1500` for a 4:5 portrait, `/2400/1350` for a hero) and
add `?grayscale` to desaturate. Use three to six of them, not all eight. Always set `width`, `height`, `alt` and `loading="lazy"` (not on the hero image).
Other sets that fit this brief: object-still, people, fog-and-quiet, coast — `node draw.mjs --photos <set>` prints one in full; `--photos list` shows all sets. Taking photographs from another set is your call and is not a redraw; keep them to one light and one treatment.

## 6. Hero — Name split to corners
The name is cut into two halves that stay pinned to opposite corners while the page passes between them. A layer with `position: sticky; top: 0; height: 100svh` and `pointer-events: none` holds both: the first word top-left, 28px from the top and left edges; the second word bottom-right, 28px from the bottom and right edges. Both are set at clamp(72px, 9vw, 140px), line-height 0.85, in white with `mix-blend-mode: difference` so they read on every panel beneath. On the first screen the stage between them is a paper-white panel on columns 1–9 and one full-height photograph on columns 10–12 touching the top, right and bottom edges. The supporting sentence, 20px and max 34ch, starts at column 3 at 44% of the height; the single action is a text link with an arrow directly under it. Three text links are stacked at 15px along the right edge of the white panel at mid-height. The rest of the panel is empty. Later panels, full-height photographs and text panels of different widths, scroll under the pinned halves for three to five viewports; then the layer releases into ordinary sections.

On a phone: Both halves stay pinned: the first word top-left and the second bottom-right, each at 15vw with 16px margins. Between them every panel is a full-width photograph 56svh tall followed by its sentence at 17px. On the first screen the photograph crosses the middle band with the supporting sentence and the action link beneath it. The stacked links collapse to one word at the top-right corner.
Headline: The name in two halves (two words, or one word cut at a syllable), each up to about 9 characters at 9vw, one per corner, with no other headline.

Adjusted for this page:
- It names colours (white): map them onto this palette's roles (ground `--bg`, panels `--surface` and the fields, text `--ink`/`--muted`, the accent `--accent` on the primary action only).
- It pins something for three screens or more: hold a pin for two or three screens at most, give every screen under it its own content, and let nothing pass over the pinned words (the inspector checks all three).
- It blends text with `difference`: over anything but black, white or grey that gives random hues. Use a solid ink chosen for each ground instead.
- Its action is a text link: the primary action on the first screen is a real button (filled or solid-bordered, 44px or taller), placed where the blueprint puts the link. A second action may stay a link.

## 7. Sections, in order
Each is a composition to rebuild with this project's content. Keep the geometry; change the subject. Re-order or drop a
section when the argument of the page needs it (see references/copy.md), never to fall back to a card grid.

### 1. about — Pinned title, portraits pass (pinned)
A wrapper tall enough for its portraits: about 90svh per person, up to six people. A `position: sticky; top: 0` layer of 100svh holds the heading, two words at clamp(88px, 12vw, 180px), leading 0.85, centred at mid-height, in white with `mix-blend-mode: difference` so it reads over ground and photographs alike. Beneath it in the stacking order, portraits scroll past in normal flow: each a 4:5 photograph 26–30vw wide, alternately starting at column 2 and ending at column 11, 60svh apart, so each one passes behind a different half of the heading. Under each portrait's left corner: the name at 18px, the role at 14px in the soft ink, and one sentence of up to 30 words in a 280px measure. The last portrait is followed by 40svh of empty ground before the heading releases. Square corners. Nothing else is on screen.
On a phone: The heading shrinks to 17vw and pins 16px from the top instead of at mid-height. Portraits become 72% wide, alternating between the left and right margins, 48px apart, each with name, role and sentence beneath at the portrait's width.

Adjusted for this page:
- It names colours (white): map them onto this palette's roles (ground `--bg`, panels `--surface` and the fields, text `--ink`/`--muted`, the accent `--accent` on the primary action only).
- It blends text with `difference`: over anything but black, white or grey that gives random hues. Use a solid ink chosen for each ground instead.

### 2. work — Full panels, one midline row (full-bleed)
Four to seven consecutive panels, each 100vw by 100svh, butted together with no gap. Each panel is one photograph of the project cropped much tighter than its frame (`object-fit: cover` with the image scaled to 130%), so a detail fills the screen. The same three-part text row sits at exactly 50% of the height on every panel, in white with `mix-blend-mode: difference` or over a neutral dark scrim band 90px tall: the date or year at the left margin at 15px, the project title in capitals at clamp(22px, 2vw, 30px) starting 10% in from the left, and one fact (location, client, number of pieces) at the right margin at 15px. Because the row never moves, scrolling reads like turning plates in a book. Panels may be `position: sticky; top: 0` so each slides over the last. There is no section heading; the first panel's title row is the heading.
On a phone: Panels are 100vw by 82svh. The row drops to the bottom of each panel, 20px above its edge: the title at 22px on the first line, then date at the left and fact at the right on a second line at 13px, over the same scrim band.

Adjusted for this page:
- It names a kind of typeface: use the dealt faces (display Panchang, text Switzer) and their settings; capitals only where the type system sets them.
- It names colours (white): map them onto this palette's roles (ground `--bg`, panels `--surface` and the fields, text `--ink`/`--muted`, the accent `--accent` on the primary action only).
- It blends text with `difference`: over anything but black, white or grey that gives random hues. Use a solid ink chosen for each ground instead.

### 3. proof — Names running off the edges (band)
A full-bleed band in a flat colour, about 34vh tall, holding a single line of names that is cropped by both viewport edges. The names are set at 8vw in the display weight, `white-space: nowrap`, separated by a solid round dot one third of the cap height, and the line moves slowly to the left (a CSS `translateX` animation over 40 seconds on a duplicated track, paused under `prefers-reduced-motion`). The band has no heading. Its meaning comes from one sentence at 18px set directly below the band at the left margin on the page ground, stating plainly who these names are. Supplied logos may replace names if all are available as single-colour SVGs at 0.8em height; do not mix logos and set names in one line. The band butts against the sections above and below with no gap.
On a phone: The band is 22vh tall with names at 15vw, still cropped at both edges and still moving. The explaining sentence sits under it at 16px with 20px margins. Do not add a second line running the opposite way; one line is the idea.

### 4. stats — Figure on the photograph's edge (full-bleed)
One full-bleed photograph, 100vw by 88svh, and one figure set on it the way a film title sits on a frame. The figure, with its unit, is at clamp(120px, 17vw, 280px), leading 0.8, in paper colour, hugging the bottom-left corner with 24px margins, its baseline nearly on the photograph's lower edge. A neutral dark scrim covers only the bottom 35% of the image for legibility. On the same baseline at the right margin, right-aligned, a sentence of up to 26ch at 18px explains the figure. At the top-left, small at 20–24px, sits the heading of two to four words; the middle of the photograph stays clear. Two smaller supporting figures may follow below the photograph, on the ground: each at 40px with a one-line caption beside it, starting at columns 1 and 7, 40px under the image. Choose a figure that belongs to the picture: a height, a distance, a temperature, a year.
On a phone: The photograph is 80svh, cropped to its subject. The figure sits bottom-left at 30vw; the sentence moves above it at 16px, left-aligned. Supporting figures stack under the photograph at 32px, each with its caption on the line beneath.

### 5. contact — The email as display type (statement)
The section is 100svh in the inverse of the page's colours. A single email address is set as one line of display type spanning the content width: the font-size is fitted so the address runs from margin to margin (about 7–9vw for 20 characters; break after the @ onto two lines if it is longer than 26), light or regular weight, tight tracking, sitting on a baseline 12vh above the bottom edge. It is a `mailto:` link; on hover the whole line takes the accent ink. In the top-left corner, a sentence of up to 12 words at 20–22px says what to write about. In the two bottom corners at 14px: phone and city at the left, two or three social links at the right. No heading and no form. For a pinned ending, make the section `position: sticky; bottom: 0` beneath the page so the previous section lifts off it.
On a phone: The address breaks after the @ onto two lines at 11.5vw, left-aligned, sitting at 55% of an 86svh screen. The sentence sits at the top-left at 18px. Phone, city and social links stack at the bottom-left at 15px with 12px between them.

### 6. footer — Photograph half, menu half (split)
A split footer one viewport tall. The left half is a single photograph filling columns 1–6 edge to edge, cropped hard by the left and bottom viewport edges: a close crop of the page's main subject, larger than it appeared anywhere above. The right half, on a flat field, is the site's menu set large: five or six section names stacked as links at about 2.6vw bold, 28px apart, starting at column 8 and 80px from the top. Rows are separated by space only; on hover a row's label shifts right by 12px and the others drop to the softer ink. Under the menu, 64px lower, two short blocks at 15px side by side: contact and social. The legal line runs along the very bottom of the right half at 12px. The wordmark sits small at the top of the right half, on the menu's left edge.
On a phone: The photograph leads at full width and 50svh, cropped tight. The menu follows on the flat field at 8vw per item with 20px between items, then contact and social stacked at 15px, then the legal line at 12px. The wordmark sits small above the menu.

Adjusted for this page:
- It sets text at 12px: use your small step (13px or more) instead.

## 8. Motion — Pinned story
One element holds its place with `position: sticky` (a title, a frame, a product fragment) while the items that belong to it scroll past or swap inside it. The page's ordinary scrolling does the work; nothing is hijacked. Hold it for about one screen per step and three screens at most, two held stages per page at most, with a line of text on every held screen. Recipe: 'Pinned story' in references/motion.md.
This is the signature move, the one loud moment. Around it the page still needs the rest of the motion layer (SKILL.md step 9): an entrance for the parts of every section, feedback on every control, and one moving picture. The inspector fails a page that barely moves. Recipes: references/motion.md.

## 10. Where the richness comes from
Repetition with change. The fixed title makes each new photograph feel like an event, so the photographs must be good and consistent.

## 11. How this direction goes wrong
If the title is not legible over every panel, the idea fails: test each one. Keep the pinned run under six viewports or it feels like a trap. On a phone the title shrinks to 16–18vw and stays pinned at the top; panels become full-width. A pin longer than three screens, or one where the screens under it are nearly empty, read in blind tests as a stuck page. Every screen under the pin needs its own content, and nothing may pass over the pinned words.

## 12. Real references
Studied sites that work this way. Take the principle, never the specifics: no names, copy, images or signature assets of theirs.
- **Glitch&Grit** (Awwwards Site of the Day, studied score 7.5) `aww-glitch-grit`
  Idea: Every screen is one project: two half-width footage columns with the project name stacked dead centre across their seam in a single flat pastel that changes per project.
  Hero: Black viewport split down its vertical centre. The left half holds a huge flat grey flower silhouette bleeding off the left and bottom edges; the right half is black with a few tiny video thumbnails drifting through. Dead centre, straddling the split, sits a two-line uppercase title in mint green, about 11vw per line, lines almost touching, spanning roughly 70% of the width. Two tiny category lines sit directly above it and a tiny 'view full project' link directly below, all in the same green. Navigation is six small bold white words pinned to the frame: three links across the top edge, the three-part studio name across the bottom edge.
  Worth taking: Break the studio name into three words pinned bottom-left, bottom-centre and bottom-right, mirroring three nav links across the top, so the viewport frame itself is the logo.
- **Revelatio Studio** (Awwwards Site of the Day, studied score 7.6) `aww-revelatio-studio`
  Idea: The team photograph is the hero: it starts as a small CRT-curved mosaic of typographic glyphs and resolves into a full-bleed group portrait as you scroll.
  Hero: Pure black viewport. Centred, about 58% of the width and 57% of the height, is a canvas showing a group photo rebuilt from tiny coloured glyphs, its edges barrel-distorted like a CRT tube; it is dim, so black dominates. The headline is modest: two lines at 2.5vw in regular-weight grotesk, flush to the bottom-left corner with a 30px margin. Navigation is split into two small dark-grey rounded rectangles: logo mark plus four links top-left, language switch and contact top-right. Nothing else; roughly 80% of the screen is black.
  Worth taking: Render a photograph as a grid of small coloured glyphs on canvas and let scroll increase its size and resolution until it becomes the real photo.
- **Belen Jones** (One Page Love, studied score 7.2) `opl-belen-jones`
  Idea: The whole portfolio is one screen: a slowly turning 3D box skinned with project footage behind a floor-to-ceiling list of outlined client names.
  Hero: One viewport, no scroll. A flat pastel field (periwinkle on load) with a large black-edged 3D box, about half the viewport wide, rotating right of centre; each face shows a project film still. Over everything, nine project names are stacked flush-left from top edge to bottom edge in an ultra-bold extended sans at 7.6vw, caps, drawn as thin outlines only, lines almost touching; the active name is filled solid. Two small white pill buttons sit top-right; a two-line mono location and clock bottom-right. On first load only the box is visible, drifting in from the right with its texture mirrored, before the list appears.
  Worth taking: Set a project list as outline-only giant caps over the media and fill just the active line, so the list is both navigation and texture.
Full notes on any of them: `node draw.mjs --site <id>`.

## Always
Headlines two lines or fewer at every width. No eyebrow labels, no monospace, no 01/02/03, no thin rules, no gradients, no shadows at rest,
no cream-and-terracotta, no violet. The frame: one h1 on the first screen that says what this is, equal outer margins, no
section huddled on one side with the other half empty, no blank stretch over half a screen, a heading on every section.
`inspect.mjs` measures all of it.

Saved to /home/z/my-project/.taste-skill/direction.json · reprint with `node draw.mjs --show`
