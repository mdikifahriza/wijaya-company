import { connection } from "next/server";
import { notFound } from "next/navigation";
import Link from "next/link";

import { FolioHeader, ScrollToTop } from "@/app/_components/folio-js";
import { PortfolioImageLightbox } from "@/app/_components/portfolio-image-lightbox";
import { resolveMediaUrl } from "@/lib/media-url";
import { prisma } from "@/lib/prisma";

function isExternalUrl(url: string) {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:")
  );
}

function getWhatsAppUrl(phone?: string | null) {
  if (!phone) return "/#contact";

  const normalized = phone.replace(/[^\d+]/g, "");
  const internationalNumber = normalized.startsWith("+")
    ? normalized.slice(1)
    : normalized.startsWith("0")
      ? `62${normalized.slice(1)}`
      : normalized;

  return internationalNumber ? `https://wa.me/${internationalNumber}` : "/#contact";
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function resolveCategoryLabel({
  joinedCategoryName,
  rawCategoryValue,
}: {
  joinedCategoryName: string | null;
  rawCategoryValue: string | null;
}) {
  if (joinedCategoryName?.trim()) return joinedCategoryName.trim();
  if (rawCategoryValue?.trim() && !isUuid(rawCategoryValue.trim())) return rawCategoryValue.trim();
  return "Project";
}

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join("");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const resolvedParams = await params;

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!portfolio) return { title: "Project Not Found" };

  return {
    title: portfolio.title,
    description: portfolio.summary,
  };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const resolvedParams = await params;

  const [siteSettings, portfolio] = await Promise.all([
    prisma.siteSettings.findFirst({ orderBy: { updatedAt: "desc" } }),
    prisma.portfolio.findUnique({ where: { slug: resolvedParams.slug } }),
  ]);

  if (!portfolio) notFound();

  const categoryResult = await prisma.$queryRaw<Array<{ categoryName: string | null }>>`
    SELECT c.name AS "categoryName"
    FROM portfolio p
    LEFT JOIN project_categories c ON c.id = p.project_category
    WHERE p.slug = ${resolvedParams.slug}
    LIMIT 1
  `.catch(() => []);

  const rawCategoryValue =
    typeof (portfolio as Record<string, unknown>).projectCategory === "string"
      ? ((portfolio as Record<string, unknown>).projectCategory as string)
      : null;

  const siteName = siteSettings?.siteName ?? "Wijaya Company";
  const logoUrl = resolveMediaUrl(siteSettings?.logoUrl);
  const portfolioImageUrl = resolveMediaUrl(portfolio.thumbnailUrl);
  const whatsappUrl = getWhatsAppUrl(siteSettings?.contactPhone);
  const projectHref = portfolio.projectUrl || whatsappUrl;
  const externalProject = isExternalUrl(projectHref);
  const categoryLabel = resolveCategoryLabel({
    joinedCategoryName: categoryResult[0]?.categoryName ?? null,
    rawCategoryValue,
  });
  const publishedAt = portfolio.publishedAt
    ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(portfolio.publishedAt)
    : null;
  const whatsappExternal = whatsappUrl.startsWith("https://wa.me/");
  const hasContent = Boolean(portfolio.contentHtml?.trim());

  return (
    <main className="relative min-h-screen bg-[#e5e9dc] text-[#69734f]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(105,115,79,0.16),transparent_72%)]" />

      <FolioHeader
        siteName={siteName}
        logoUrl={logoUrl}
        navLinks={[
          { href: "/", label: "Home" },
          { href: "/#projects", label: "Proyek Kami" },
          { href: "/#contact", label: "Kontak" },
        ]}
      />

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-10 lg:pt-32">
        <div className="mb-5">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a8460] transition-colors hover:text-[#69734f]"
          >
            <i className="bi bi-arrow-left"></i>
            Kembali ke proyek
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr] xl:items-stretch xl:gap-10">
          <article className="order-2 rounded-[2rem] border border-[#d4dac7] bg-white/75 p-6 shadow-[0_22px_50px_rgba(23,52,40,0.08)] backdrop-blur-sm sm:p-8 xl:order-1 xl:h-full xl:p-9">
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#7b8563]">
              {categoryLabel}
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-[#69734f] sm:text-5xl">
              {portfolio.title}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-8 text-[#758061] sm:text-base">
              {portfolio.summary}
            </p>

            <dl className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Client", value: portfolio.clientName ?? "-" },
                { label: "Kategori", value: categoryLabel },
                { label: "Publikasi", value: publishedAt ?? "-" },
              ].map((item) => (
                <div key={item.label} className="flex min-h-[104px] flex-col rounded-2xl border border-[#e0e5d4] bg-[#f4f7ee] px-4 py-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e9877]">
                    {item.label}
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-[#69734f]">{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={projectHref}
                target={externalProject ? "_blank" : undefined}
                rel={externalProject ? "noreferrer noopener" : undefined}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#69734f] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#50593b]"
              >
                Lihat Proyek
                <i className="bi bi-arrow-up-right"></i>
              </a>
              <a
                href={whatsappUrl}
                target={whatsappExternal ? "_blank" : undefined}
                rel={whatsappExternal ? "noreferrer noopener" : undefined}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[#69734f] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#69734f] transition-colors hover:bg-[#69734f] hover:text-white"
              >
                Hubungi Kami
              </a>
              <Link
                href="/"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[#d8ddcf] bg-white/70 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a8460] transition-colors hover:border-[#69734f] hover:text-[#69734f]"
              >
                Beranda
              </Link>
            </div>
          </article>

          <aside className="order-1 overflow-hidden rounded-[2rem] border border-[#d4dac7] bg-white/75 p-3 shadow-[0_24px_60px_rgba(23,52,40,0.1)] xl:order-2 xl:h-full xl:min-h-[560px]">
            {portfolioImageUrl ? (
              <PortfolioImageLightbox
                src={portfolioImageUrl}
                alt={portfolio.title}
                title={portfolio.title}
              />
            ) : (
              <div className="relative flex aspect-[4/3] items-center justify-center rounded-[1.6rem] bg-[#dde2d4] xl:h-full xl:aspect-auto">
                <span className="text-5xl font-bold uppercase tracking-[0.14em] text-[#69734f]">
                  {getInitials(portfolio.title)}
                </span>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-10">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
          <article className="rounded-[2rem] border border-[#d4dac7] bg-white/75 p-6 shadow-[0_20px_50px_rgba(23,52,40,0.07)] backdrop-blur-sm sm:p-8 lg:p-9">
            <h2 className="font-display text-3xl font-bold text-[#69734f]">
              Detail Proyek
            </h2>
            <div className="mt-5 break-words text-[15px] leading-8 text-[#758061] [&_iframe]:max-w-full [&_img]:h-auto [&_img]:max-w-full [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_li]:ml-1">
              {hasContent ? (
                <div dangerouslySetInnerHTML={{ __html: portfolio.contentHtml ?? "" }} />
              ) : (
                <p>{portfolio.summary}</p>
              )}
            </div>
          </article>

          <aside className="space-y-4">
            <article className="rounded-[2rem] border border-[#6e7951] bg-[#69734f] p-6 text-white shadow-[0_20px_50px_rgba(23,52,40,0.1)] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65">
                Konsultasi
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold">
                Butuh halaman serupa untuk bisnis Anda?
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/85">
                Tim kami siap bantu dari struktur konten, desain, sampai eksekusi launch.
              </p>
              <a
                href={whatsappUrl}
                target={whatsappExternal ? "_blank" : undefined}
                rel={whatsappExternal ? "noreferrer noopener" : undefined}
                className="mt-6 inline-flex rounded-full bg-[#f1f4eb] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#69734f] transition-colors hover:bg-white"
              >
                Hubungi via WhatsApp
              </a>
            </article>
          </aside>
        </div>
      </section>

      <ScrollToTop />
    </main>
  );
}
