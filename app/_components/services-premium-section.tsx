"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { resolveMediaUrl } from "@/lib/media-url";

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
};

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

export function ServicesPremiumSection({
  services,
}: {
  services: ServiceItem[];
}) {
  return (
    <section id="services" className="w-full bg-accent py-[var(--section-py)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
            Services
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
            Luxury Website Development
          </h2>
          <p className="mt-4 text-base leading-8 text-white/85 sm:text-lg">
            Kami merancang website yang terasa premium sejak interaksi pertama,
            dengan fokus pada kepercayaan, alur konversi, dan kualitas visual
            yang konsisten.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const imageUrl =
              resolveMediaUrl(service.thumbnailUrl) ?? service.thumbnailUrl;

            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.28, delay: index * 0.03 }}
                whileHover={{ y: -4 }}
                className="flex h-full flex-col rounded-[var(--radius-md)] border border-[#c4d6bf] bg-[#e6f0df] p-5 shadow-[0_12px_28px_rgba(24,45,24,0.18)]"
              >
                {imageUrl ? (
                  <div className="relative mb-5 aspect-video overflow-hidden rounded-[var(--radius-sm)] border border-[#bfd1ba] bg-[#dcead6]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                <h3 className="font-display text-2xl font-bold text-ink">
                  {service.title}
                </h3>
                <p className="mt-3 line-clamp-4 min-h-[6rem] text-[15px] leading-7 text-ink-muted">
                  {truncateText(service.description, 140)}
                </p>

                <Link
                  href={`/services/${service.id}`}
                  className="mt-6 inline-flex h-10 w-max items-center rounded-full border border-accent px-5 text-xs font-semibold uppercase tracking-[0.16em] text-accent transition-colors hover:bg-accent hover:text-white"
                >
                  Lihat Layanan
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
