"use client";

import { motion } from "framer-motion";

import { resolveMediaUrl } from "@/lib/media-url";

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
};

const premiumMarkets = [
  "UMKM yang ingin naik kelas",
  "Restoran & Cafe berkonsep premium",
  "Hotel & Hospitality",
  "Service & layanan profesional",
  "Perusahaan (PT & CV)",
  "Lembaga & Instansi Pemerintahan",
];

const premiumBenefits = [
  "Struktur yang mengarahkan pengunjung menjadi klien",
  "Copywriting yang membangun authority & trust",
  "Visual yang mencerminkan kelas bisnis Anda",
  "Performa cepat & responsif di semua device",
  "Fondasi SEO untuk visibilitas jangka panjang",
];

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
    <section
      id="services"
      className="relative w-full overflow-hidden bg-[#69734f] py-20 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute left-[-6rem] top-24 h-64 w-64 rounded-full bg-[#a9b38d]/12 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] bottom-12 h-72 w-72 rounded-full bg-white/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[2.4rem] border border-white/14 bg-[linear-gradient(135deg,rgba(92,102,69,0.86),rgba(105,115,79,0.98))] p-8 shadow-[0_28px_80px_rgba(17,31,20,0.22)] backdrop-blur-sm sm:p-10 lg:p-12"
        >
          <div className="max-w-4xl">
            <h2 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Luxury Website Development
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/84 text-justify sm:text-lg">
              Dirancang untuk dominasi pasar. Kami menghadirkan layanan
              pembuatan website eksklusif untuk bisnis yang ingin tampil lebih
              dipercaya, lebih eksklusif, dan lebih unggul dari kompetitor.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <span className="inline-flex rounded-full border border-white/18 bg-white/10 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/92">
                Strategi + Psikologi + Estetika Premium
              </span>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="rounded-[2rem] border border-[#87926d] bg-[#f1f4eb] p-7 text-[#69734f] shadow-[0_20px_45px_rgba(18,31,21,0.12)]"
          >
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7a8460]">
              Cocok Untuk
            </p>
            <ul className="space-y-3 text-sm leading-7 text-[#60684f]">
              {premiumMarkets.map((item) => (
                <li key={item} className="flex items-start gap-3 border-b border-[#d5dbc9] pb-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#87926d]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="rounded-[2rem] border border-white/16 bg-[linear-gradient(180deg,rgba(95,105,72,0.92),rgba(84,94,62,0.98))] p-7 text-white shadow-[0_24px_55px_rgba(18,31,21,0.16)]"
          >
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
              Nilai Yang Didapat
            </p>
            <ul className="space-y-3 text-sm leading-7 text-white/88">
              {premiumBenefits.map((item) => (
                <li key={item} className="flex items-start gap-3 border-b border-white/10 pb-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#a9b38d]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="mt-16 flex items-center justify-center border-b border-white/14 pb-8 text-center">
          <h3 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Layanan
          </h3>
        </div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.3 }}
          className="mt-8 rounded-[2.2rem] border border-white/10 bg-[#5f6948]/82 p-5 shadow-[0_24px_70px_rgba(17,31,20,0.12)] backdrop-blur-sm sm:p-6"
        >
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <motion.article
                key={service.id}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.25, delay: index * 0.01 }}
                className="group relative flex h-full flex-col rounded-[1.8rem] border border-[#7d8860] bg-[#5c6645] p-7 transition-all hover:-translate-y-1.5 hover:border-white/50 hover:bg-[#707b55]"
              >
                {service.thumbnailUrl ? (
                  <div className="mb-6 overflow-hidden rounded-[1.2rem] border border-[#87926d] bg-[#66714d]">
                    <img
                      src={resolveMediaUrl(service.thumbnailUrl) ?? service.thumbnailUrl}
                      alt={service.title}
                      className="h-48 w-full object-cover opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                    />
                  </div>
                ) : null}
                <h3 className="mb-4 font-display text-xl font-bold text-white">
                  {service.title}
                </h3>
                <p className="mb-8 line-clamp-4 min-h-[6rem] text-[15px] leading-relaxed text-white/78">
                  {truncateText(service.description, 135)}
                </p>
                <a
                  href={`/services/${service.id}`}
                  className="mt-auto inline-flex w-max items-center border border-white/60 px-6 py-2.5 text-[13px] font-bold uppercase tracking-widest text-white transition-colors hover:border-white hover:bg-white hover:text-[#69734f]"
                >
                  <span>Lihat Layanan</span>
                </a>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
