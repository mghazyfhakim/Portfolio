import { chatCapabilities } from "@/data/portfolio";

// Fragmen antarmuka Asisten Pajak Puma — digambar dengan kode
// (imagery order: "drawn in code from the subject itself"),
// karena domain chatbot menampilkan layar login untuk tamu.
// Isi hanya fakta nyata dari CV: nama produk, model, tiga
// kemampuan. Tidak ada percakapan fiktif.
// Dua varian:
// - "panel": kotak 2:3 di hero — konten di tengah.
// - "plate": latar pelat karya full-bleed — heading di kuadran
//   atas, chip + input di bawah, agar baris judul pelat di 50%
//   tidak pernah bertabrakan dengan isi fragmen.
export function ChatFragment({ variant = "panel" }: { variant?: "panel" | "plate" }) {
  const isPlate = variant === "plate";

  return (
    <div
      data-ui
      className="bg-[#0f2417] text-ink w-full h-full flex flex-col select-none"
      aria-label="Antarmuka Asisten Pajak Puma"
      role="img"
    >
      <div className="flex items-center justify-between px-5 py-4 bg-surface">
        {isPlate ? (
          <span className="text-xs text-muted leading-none">Open WebUI</span>
        ) : (
          <span className="font-semibold text-sm leading-none">Asisten Pajak Puma</span>
        )}
        <span className="text-xs text-muted leading-none">Gemini 3.8 Flash</span>
      </div>

      {isPlate ? (
        <>
          <div className="flex-1 flex flex-col justify-center gap-6 px-(--margin-page)">
            <ul className="flex flex-wrap gap-2.5" aria-label="Kemampuan chatbot">
              {chatCapabilities.map((c) => (
                <li key={c} className="bg-surface px-3.5 py-2 text-xs sm:text-sm text-muted">
                  {c}
                </li>
              ))}
            </ul>
            <div className="bg-surface px-4 py-3 text-sm text-muted max-w-md">
              Tulis pertanyaan pajak…
            </div>
          </div>
          <div className="pb-[6vh]" />
        </>
      ) : (
        <>
          <div className="flex-1 flex flex-col justify-center gap-5 px-6 sm:px-10">
            <p className="text-[1.05rem] font-semibold leading-snug">
              Ada soal pajak hari ini?
            </p>
            <ul className="flex flex-wrap gap-2.5" aria-label="Kemampuan chatbot">
              {chatCapabilities.map((c) => (
                <li key={c} className="bg-surface px-3.5 py-2 text-xs sm:text-sm text-muted">
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="px-6 sm:px-10 pb-8">
            <div className="bg-surface px-4 py-3 text-sm text-muted">Tulis pertanyaan pajak…</div>
          </div>
        </>
      )}
    </div>
  );
}
