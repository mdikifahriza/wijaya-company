import { connection } from "next/server";

import {
  FolioHeader,
  FolioHeroText,
  IsotopePortfolio,
  ScrollToTop,
} from "@/app/_components/folio-js";
import { PackageSection } from "@/app/_components/package-section";
import { PaymentPartnersSection } from "@/app/_components/payment-partners-section";
import { ProjectsShowcaseSection } from "@/app/_components/projects-showcase-section";
import { ServicesPremiumSection } from "@/app/_components/services-premium-section";
import { resolveMediaUrl } from "@/lib/media-url";
import { prisma } from "@/lib/prisma";
import { SocialIcon } from "@/lib/social-icons";
import { getLandingPageData } from "@/lib/site-content";

const defaultSiteName = "Wijaya Company";

function isExternalUrl(url: string) {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:")
  );
}

function normalizeWhatsAppLink(phone?: string | null) {
  if (!phone) return null;

  const normalized = phone.replace(/\D/g, "");
  if (!normalized) return null;

  if (normalized.startsWith("62")) return `https://wa.me/${normalized}`;
  if (normalized.startsWith("0"))
    return `https://wa.me/62${normalized.slice(1)}`;
  return `https://wa.me/${normalized}`;
}

function SmartLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className: string;
}) {
  const external = isExternalUrl(href);

  return (
    <a
      href={href}
      className={className}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
    >
      {children}
    </a>
  );
}

const pressureRisks = [
  "Anda dianggap biasa",
  "Harga Anda dipertanyakan",
  "Kepercayaan menurun",
];

const pressureWins = [
  "Anda terlihat premium",
  "Anda lebih mudah dipercaya",
  "Anda bisa menetapkan harga lebih tinggi",
];

const exclusivityPoints = [
  "Siap naik kelas",
  "Mengerti pentingnya branding",
  "Tidak ingin bersaing di harga murah",
];

