import Link from "next/link";

import { resolveMediaUrl } from "@/lib/media-url";

type PortfolioItem = {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string | null;
};

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function PortfolioSection({
  portfolios,
  showAll = false,
}: {
  portfolios: PortfolioItem[];
  showAll?: boolean;
}) {
  const visiblePortfolios = showAll ? portfolios : portfolios.slice(0, 3);

  return (
    <section
      id="portfolio"
      className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
    >
      <div className="mb-12 text-center">
        <h2 className="relative inline-block pb-4 font-display text-3xl font-bold text-[#69734f] sm:text-4xl after:absolute after:bottom-0 after:left-[calc(50%-1.5rem)] after:h-1 after:w-12 after:bg-[#69734f]">
          Proyek Kami
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visiblePortfolios.map((item) => {
          const href = `/portfolio/${item.slug}`;
          const imageUrl = resolveMediaUrl(item.thumbnailUrl);

          return (
            <Link
              key={item.id}
              href={href}
              className="group relative block overflow-hidden rounded-lg border border-[#d8ddcf] bg-[#eceee8] transition-all duration-300 hover:-translate-y-1 hover:border-[#c4ccb2] hover:shadow-[0_18px_40px_rgba(23,52,40,0.08)]"
            >
              <div className="relative flex aspect-[4/3] items-center justify-center bg-[#dde2d4]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-base font-semibold uppercase tracking-[0.14em] text-[#69734f]">
                    {getInitials(item.title)}
                  </span>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/72 via-black/24 to-transparent" />
                <p className="pointer-events-none absolute bottom-4 left-4 right-4 text-xl font-semibold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
                  {item.title}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {!showAll ? (
        <div className="mt-10 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#69734f] transition-transform hover:-translate-y-1"
          >
            Lihat proyek lainnya
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      ) : null}
    </section>
  );
}
