// ============================================================
// DATASET — single source of truth portfolio Muhammad Ghazy
// Fawaz Hakim. Semua fakta dari CV user (Okt 2026). Tidak ada
// bukti karangan. Edit file ini saja untuk mengubah konten.
// ============================================================

export const identity = {
  fullName: "MUHAMMAD GHAZY FAWAZ HAKIM",
  monument: "GHAZY FAWAZ HAKIM",
  role: "Software Engineer, Full-Stack & DevOps",
  city: "Bandung, Indonesia",
  email: "mghazyfh28@gmail.com",
  phone: "+62 857-5904-9341",
  github: { label: "GitHub", handle: "github.com/mghazyfhakim", url: "https://github.com/mghazyfhakim" },
  linkedin: { label: "LinkedIn", handle: "linkedin.com/in/mghazyfh28", url: "https://linkedin.com/in/mghazyfh28" },
  supporting: "Software engineer di Bandung. Sendirian membangun dan menjaga sistem produksi PT Puma Makmur, semuanya live hari ini.",
};

export type LiveDomain = {
  label: string;
  url: string;
  note: string;
};

// Domain miliknya sendiri — dicek nyata oleh /api/status (live thing).
export const liveDomains: LiveDomain[] = [
  { label: "pumamakmurseal.com", url: "https://pumamakmurseal.com", note: "Platform B2B & RFQ" },
  { label: "weavorystudio.com", url: "https://weavorystudio.com", note: "Situs studio + API Go" },
  { label: "pajak.pumamakmurseal.com", url: "https://pajak.pumamakmurseal.com", note: "Asisten Pajak Puma" },
];

export type HeroPanel = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  eager?: boolean;
};

export const heroPanels: HeroPanel[] = [
  {
    src: "/media/puma-portrait.jpg",
    alt: "Halaman beranda pumamakmurseal.com, platform B2B PT Puma Makmur Aneka Engineering",
    caption: "pumamakmurseal.com: Platform B2B & RFQ. Elixir, Phoenix LiveView, PostgreSQL. Live.",
    width: 1200,
    height: 1800,
    eager: true,
  },
  {
    src: "/media/weavory-portrait.jpg",
    alt: "Halaman beranda weavorystudio.com, situs studio jahit Weavory",
    caption: "weavorystudio.com: Situs studio + layanan API Go. Live.",
    width: 1200,
    height: 1800,
  },
  {
    src: "chat-fragment",
    alt: "Antarmuka Asisten Pajak Puma, chatbot AI konsultan pajak",
    caption: "pajak.pumamakmurseal.com: Asisten Pajak Puma, chatbot AI pajak. Live.",
    width: 0,
    height: 0,
  },
  {
    src: "/media/asian-sealing-product-industrial-gasket.jpg",
    alt: "Aneka gasket dan oil seal industri",
    caption: "Sealing element, bahan kerja harian yang dilayani sistemnya.",
    width: 1920,
    height: 1080,
  },
  {
    src: "/media/gedung-sate-bandung.jpg",
    alt: "Gedung Sate, Bandung",
    caption: "Bandung, tempat semuanya dirancang, diuji, dan dirilis.",
    width: 1920,
    height: 1135,
  },
];

export type Portrait = {
  src: string;
  alt: string;
  name: string;
  role: string;
  sentence: string;
  width: number;
  height: number;
  side: "left" | "right";
};

export const portraits: Portrait[] = [
  {
    src: "/media/asian-sealing-product-industrial-gasket.jpg",
    alt: "Aneka gasket dan oil seal",
    name: "Software Engineer",
    role: "Full-Stack & DevOps di PT Puma Makmur Aneka Engineering",
    sentence:
      "Satu-satunya developer: platform B2B, ERP internal, CI/CD, dan rilis produksi v2.4.0 sampai v2.5.0.",
    width: 1920,
    height: 1080,
    side: "left",
  },
  {
    src: "/media/gedung-sate-bandung.jpg",
    alt: "Gedung Sate, Bandung",
    name: "Lulusan Rekayasa Perangkat Lunak",
    role: "Telkom University, 2025, IPK 3,30",
    sentence: "Markasnya Bandung: tempat sistem dirancang, diuji, dan dikirim.",
    width: 1920,
    height: 1135,
    side: "right",
  },
  {
    src: "/media/zenith-z-19-terminal.jpg",
    alt: "Terminal komputer Zenith Z-19 dengan layar hijau",
    name: "AI Engineer",
    role: "Asisten Pajak Puma, Gemini 3.8 Flash + Open WebUI",
    sentence:
      "Konsultan pajak berbahasa Indonesia, live untuk panduan regulasi, kalkulasi, dan kepatuhan.",
    width: 1023,
    height: 682,
    side: "left",
  },
  {
    src: "/media/yosowilangun-sta-130807-2521-lmj.jpg",
    alt: "Menara air stasiun kereta api Yosowilangun",
    name: "Back-end Developer",
    role: "Jabar Digital Service, Weavory.Studio, SIREKAS",
    sentence:
      "API produksi, tuning query, database relasional, dan deployment, dari platform pemerintah sampai startup.",
    width: 1200,
    height: 1600,
    side: "right",
  },
];

