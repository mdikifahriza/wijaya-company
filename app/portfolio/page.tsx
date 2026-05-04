import { connection } from "next/server";

import { FolioHeader, ScrollToTop } from "@/app/_components/folio-js";
import { ProjectsShowcaseSection } from "@/app/_components/projects-showcase-section";
import { resolveMediaUrl } from "@/lib/media-url";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Proyek Kami",
  description: "Kumpulan proyek pilihan untuk melihat kualitas presentasi, struktur, dan arah visual project.",
};

export default async function PortfolioListPage() {
  await connection();

  const [siteSettings, portfoliosFromSql] = await Promise.all([
    prisma.siteSettings.findFirst({
      orderBy: { updatedAt: "desc" },
    }),
    prisma.$queryRaw<
      Array<{
        id: string;
        slug: string;
        title: string;
        thumbnailUrl: string | null;
        isFeatured: boolean;
        projectCategoryName: string | null;
        projectCategory: string | null;
      }>
    >`
      SELECT
        p.id::text AS id,
        p.slug,
        p.title,
        p.thumbnail_url AS "thumbnailUrl",
        p.is_featured AS "isFeatured",
        c.name AS "projectCategoryName",
        p.project_category::text AS "projectCategory"
      FROM portfolio p
      LEFT JOIN project_categories c
        ON c.id = p.project_category
      ORDER BY
        c.name ASC NULLS LAST,
        p.is_featured DESC,
        p.sort_order ASC,
        p.published_at DESC NULLS LAST,
        p.created_at DESC
    `.catch(() => []),
  ]);

  const portfolios = portfoliosFromSql.length > 0
    ? portfoliosFromSql
    : (await prisma.portfolio.findMany({
        orderBy: [
          { isFeatured: "desc" },
          { sortOrder: "asc" },
          { publishedAt: "desc" },
          { createdAt: "desc" },
        ],
      })).map((portfolio) => ({
        id: portfolio.id,
        slug: portfolio.slug,
        title: portfolio.title,
        thumbnailUrl: portfolio.thumbnailUrl,
        isFeatured: Boolean((portfolio as { isFeatured?: unknown }).isFeatured),
        projectCategoryName: null,
        projectCategory:
          typeof (portfolio as { projectCategory?: unknown }).projectCategory === "string"
            ? (portfolio as unknown as { projectCategory: string }).projectCategory
            : null,
      }));

  const siteName = siteSettings?.siteName ?? "Wijaya Company";
  const logoUrl = resolveMediaUrl(siteSettings?.logoUrl);

  return (
    <main className="relative min-h-screen bg-[#e5e9dc] text-[#69734f]">
      <FolioHeader
        siteName={siteName}
        logoUrl={logoUrl}
        navLinks={[
          { href: "/", label: "Home" },
          { href: "/portfolio", label: "Proyek Kami" },
          { href: "/#contact", label: "Kontak" },
        ]}
      />

      <div className="pt-16">
        <ProjectsShowcaseSection
          portfolios={portfolios}
          featuredOnly={false}
          showMoreButton={false}
        />
      </div>
      <ScrollToTop />
    </main>
  );
}