export default async function Home() {
  await connection();

  const [
    {
      biographies,
      cta,
      hero,
      packagePlans,
      paymentPartners,
      portfolios,
      siteSettings,
      socialLinks,
      socialProof,
      services,
    },
    featuredProjectsFromSql,
  ] = await Promise.all([
    getLandingPageData(),
    prisma.$queryRaw<
      Array<{
        id: string;
        slug: string;
        title: string;
        thumbnailUrl: string | null;
        projectCategoryName: string | null;
        isFeatured: boolean;
      }>
    >`
      SELECT
        p.id::text AS id,
        p.slug,
        p.title,
        p.thumbnail_url AS "thumbnailUrl",
        p.is_featured AS "isFeatured",
        c.name AS "projectCategoryName"
      FROM portfolio p
      LEFT JOIN project_categories c
        ON c.id = p.project_category
      WHERE p.is_featured = true
      ORDER BY
        c.name ASC NULLS LAST,
        p.sort_order ASC,
        p.published_at DESC NULLS LAST,
        p.created_at DESC
    `.catch(() => []),
  ]);

  const featuredProjectsFallback = portfolios
    .filter((portfolio) =>
      Boolean((portfolio as { isFeatured?: unknown }).isFeatured),
    )
    .map((portfolio) => ({
      id: portfolio.id,
      slug: portfolio.slug,
      title: portfolio.title,
      thumbnailUrl: portfolio.thumbnailUrl,
      isFeatured: Boolean((portfolio as { isFeatured?: unknown }).isFeatured),
      projectCategoryName:
        typeof (portfolio as { projectCategory?: unknown }).projectCategory ===
        "string"
          ? (portfolio as { projectCategory: string }).projectCategory
          : null,
    }));

  const featuredProjects =
    featuredProjectsFromSql.length > 0
      ? featuredProjectsFromSql
      : featuredProjectsFallback;

  const siteName = siteSettings?.siteName ?? defaultSiteName;
  const tagline =
    siteSettings?.tagline ?? "Solusi website profesional untuk bisnis Anda";
  const heroHeadline =
    hero?.headline ??
    "Website profesional untuk bisnis yang ingin tampil lebih dipercaya";
  const heroSubheadline =
    hero?.subheadline ??
    "Tampilan modern, alur yang jelas, dan pengalaman yang terasa matang sejak layar pertama.";

  const heroPrimaryHref =
    hero?.ctaPrimaryUrl ??
    normalizeWhatsAppLink(siteSettings?.contactPhone) ??
    "#contact";
  const heroSecondaryHref = hero?.ctaSecondaryUrl ?? "#services";
  const heroPrimaryLabel = hero?.ctaPrimaryText ?? "Konsultasi Gratis";
  const heroSecondaryLabel = hero?.ctaSecondaryText ?? "Lihat Layanan";

  const ctaHeadline =
    cta?.headline ?? "Siapkan website yang terasa rapi, cepat, dan meyakinkan";
  const ctaButtonText = cta?.buttonText ?? "Mulai Diskusi";
  const ctaButtonUrl =
    cta?.buttonUrl ??
    normalizeWhatsAppLink(siteSettings?.contactPhone) ??
    "mailto:" + (siteSettings?.contactEmail ?? "wijayacompany@gmail.com");
  const contactEmail = siteSettings?.contactEmail || "info@example.com";
  const contactPhone = siteSettings?.contactPhone || "+1 5589 55488 55";
  const contactEmailHref = `mailto:${contactEmail}`;
  const contactWhatsAppHref =
    normalizeWhatsAppLink(siteSettings?.contactPhone) ?? "#contact";

  const averageRating =
    socialProof.length > 0
      ? (
          socialProof.reduce((total, item) => total + item.rating, 0) /
          socialProof.length
        ).toFixed(1)
      : "5.0";

  const heroImageUrl = resolveMediaUrl(hero?.imageUrl);
  const logoUrl = resolveMediaUrl(siteSettings?.logoUrl);
  const heroButtons = [
    heroPrimaryLabel && heroPrimaryHref
      ? {
          href: heroPrimaryHref,
          label: heroPrimaryLabel,
          variant: "primary" as const,
        }
      : null,
    heroSecondaryLabel && heroSecondaryHref
      ? {
          href: heroSecondaryHref,
          label: heroSecondaryLabel,
          variant: "secondary" as const,
        }
      : null,
  ].filter(
    (
      button,
    ): button is {
      href: string;
      label: string;
      variant: "primary" | "secondary";
    } => Boolean(button),
  );

  const lastUpdated = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(siteSettings?.updatedAt ?? new Date());

  return (
    <main className="relative bg-surface text-ink">
      <FolioHeader
        siteName={siteName}
        logoUrl={logoUrl}
        topTextVariant="light"
        navLinks={[
          { href: "#hero", label: "Home" },
          { href: "#projects", label: "Proyek Kami" },
          { href: "#about", label: "About" },
          { href: "#services", label: "Services" },
          { href: "#packages", label: "Paket" },
          { href: "#contact", label: "Contact" },
        ]}
      />

      <section
        id="hero"
        className="relative isolate min-h-[100svh] overflow-hidden pt-20"
      >
        <div className="absolute inset-0 z-0">
          {heroImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImageUrl}
              alt="Hero Background"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          ) : (
            <div className="h-full w-full bg-[linear-gradient(180deg,#dfe5d5_0%,#f7f8f4_100%)]" />
          )}
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_42%)]" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl items-center px-4 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-3xl text-center">
            <FolioHeroText
              siteName={siteName}
              subheadline={heroHeadline}
              animatedTexts={hero?.animatedTexts || []}
            />

            <p className="mx-auto max-w-2xl text-sm leading-7 text-white/82 sm:text-base sm:leading-8">
              {heroSubheadline}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
              {heroButtons.map((button) => (
                <SmartLink
                  key={button.href + button.label}
                  href={button.href}
                  className={
                    button.variant === "primary"
                      ? "inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition-transform hover:-translate-y-0.5 hover:bg-[#f3f5ee]"
                      : "inline-flex h-11 items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-transform hover:-translate-y-0.5 hover:bg-white/20"
                  }
                >
                  {button.label}
                </SmartLink>
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-5">
              {socialLinks.map((link) => (
                <SmartLink
                  key={link.id}
                  href={link.url}
                  className="text-white/75 transition-colors hover:text-white"
                >
                  <span className="sr-only">{link.platform}</span>
                  <SocialIcon
                    iconName={link.iconName}
                    platform={link.platform}
                    className="h-6 w-6"
                  />
                </SmartLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProjectsShowcaseSection portfolios={featuredProjects} />

      <section
        id="about"
        className="mx-auto w-full max-w-7xl px-4 py-[var(--section-py)] sm:px-6 lg:px-10"
      >
        <div className="mb-12 max-w-3xl">
          <h2 className="mt-3 font-display text-4xl font-bold text-ink sm:text-5xl">
            About
          </h2>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div className="relative mx-auto w-full max-w-[280px] lg:max-w-sm">
            {biographies[0]?.profileImageUrl ? (
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-white shadow-[0_16px_36px_rgba(45,51,25,0.08)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveMediaUrl(biographies[0].profileImageUrl)!}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="relative z-10 flex aspect-[4/5] w-full items-center justify-center rounded-[var(--radius-lg)] border border-border bg-surface text-ink-muted shadow-[0_16px_36px_rgba(45,51,25,0.06)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              {biographies[0]?.sectionTitle ||
                "We design premium websites for ambitious businesses."}
            </h3>
            <div
              className="prose prose-sm mt-5 max-w-none text-[15px] leading-8 text-ink-muted sm:prose-base [&_p]:mb-4 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{
                __html:
                  biographies[0]?.contentHtml ||
                  "<p>Welcome to our profile. We help businesses build modern websites.</p>",
              }}
            />

            <dl className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
              {[
                {
                  label: "Pengalaman",
                  value: biographies[0]?.yearsExperience || "5+",
                },
                {
                  label: "Proyek",
                  value: biographies[0]?.projectsCompleted || "850+",
                },
                {
                  label: "Klien",
                  value: biographies[0]?.clientsServed || "30+",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-0 rounded-[var(--radius-md)] border border-border bg-white px-3 py-4 shadow-[0_12px_24px_rgba(45,51,25,0.05)] sm:px-4 sm:py-5"
                >
                  <dt className="text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-muted sm:text-[11px] sm:tracking-[0.16em]">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 font-display text-[28px] font-bold leading-none text-ink sm:text-3xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <ServicesPremiumSection services={services} />

      <PackageSection
        packagePlans={packagePlans}
        defaultCtaHref={
          normalizeWhatsAppLink(siteSettings?.contactPhone) ?? "#contact"
        }
      />

      <section
        id="proof"
        className="mx-auto w-full max-w-7xl px-4 py-[var(--section-py)] sm:px-6 lg:px-10"
      >
        <div className="mb-10 grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
              Social Proof
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold text-ink sm:text-5xl">
              Dipercaya Brand yang Ingin Tampil Lebih Meyakinkan
            </h2>
            <p className="mt-4 text-base leading-8 text-ink-muted sm:text-lg">
              Klien kami datang dari berbagai sektor, dengan kebutuhan yang
              sama: tampilan digital yang rapi, kredibel, dan siap mengangkat
              value bisnis.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { label: "Brand", value: "700+" },
              { label: "Rating", value: `${averageRating}/5` },
              { label: "Fokus", value: "Premium" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[var(--radius-md)] border border-border bg-white px-4 py-5 text-center shadow-[0_10px_24px_rgba(45,51,25,0.06)]"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                  {item.label}
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <IsotopePortfolio
          items={socialProof.map((proof) => ({
            id: proof.id,
            title: proof.clientName,
            subtitle: proof.clientCompany || proof.projectCategory || "Client",
            description: proof.testimonialText,
            rating: proof.rating,
          }))}
        />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-[var(--section-py)] sm:px-6 lg:px-10">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
              Positioning
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold text-ink sm:text-5xl">
              Tampilan Digital Menentukan Nilai yang Diterima Pasar
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
              Dalam beberapa detik, calon pelanggan menilai kredibilitas bisnis
              Anda dari tampilannya. Kami fokus pada positioning yang membuat
              brand terlihat matang, profesional, dan layak dihargai lebih
              tinggi.
            </p>

            <div className="mt-6 rounded-[var(--radius-md)] border border-border bg-white p-6 shadow-[0_10px_24px_rgba(45,51,25,0.06)]">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Kami bekerja dengan bisnis yang:
              </p>
              <ul className="space-y-3 text-sm leading-7 text-ink-muted">
                {exclusivityPoints.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-4">
            <article className="rounded-[var(--radius-md)] border border-border bg-surface p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Tanpa positioning premium
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-ink-muted">
                {pressureRisks.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-ink-muted" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[var(--radius-md)] border border-accent bg-ink p-6 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/68">
                Dengan positioning premium
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-white/88">
                {pressureWins.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/70" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <PaymentPartnersSection partners={paymentPartners} />

      <section
        id="contact"
        className="mx-auto w-full max-w-7xl px-4 py-[var(--section-py)] sm:px-6 lg:px-10"
      >
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-accent bg-ink px-6 py-8 text-white shadow-[0_20px_48px_rgba(45,51,25,0.2)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-4xl font-bold sm:text-5xl">
              {ctaHeadline}
            </h2>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
            <a
              href={contactEmailHref}
              className="rounded-[var(--radius-md)] border border-white/12 bg-white/8 px-5 py-5 transition-colors hover:border-white/28 hover:bg-white/12"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                Email
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {contactEmail}
              </p>
            </a>

            <a
              href={contactWhatsAppHref}
              target={
                contactWhatsAppHref.startsWith("https://wa.me/")
                  ? "_blank"
                  : undefined
              }
              rel={
                contactWhatsAppHref.startsWith("https://wa.me/")
                  ? "noreferrer noopener"
                  : undefined
              }
              className="rounded-[var(--radius-md)] border border-white/12 bg-white/8 px-5 py-5 transition-colors hover:border-white/28 hover:bg-white/12"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                WhatsApp
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {contactPhone}
              </p>
            </a>
          </div>

          <div className="mt-8 text-center">
            <SmartLink
              href={ctaButtonUrl}
              className="inline-flex h-11 items-center justify-center rounded-full bg-white px-7 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition-transform hover:-translate-y-0.5 hover:bg-[#f3f5ee]"
            >
              {ctaButtonText}
            </SmartLink>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-ink py-12 text-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-10">
          <h2 className="font-display text-3xl font-bold">{siteName}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">
            {tagline}
          </p>

          <div className="mt-8 flex justify-center gap-4">
            {socialLinks.map((link) => (
              <SmartLink
                key={link.id}
                href={link.url}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/80 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                <SocialIcon
                  iconName={link.iconName}
                  platform={link.platform}
                  className="h-4 w-4"
                />
              </SmartLink>
            ))}
          </div>

          <p className="mt-8 text-[13px] text-white/55">
            &copy; {new Date().getFullYear()} {siteName}. Diperbarui{" "}
            {lastUpdated}.
          </p>
        </div>
      </footer>

      <ScrollToTop />
    </main>
  );
}
