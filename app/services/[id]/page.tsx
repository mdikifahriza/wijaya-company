import { connection } from "next/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { resolveMediaUrl } from "@/lib/media-url";
import { prisma } from "@/lib/prisma";
import { FolioHeader, ScrollToTop } from "@/app/_components/folio-js";

function getWhatsAppUrl(phone?: string | null) {
  if (!phone) {
    return "/#contact";
  }

  const normalized = phone.replace(/[^\d+]/g, "");
  const internationalNumber = normalized.startsWith("+")
    ? normalized.slice(1)
    : normalized.startsWith("0")
      ? `62${normalized.slice(1)}`
      : normalized;

  return internationalNumber ? `https://wa.me/${internationalNumber}` : "/#contact";
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const resolvedParams = await params;
  const service = await prisma.service.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: service.title,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const resolvedParams = await params;

  const siteSettings = await prisma.siteSettings.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  const service = await prisma.service.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!service) {
    notFound();
  }

  const siteName = siteSettings?.siteName ?? "Wijaya Company";
  const logoUrl = resolveMediaUrl(siteSettings?.logoUrl);
  const serviceImageUrl = resolveMediaUrl(service.thumbnailUrl);
  const whatsappUrl = getWhatsAppUrl(siteSettings?.contactPhone);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#e5e9dc] text-[#69734f]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(105,115,79,0.18),transparent_68%)]" />
      <FolioHeader
        siteName={siteName}
        logoUrl={logoUrl}
        navLinks={[
          { href: "/", label: "Home" },
          { href: "/#services", label: "Layanan" },
          { href: "/#contact", label: "Kontak" },
        ]}
      />

      <section className="relative mx-auto w-full px-4 pb-16 pt-32 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.28em] text-[#7a8460]">
            Layanan
          </p>
          <h1 className="mb-6 font-display text-4xl font-bold text-[#69734f] sm:text-5xl md:text-6xl">
            {service.title}
          </h1>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-28 sm:px-6 lg:px-10">
        <div className="space-y-8">
          {serviceImageUrl && (
            <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/60 shadow-[0_24px_60px_rgba(23,52,40,0.08)] backdrop-blur-sm">
              <img
                src={serviceImageUrl}
                alt={service.title}
                className="max-h-[560px] w-full object-cover"
              />
            </div>
          )}

          <div className="grid gap-6">
            <article className="rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-[0_24px_60px_rgba(23,52,40,0.08)] backdrop-blur-sm sm:p-10">
              <h2 className="mb-5 font-display text-2xl font-bold text-[#69734f]">
                Deskripsi
              </h2>
              <p className="text-[15px] leading-8 text-[#7a8460] sm:text-base">
                {service.description}
              </p>
            </article>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/"
              className="inline-flex rounded-full border border-[#69734f] px-6 py-3 text-center text-sm font-bold uppercase tracking-widest text-[#69734f] transition-colors hover:bg-[#69734f] hover:text-white"
            >
              Beranda
            </Link>
            <a
              href={whatsappUrl}
              target={whatsappUrl.startsWith("https://wa.me/") ? "_blank" : undefined}
              rel={whatsappUrl.startsWith("https://wa.me/") ? "noreferrer" : undefined}
              className="inline-flex rounded-full bg-[#69734f] px-6 py-3 text-center text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#50593b]"
            >
              Hubungi
            </a>
          </div>
        </div>
      </section>

      <ScrollToTop />
    </main>
  );
}