export type WorkPlate = {
  id: string;
  year: string;
  title: string;
  fact: string;
  bg: string; // path gambar atau "chat-fragment"
  alt: string;
  width: number;
  height: number;
  grayscale?: boolean;
};

export const workPlates: WorkPlate[] = [
  {
    id: "puma-b2b",
    year: "2025–sekarang",
    title: "PLATFORM B2B PUMA MAKMUR",
    fact: "pumamakmurseal.com, LIVE, 1.331+ test lulus",
    bg: "/media/puma-wide.jpg",
    alt: "Halaman beranda pumamakmurseal.com",
    width: 1920,
    height: 1080,
  },
  {
    id: "asisten-pajak",
    year: "2026",
    title: "ASISTEN PAJAK PUMA",
    fact: "pajak.pumamakmurseal.com, LIVE, Gemini + Open WebUI",
    bg: "chat-fragment",
    alt: "Antarmuka Asisten Pajak Puma",
    width: 0,
    height: 0,
  },
  {
    id: "weavory",
    year: "2026",
    title: "WEAVORY.STUDIO",
    fact: "weavorystudio.com, LIVE, Go + REST API",
    bg: "/media/weavory-wide.jpg",
    alt: "Halaman beranda weavorystudio.com",
    width: 1920,
    height: 1080,
  },
  {
    id: "sirekas",
    year: "2025",
    title: "SIREKAS",
    fact: "Laravel, PostgreSQL, Sertifikat HKI",
    bg: "/media/interior-of-the-machine-shop-at-the.jpg",
    alt: "Interior bengkel mesin, foto arsip 1924",
    width: 1920,
    height: 1387,
    grayscale: true,
  },
  {
    id: "si-rampak-sekar",
    year: "2024",
    title: "SI RAMPAK SEKAR",
    fact: "Jabar Digital Service, 10+ endpoint produksi",
    bg: "/media/yosowilangun-sta-130807-2521-lmj.jpg",
    alt: "Menara air stasiun kereta api Yosowilangun",
    width: 1200,
    height: 1600,
  },
];

export const stackBand = [
  "ELIXIR",
  "PHOENIX LIVEVIEW",
  "POSTGRESQL",
  "OBAN",
  "GO",
  "PYTHON",
  "LARAVEL",
  "NEXT.JS",
  "TYPESCRIPT",
  "DOCKER",
  "COOLIFY",
  "GITHUB ACTIONS",
];

export const stackSentence = "Teknologi yang dia pakai di produksi, bukan sekadar di tutorial.";

export const stats = {
  heading: "ANGKA PRODUKSI",
  figure: "1.331+",
  figureSentence: "automated test lulus, tanpa satu pun bug produksi pada audit akhir.",
  photo: "/media/interior-of-the-machine-shop-at-the.jpg",
  photoAlt: "Interior bengkel mesin dengan deretan mesin bubut, foto arsip 1924",
  width: 1920,
  height: 1387,
  supporting: [
    { value: "35+", caption: "pull request dengan verifikasi CI pra-merge" },
    { value: "0", caption: "bug produksi pada audit akhir" },
    { value: "2", caption: "rilis produksi (v2.4.0 → v2.5.0)" },
    { value: "1", caption: "sertifikat HKI untuk proyek SIREKAS" },
  ],
};

export const chatCapabilities = ["Regulasi pajak Indonesia", "Kalkulasi pajak", "Compliance Q&A"];

export const contactSentence = "Punya sistem yang harus dibangun, diselamatkan, atau dijaga? Tulis email.";

export const footerMenu = [
  { label: "Tentang", href: "#tentang" },
  { label: "Karya", href: "#karya" },
  { label: "Teknologi", href: "#teknologi" },
  { label: "Angka", href: "#angka" },
  { label: "Kontak", href: "#kontak" },
];

// Kredit foto arsip (wajib — lisensi CC meminta atribusi).
export const photoCredits = [
  {
    title: "Gedung Sate Bandung",
    author: "Gunawan Kartapranata",
    licence: "CC BY-SA 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "https://commons.wikimedia.org/w/index.php?curid=10352109",
  },
  {
    title: "Asian Sealing Product - Industrial Gasket",
    author: "Asian sealing product",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "https://commons.wikimedia.org/w/index.php?curid=133647909",
  },
  {
    title: "Zenith Z-19 Terminal",
    author: "ajmexico",
    licence: "CC BY 2.0",
    licenceUrl: "https://creativecommons.org/licenses/by/2.0/",
    source: "https://www.flickr.com/photos/15587432@N02/3281139507",
  },
  {
    title: "Interior of the machine shop at the Petone Railway Workshops, 1924",
    author: "Godber, Albert Percy, 1875–1949",
    licence: "Public domain",
    licenceUrl: null,
    source: "https://commons.wikimedia.org/wiki/File:Interior_of_the_machine_shop_at_the_Petone_Railway_Workshops,_1924_ATLIB_299540.png",
  },
  {
    title: "Yosowilangun sta 130807-2521 lmj",
    author: "Wibowo Djatmiko (Wie146)",
    licence: "CC BY-SA 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "https://commons.wikimedia.org/w/index.php?curid=27811975",
  },
];
