import { workPlates } from "@/data/portfolio";
import { ChatFragment } from "./chat-fragment";
import { PlateRowOverlay } from "./plate-row-overlay";

// KARYA — lima pelat full-bleed menempel tanpa celah. Baris
// judul (tahun · nama · fakta) hidup di lapisan overlay sticky
// yang tak pernah tertutup pelat mana pun (lihat
// PlateRowOverlay); pelat bergulir di bawahnya seperti
// membuka pelat buku.
export function WorkPlates() {
  return (
    <div id="karya" aria-label="Karya" className="scroll-mt-4">
      <h2 className="sr-only">Karya</h2>
      <PlateRowOverlay plates={workPlates} />
      {workPlates.map((plate) => (
        <article
          key={plate.id}
          data-plate={plate.id}
          className="h-[100svh] w-full overflow-hidden bg-bg"
        >
          <div className="relative h-full w-full">
            {plate.bg === "chat-fragment" ? (
              <ChatFragment variant="plate" />
            ) : (
              <img
                src={plate.bg}
                alt={plate.alt}
                width={plate.width}
                height={plate.height}
                loading="eager"
                decoding="async"
                className={`h-full w-full object-cover brightness-[0.88] ${
                  plate.grayscale ? "grayscale" : ""
                }`}
              />
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
