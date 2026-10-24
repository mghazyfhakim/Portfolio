# Portfolio — Muhammad Ghazy Fawaz Hakim

Personal portfolio of a software engineer based in Bandung, Indonesia.
Solo developer behind PT Puma Makmur Aneka Engineering's B2B platform,
ERP, and CI/CD pipeline. Currently shipping production code at three
live domains.

Live preview: see deployment URL after deploy.

## Tech stack

- Next.js 16 (App Router, RSC, server-side `/api/status`)
- React 19, TypeScript 5
- Tailwind CSS v4 (no UI library — custom design tokens)
- Motion via CSS + IntersectionObserver (`prefers-reduced-motion` aware)

## Live status board

The page polls `/api/status` every 60 seconds. The server endpoint
probes three production domains (`pumamakmurseal.com`,
`weavorystudio.com`, `pajak.pumamakmurseal.com`) with a 3-second
timeout and 60-second cache.

## Design contract

See [`DESIGN.md`](./DESIGN.md) for the full visual contract — palette
tokens, typography, motion dials, signature moves, and the single
explicit "no shadow" exception for the 3D extrusion monuments.

## Local development

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Build

```bash
npm run build
```

## License

Code: MIT (see `LICENSE` if added).
Brand assets (Puma Makmur, SIREKAS logos): property of respective
owners, used with permission.
Photos: see footer attribution for third-party assets.
