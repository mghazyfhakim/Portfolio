// ============================================================
// DATASET — single source of truth for the portfolio content.
// Edit THIS file only. Items marked [EDIT] need real data swap
// before launch (taste-skill rule: never ship invented proof).
// ============================================================

export const identity = {
  partName: "MUHAMMAD GHAZY FHAKIM",
  shortName: "GHF",
  designation: "AI ENGINEER / WEB DEVELOPER",
  org: "PT PUMA MAKMUR AE — INDUSTRIAL SEALING B2B", // [EDIT] confirm wording
  location: "JAKARTA, ID",
  timezone: "Asia/Jakarta",
  email: "hello@ghazyfhakim.dev", // [EDIT] real email
  github: "https://github.com/mghazyfhakim", // [EDIT] confirm handle
  heroStatement:
    "I build AI agent systems and industrial-grade web tools: measured, benchmarked, shipped.",
  material: "HUMAN + EPDM-GRADE PERSISTENCE", // datasheet MATERIAL cell, playful but real
  scale: "1:1",
  revision: "A",
  issueDate: "2026-10-24",
  drawnBy: "GHF",
  checkedBy: "HERMES AGENT", // the rival builder — honest nod to the A/B test
};

export const sheetMeta = {
  docCode: "DATASET GHF-2026",
  totalSheets: 5,
};

export const materials = [
  "TYPESCRIPT",
  "NEXT.JS",
  "PYTHON",
  "GO",
  "TAILWIND",
  "PROMPT ENGINEERING",
  "OLLAMA / LOCAL LLM",
  "CI PIPELINES",
  "BENCHMARKING",
  "SYSTEM DESIGN",
];

export type Component = {
  code: string;
  name: string;
  category: string;
  year: string;
  status: "IN PRODUCTION" | "DELIVERED" | "ARCHIVED" | "PAUSED" | "SHIPPED";
  description: string;
  stack: string[];
  measured: string; // one honest, measured result
};

export const components: Component[] = [
  {
    code: "HMA-01",
    name: "Hermes Agent System",
    category: "AI AGENTS",
    year: "2026",
    status: "IN PRODUCTION",
    description:
      "Persona, seven custom skills, and an eval harness for a local-first AI agent. Tuned until function-calling behaviour is deterministic instead of hopeful.",
    stack: ["Hermes Agent", "YAML", "PowerShell", "Prompt systems"],
    measured: "100% function-call accuracy (10/10) on a custom eval set",
  },
  {
    code: "ERP-BP-02",
    name: "B2B ERP Blueprint",
    category: "SYSTEM DESIGN",
    year: "2026",
    status: "DELIVERED",
    description:
      "A 17-sheet technical blueprint: dual-track strategy, cost model, six-month roadmap and risk matrix for a sealing distributor moving to a hybrid ERP.",
    stack: ["Python / ReportLab", "HTML/CSS", "Cost modelling"],
    measured: "17 pages, zero-cost architecture, 2-track rollout plan",
  },
  {
    code: "BMK-03",
    name: "Local LLM Benchmark Harness",
    category: "TOOLING",
    year: "2026",
    status: "ARCHIVED",
    description:
      "Repeatable eval set and benchmark scripts for local models on modest hardware. Built to answer one question: is this model usable for real work?",
    stack: ["Ollama", "PowerShell", "JSON eval sets"],
    measured: "6.14 tok/s at Q4_K_M on 12 GB DDR5 single-channel",
  },
  {
    code: "CNT-04",
    name: "Industrial Content Engine",
    category: "MARKETING OPS",
    year: "2025",
    status: "PAUSED",
    description:
      "Brand voice, four personas and a threat-weapon-proof rotation system for B2B industrial content. Shipped as a document system an agent can execute.",
    stack: ["Markdown systems", "Browser automation"],
    measured: "4 personas, full rotation playbook, agent-executable",
  },
  {
    code: "WEB-05",
    name: "This Datasheet",
    category: "WEB",
    year: "2026",
    status: "SHIPPED",
    description:
      "A portfolio rendered as an engineering drawing set. Hand-rolled motion, zero UI libraries, zero runtime dependencies beyond the framework itself.",
    stack: ["Next.js 16", "Tailwind 4", "Hand-rolled SVG/JS"],
    measured: "0 UI library dependencies, reduced-motion safe",
  },
];

export type EnvelopeRow = {
  domain: string;
  material: string;
  rating: string;
  note: string;
};

export const envelope: EnvelopeRow[] = [
  {
    domain: "AI AGENT ENGINEERING",
    material: "Hermes, Ollama, eval harnesses",
    rating: "100% FC ACC",
    note: "Function calling tuned to determinism on consumer hardware.",
  },
  {
    domain: "WEB ENGINEERING",
    material: "Next.js, TypeScript, Tailwind",
    rating: "ZERO-DEP UI",
    note: "Interfaces built by hand where a library would be a confession.",
  },
  {
    domain: "INDUSTRIAL B2B",
    material: "Sealing components, datasheets",
    rating: "FIELD-TESTED",
    note: "Day job: gaskets, mechanical seals, and the documents that sell them.",
  },
  {
    domain: "DATA & TOOLING",
    material: "Python, benchmarks, CI rules",
    rating: "REPEATABLE",
    note: "If it cannot be re-run, it did not happen.",
  },
];

export const serviceLog = [
  {
    date: "2026-10",
    unit: "DATASET GHF-2026",
    action:
      "Drawing set published. Built twice: once by a human-directed AI engineer, once by a Hermes Agent, to be judged blind.", // [EDIT] after the A/B test
    result: "SHEET 1-5 ISSUED",
  },
  {
    date: "2026-09",
    unit: "HERMES AGENT",
    action:
      "Agent tuned: persona locked, seven skills installed, eval harness run. Function-call accuracy held at 10/10 across the set.",
    result: "QC PASSED",
  },
  {
    date: "2026-08",
    unit: "ERP BLUEPRINT",
    action:
      "Dual-track ERP strategy drafted for industrial B2B: optimise production first, keep greenfield as the option it must earn.",
    result: "17 SHEETS DELIVERED",
  },
  {
    date: "2025",
    unit: "PT PUMA MAKMUR AE",
    action:
      "Industrial sealing B2B — component data, datasheets, and the customer workflow around them. The vernacular of this site comes from here.", // [EDIT] exact start month/role
    result: "IN SERVICE",
  },
];

export const revisions = [
  {
    rev: "A",
    date: "2026-10-24",
    description: "FIRST ISSUE. DRAWING SET PUBLISHED.",
    by: "GHF",
  },
  {
    rev: "P1",
    date: "2026-10-23",
    description: "PREVIEW BUILD. CONTENT LOCKED FOR A/B TEST.",
    by: "GHF",
  },
];

export const envelopePlot = {
  // Normalised operating-envelope polygon points (0..1 space), drawn on SVG axes.
  polygon: "0.08,0.78 0.30,0.30 0.62,0.22 0.86,0.46 0.80,0.80 0.42,0.88",
  points: [
    { x: 0.3, y: 0.3, label: "AI AGENTS" },
    { x: 0.62, y: 0.22, label: "WEB" },
    { x: 0.86, y: 0.46, label: "B2B" },
    { x: 0.42, y: 0.88, label: "TOOLING" },
  ],
  xLabel: "PRESSURE / SCOPE OF WORK",
  yLabel: "TEMPERATURE / RIGOUR",
};
