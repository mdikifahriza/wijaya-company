import { connection } from "next/server";

import { FolioHeroText, FolioHeader, IsotopePortfolio, ScrollToTop } from "@/app/_components/folio-js";
import { PackageSection } from "@/app/_components/package-section";
import { ProjectsShowcaseSection } from "@/app/_components/projects-showcase-section";
import { ServicesPremiumSection } from "@/app/_components/services-premium-section";
import { resolveMediaUrl } from "@/lib/media-url";
import { prisma } from "@/lib/prisma";
import { SocialIcon } from "@/lib/social-icons";
import { getLandingPageData } from "@/lib/site-content";

const defaultSiteName = "Wijaya Company";
const defaultDescription =
  "Website profesional untuk bisnis, sekolah, desa, dan UMKM yang ingin tampil lebih meyakinkan.";

function isExternalUrl(url: string) {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:")
  );
}

function normalizeWhatsAppLink(phone?: string | null) {
  if (!phone) {
    return null;
  }

  const normalized = phone.replace(/\D/g, "");

  if (!normalized) {
    return null;
  }

  if (normalized.startsWith("62")) {
    return `https://wa.me/${normalized}`;
  }

  if (normalized.startsWith("0")) {
    return `https://wa.me/62${normalized.slice(1)}`;
  }

  return `https://wa.me/${normalized}`;
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
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

const strongCtaPoints = [
  "Meningkatkan value bisnis",
  "Memenangkan kepercayaan pasar",
  "Tampil sebagai leader di industri Anda",
];

export default async function Home() {
  await connection();

  const [{
    biographies,
    cta,
    footerColumns,
    hero,
    packagePlans,
    portfolios,
    siteSettings,
    socialLinks,
    socialProof,
    services,
  }, featuredProjectsFromSql] = await Promise.all([
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
    .filter((portfolio) => Boolean((portfolio as { isFeatured?: unknown }).isFeatured))
    .map((portfolio) => ({
      id: portfolio.id,
      slug: portfolio.slug,
      title: portfolio.title,
      thumbnailUrl: portfolio.thumbnailUrl,
      isFeatured: Boolean((portfolio as { isFeatured?: unknown }).isFeatured),
      projectCategoryName:
        typeof (portfolio as { projectCategory?: unknown }).projectCategory === "string"
          ? (portfolio as { projectCategory: string }).projectCategory
          : null,
    }));

  const featuredProjects = featuredProjectsFromSql.length > 0
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
  const ctaSubheadline =
    cta?.subheadline ??
    "Kami bantu dari struktur konten, desain, sampai sistem upload yang siap dipakai tim Anda.";
  const ctaButtonText = cta?.buttonText ?? "Mulai Diskusi";
  const ctaButtonUrl =
    cta?.buttonUrl ??
    normalizeWhatsAppLink(siteSettings?.contactPhone) ??
    "mailto:" + (siteSettings?.contactEmail ?? "wijayacompany@gmail.com");

  const averageRating =
    socialProof.length > 0
      ? (
          socialProof.reduce((total, item) => total + item.rating, 0) /
          socialProof.length
        ).toFixed(1)
      : "5.0";

  const featuredProof = socialProof[0];
  const supportingProofs = socialProof.slice(1, 4);
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
    ): button is { href: string; label: string; variant: "primary" | "secondary" } =>
      Boolean(button),
  );
  const lastUpdated = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(siteSettings?.updatedAt ?? new Date());

  return (
    <main className="relative text-[#69734f] bg-[#e5e9dc]">
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
           { href: "#contact", label: "Contact" }
        ]}
      />

        <section
          id="hero"
          className="relative isolate mx-auto flex min-h-screen w-full items-center justify-center overflow-hidden pt-20"
        >
          <div className="absolute inset-0 z-0">
             {heroImageUrl ? (
              <img
                src={heroImageUrl}
                alt="Hero Background"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            ) : (
                <div className="h-full w-full bg-[#e5e9dc]" />
            )}
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="grid min-h-[90vh] items-center lg:grid-cols-2">
              <div className="flex w-full justify-center lg:justify-start">
                <div className="flex min-h-[78svh] w-full max-w-2xl flex-col items-center justify-between py-3 text-center sm:min-h-[76vh] sm:py-8 lg:min-h-[80vh] lg:py-4">
                  <div className="w-full -translate-y-12 pt-0 sm:-translate-y-8 sm:pt-4 lg:-translate-y-12">
                    <FolioHeroText
                      siteName={siteName}
                      subheadline={hero?.subheadline || ""}
                      animatedTexts={hero?.animatedTexts || []}
                    />
                  </div>

                  <div className="mt-auto flex translate-y-4 flex-col items-center sm:translate-y-3 lg:translate-y-5 lg:pb-2">
                    <div className="mb-8 flex flex-wrap justify-center gap-4 sm:mb-9">
                      {heroButtons.map((button) => (
                        <SmartLink
                          key={button.href + button.label}
                          href={button.href}
                          className={
                            button.variant === "primary"
                              ? "rounded-full bg-[#69734f] px-8 py-3 text-sm font-bold tracking-widest text-white uppercase transition-transform hover:-translate-y-1 hover:bg-[#50593b]"
                              : "rounded-full border border-white/60 bg-white/10 px-8 py-3 text-sm font-bold tracking-widest text-white uppercase backdrop-blur-sm transition-transform hover:-translate-y-1 hover:bg-white/20"
                          }
                        >
                          {button.label}
                        </SmartLink>
                      ))}
                    </div>

                    <div className="flex justify-center gap-6">
                      {socialLinks.map((link) => (
                        <SmartLink
                          key={link.id}
                          href={link.url}
                          className="transform text-white/70 transition-colors hover:-translate-y-1 hover:text-white"
                        >
                          <span className="sr-only">{link.platform}</span>
                          <SocialIcon
                            iconName={link.iconName}
                            platform={link.platform}
                            className="h-7 w-7 drop-shadow-md"
                          />
                        </SmartLink>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block" aria-hidden="true" />
            </div>
          </div>
        </section>

      <ProjectsShowcaseSection portfolios={featuredProjects} />

        <section
          id="about"
          className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
        >
          <div className="mb-12 text-center">
            <h2 className="relative inline-block pb-4 font-display text-3xl font-bold text-[#69734f] sm:text-4xl after:absolute after:bottom-0 after:left-[calc(50%-1.5rem)] after:h-1 after:w-12 after:bg-[#69734f]">
              About
            </h2>
          </div>
  
          <div className="grid gap-12 lg:grid-cols-[4fr_8fr] lg:gap-16 items-start">
            <div className="relative mx-auto w-full max-w-[280px] lg:max-w-sm">
              {biographies[0]?.profileImageUrl ? (
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                   <img
                     src={resolveMediaUrl(biographies[0].profileImageUrl)!}
                     alt="Profile"
                     className="absolute inset-0 h-full w-full object-cover"
                   />
                </div>
              ) : (
                <div className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl bg-[#f1f2ea] text-[#69734f] relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                </div>
              )}
            </div>
          
          <div className="flex h-full flex-col justify-between">
            <div>
            <h3 className="mb-4 font-display text-2xl font-bold text-[#69734f] sm:text-3xl uppercase">
              {biographies[0]?.sectionTitle || "I'm a UI/UX Designer based in Jakarta who loves clean, simple & unique design."}
            </h3>
            <div 
              className="prose prose-sm max-w-none text-[15px] leading-relaxed text-[#60684f] mb-6 sm:prose-base"
              dangerouslySetInnerHTML={{ __html: biographies[0]?.contentHtml || "<p>Welcome to my profile. I help businesses build modern websites.</p>" }}
            />
            
            </div>

            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
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
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className={`about-stat-card about-stat-card--${index + 1}`}
                >
                  <article className="group rounded-2xl sm:rounded-[1.5rem] border border-[#d5dbc9] bg-white/75 px-3 py-4 sm:px-5 sm:py-6 text-center sm:text-left shadow-[0_16px_40px_rgba(23,52,40,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#69734f] hover:bg-white hover:shadow-[0_24px_50px_rgba(23,52,40,0.12)]">
                    <p className="text-[9px] sm:text-[11px] font-semibold uppercase tracking-widest sm:tracking-[0.22em] text-[#8a9472] truncate">
                      {stat.label}
                    </p>
                    <p className="mt-2 sm:mt-4 font-display text-xl sm:text-3xl font-bold text-[#69734f] transition-transform duration-300 sm:group-hover:translate-x-1">
                      {stat.value}
                    </p>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ServicesPremiumSection services={services} />

      <PackageSection
        packagePlans={packagePlans}
        defaultCtaHref={normalizeWhatsAppLink(siteSettings?.contactPhone) ?? "#contact"}
      />

      <section
        id="proof"
        className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
      >
        <div className="relative overflow-hidden rounded-[2.6rem] border border-[#d5dbc9] bg-[#f1f4eb] px-5 py-8 shadow-[0_28px_70px_rgba(23,52,40,0.08)] sm:px-8 sm:py-10 lg:px-12 lg:py-14">
          <div className="pointer-events-none absolute left-[-5rem] top-10 h-40 w-40 rounded-full bg-[#a9b38d]/18 blur-3xl" />
          <div className="pointer-events-none absolute right-[-6rem] bottom-0 h-52 w-52 rounded-full bg-[#69734f]/10 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl font-bold text-[#69734f] sm:text-5xl">
                Dipercaya 700+ Brand yang Tidak Ingin Terlihat Biasa
              </h2>
              <p className="mt-5 text-justify text-base leading-8 text-[#60684f] sm:text-lg">
                Lebih dari 700 brand telah mempercayakan identitas digital
                mereka kepada kami, dari bisnis berkembang hingga perusahaan
                mapan yang ingin tampil lebih eksklusif, lebih dipercaya, dan
                lebih unggul dari kompetitor.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Brand", value: "700+" },
                { label: "Rating", value: `${averageRating}/5` },
                { label: "Pilihan", value: "Premium" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.6rem] border border-[#d5dbc9] bg-white/78 px-5 py-6 shadow-[0_16px_35px_rgba(23,52,40,0.06)]"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a9472]">
                    {item.label}
                  </p>
                  <p className="mt-3 font-display text-3xl font-bold text-[#69734f]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-12">
            <IsotopePortfolio 
              items={socialProof.map(proof => ({
                 id: proof.id,
                 title: proof.clientName,
                 subtitle: proof.clientCompany || proof.projectCategory || "Client",
                 description: proof.testimonialText,
                 rating: proof.rating
              }))}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-6 overflow-hidden rounded-[2.6rem] border border-[#d5dbc9] bg-white/72 p-6 shadow-[0_24px_60px_rgba(23,52,40,0.06)] lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:p-10">
          <div className="rounded-[2rem] border border-[#dbe1cf] bg-[#f4f7ee] p-8">
            <h2 className="font-display text-4xl font-bold text-[#69734f] sm:text-5xl">
              Di Era Digital, Tampilan Anda Menentukan Harga Anda
            </h2>
            <p className="mt-6 max-w-xl text-justify text-base leading-8 text-[#60684f] sm:text-lg">
              Calon pelanggan menilai dalam hitungan detik. Jika tampilan Anda
              terasa biasa, kepercayaan ikut turun dan nilai bisnis ikut
              ditekan. Website bukan biaya. Ini adalah alat positioning.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[2rem] border border-[#d5dbc9] bg-[#f8faf3] p-8 shadow-[0_18px_40px_rgba(23,52,40,0.05)]">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a9472]">
                Jika Terlihat Biasa
              </p>
              <ul className="space-y-4 text-[#60684f] [&_li>span:first-child]:hidden">
                {pressureRisks.map((item) => (
                  <li
                    key={item}
                    className="relative pl-10 text-sm leading-7 before:absolute before:left-0 before:top-0.5 before:inline-flex before:h-6 before:w-6 before:items-center before:justify-center before:rounded-full before:border before:border-[#cfd6bf] before:bg-white before:text-[11px] before:font-bold before:text-[#69734f] before:content-['-']"
                  >
                    <span className="font-semibold text-[#69734f]">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] border border-[#6e7951] bg-[#69734f] p-8 text-white shadow-[0_24px_50px_rgba(23,52,40,0.08)]">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/62">
                Jika Tampil Tepat
              </p>
              <ul className="space-y-4 text-white/90 [&_li>span:first-child]:hidden">
                {pressureWins.map((item) => (
                  <li
                    key={item}
                    className="relative pl-10 text-sm leading-7 before:absolute before:left-0 before:top-0.5 before:inline-flex before:h-6 before:w-6 before:items-center before:justify-center before:rounded-full before:border before:border-white/16 before:bg-white/10 before:text-[11px] before:font-bold before:text-[#dce4cb] before:content-['+']"
                  >
                    <span className="font-semibold text-[#a9b38d]">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#69734f] py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
          <div>
            <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.28em] text-white/60">
              Exclusivity Frame
            </p>
            <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
              Tidak Semua Bisnis Cocok Bekerja Dengan Kami
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/82 sm:text-lg">
              Jika Anda mencari website murah, kami bukan pilihan. Jika Anda ingin
              brand Anda terlihat mahal, kita satu frekuensi.
            </p>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/58">
                Kami bekerja dengan bisnis yang:
              </p>
              <ul className="space-y-4 text-sm leading-7 text-white/90">
                {exclusivityPoints.map((item) => (
                  <li key={item} className="flex items-start gap-3 border-b border-white/10 pb-4">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#a9b38d]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
      >
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <h2 className="font-display text-4xl font-bold text-[#69734f] sm:text-5xl">
            Bangun Citra Premium Anda Sekarang
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-justify text-base leading-8 text-[#60684f] sm:text-center sm:text-lg">
            Jika Anda serius ingin meningkatkan value bisnis, memenangkan
            kepercayaan pasar, dan tampil sebagai leader di industri Anda, kami
            siap merancangnya untuk Anda.
          </p>
        </div>
        
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-[2.8rem] border border-[#6e7951] bg-[#69734f] p-4 shadow-[0_30px_80px_rgba(23,52,40,0.16)] lg:p-5">
            <div className="grid gap-4 lg:grid-cols-2">
             <div className="flex h-full flex-col justify-center rounded-[2.2rem] border border-white/12 bg-[#f1f4eb] p-8 shadow-[0_18px_40px_rgba(23,52,40,0.12)]">
               <h3 className="mb-6 border-b border-[#dbe1cf] pb-4 font-display text-2xl font-bold text-[#69734f]">
                 Siap Jika Anda Ingin
               </h3>
               <ul className="mb-8 space-y-4 text-sm leading-7 text-[#60684f]">
                 {strongCtaPoints.map((item) => (
                   <li key={item} className="flex items-start gap-3">
                     <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#87926d]" />
                     <span>{item}</span>
                   </li>
                 ))}
               </ul>
               <p className="mb-8 text-sm leading-7 text-[#7a8460]">
                 Konsultasi terbatas setiap minggu. Amankan slot Anda sekarang
                 sebelum penuh.
               </p>
               <div className="mb-6 flex items-center gap-4 rounded-[1.4rem] border border-[#dbe1cf] bg-white/80 px-4 py-4">
                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#69734f] text-xl text-white">
                   <i className="bi bi-envelope"></i>
                 </div>
                 <div>
                   <h4 className="text-lg font-bold text-[#69734f]">Email</h4>
                   <p className="text-[14px] text-[#60684f]">{siteSettings?.contactEmail || "info@example.com"}</p>
                 </div>
               </div>
               
               <div className="flex items-center gap-4 rounded-[1.4rem] border border-[#dbe1cf] bg-white/80 px-4 py-4">
                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#69734f] text-xl text-white">
                   <i className="bi bi-whatsapp"></i>
                 </div>
                 <div>
                   <h4 className="text-lg font-bold text-[#69734f]">WhatsApp</h4>
                   <p className="text-[14px] text-[#60684f]">{siteSettings?.contactPhone || "+1 5589 55488 55"}</p>
                 </div>
               </div>
             </div>
             
             <div className="flex flex-col justify-center rounded-[2.2rem] border border-white/12 bg-[#5f6948] p-10 text-white text-center">
               <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/14 bg-white/8 text-3xl text-[#dce4cb]">
                 <i className="bi bi-stars"></i>
               </div>
               <h3 className="mb-4 font-display text-3xl font-bold">Amankan Slot Anda</h3>
               <p className="mb-8 leading-relaxed text-[15px] text-white/88">
                  Konsultasi eksklusif untuk bisnis yang ingin tampil lebih mahal,
                  lebih dipercaya, dan lebih unggul dari kompetitor.
                </p>
                
               <SmartLink
                  href={ctaButtonUrl}
                  className="inline-flex items-center justify-center rounded-full bg-[#f1f4eb] px-8 py-3 uppercase tracking-widest text-[13px] font-bold text-[#69734f] transition-transform hover:-translate-y-1"
               >
                  Konsultasi Sekarang
               </SmartLink>
             </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#69734f] py-12 text-center text-white/90">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="mb-8 border-b border-white/10 pb-8">
            <h2 className="font-display text-3xl font-bold text-white mb-4">{siteName}</h2>
            <p className="text-gray-300 italic">{tagline}</p>
          </div>
          
          <div className="mb-8 flex justify-center gap-4">
            {socialLinks.map((link) => (
              <SmartLink
                key={link.id}
                href={link.url}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-[#69734f]"
              >
                <SocialIcon
                  iconName={link.iconName}
                  platform={link.platform}
                  className="h-4 w-4"
                />
              </SmartLink>
            ))}
          </div>
          
          <div className="text-[14px] text-gray-300">
            <p>&copy; Copyright <span className="font-bold text-white">{siteName}</span>. All Rights Reserved</p>
          </div>
        </div>
      </footer>
      <ScrollToTop />
    </main>
  );
}
