"use client";

import { useEffect, useState } from "react";

export function PortfolioImageLightbox({
  src,
  alt,
  title,
}: {
  src: string;
  alt: string;
  title: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[1.6rem] bg-[#dfe5d4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#69734f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e5e9dc] xl:h-full xl:aspect-auto"
      >
        <div className="relative h-full w-full">
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
          <p className="pointer-events-none absolute bottom-4 left-4 right-4 text-xl font-semibold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
            {title}
          </p>
        </div>
      </button>

      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-black/40 text-white transition-colors hover:bg-black/65"
            aria-label="Tutup preview gambar"
          >
            <i className="bi bi-x-lg"></i>
          </button>

          <img
            src={src}
            alt={alt}
            className="max-h-[88vh] max-w-[95vw] rounded-xl object-contain shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
