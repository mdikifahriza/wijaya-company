import Link from "next/link";

import { resolveMediaUrl } from "@/lib/media-url";

type ProjectCategoryRelation = {
  name?: string | null;
} | null;

type ProjectItem = {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string | null;
  isFeatured: boolean;
  projectCategoryId?: string | null;
  projectCategory?: string | null;
  projectCategoryName?: string | null;
  projectCategoryRelation?: ProjectCategoryRelation;
};

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getCategoryName(project: ProjectItem) {
  if (project.projectCategoryName?.trim()) {
    return project.projectCategoryName.trim();
  }

  if (
    project.projectCategory?.trim() &&
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      project.projectCategory.trim(),
    )
  ) {
    return project.projectCategory.trim();
  }

  const relationName = project.projectCategoryRelation?.name;
  if (relationName?.trim()) {
    return relationName.trim();
  }

  return "Lainnya";
}

export function ProjectsShowcaseSection({
  portfolios,
  featuredOnly = true,
  showHeading = true,
  showMoreButton = true,
  sectionId = "projects",
}: {
  portfolios: ProjectItem[];
  featuredOnly?: boolean;
  showHeading?: boolean;
  showMoreButton?: boolean;
  sectionId?: string;
}) {
  const filteredProjects = featuredOnly
    ? portfolios.filter((item) => item.isFeatured)
    : portfolios;

  const groups = filteredProjects.reduce<Map<string, ProjectItem[]>>((accumulator, item) => {
    const category = getCategoryName(item);
    const bucket = accumulator.get(category);

    if (bucket) {
      bucket.push(item);
      return accumulator;
    }

    accumulator.set(category, [item]);
    return accumulator;
  }, new Map());

  const groupedProjects = Array.from(groups.entries()).map(([category, items]) => ({
    category,
    items,
  }));

  if (groupedProjects.length === 0) {
    return null;
  }

  return (
    <section
      id={sectionId}
      className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-10 lg:py-24"
    >
      {showHeading ? (
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-bold text-[#69734f] sm:text-5xl">
            Proyek Kami
          </h2>
        </div>
      ) : null}

      <div className="space-y-14">
        {groupedProjects.map((group) => (
          <section key={group.category} className="space-y-5">
            <h3 className="text-lg font-semibold uppercase tracking-[0.14em] text-[#69734f]">
              {group.category}
            </h3>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {group.items.map((project) => {
                const imageUrl = resolveMediaUrl(project.thumbnailUrl);

                return (
                  <Link
                    key={project.id}
                    href={`/portfolio/${project.slug}`}
                    className="group relative block overflow-hidden rounded-lg border border-[#d8ddcf] bg-[#eceee8] transition-all duration-300 hover:-translate-y-1 hover:border-[#c4ccb2] hover:shadow-[0_18px_40px_rgba(23,52,40,0.08)]"
                  >
                    <div className="relative flex aspect-[4/3] items-center justify-center bg-[#dde2d4]">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-base font-semibold uppercase tracking-[0.14em] text-[#69734f]">
                          {getInitials(project.title)}
                        </span>
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/72 via-black/24 to-transparent" />
                      <p className="pointer-events-none absolute bottom-4 left-4 right-4 text-xl font-semibold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
                        {project.title}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {showMoreButton ? (
        <div className="mt-12 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-full border border-[#69734f] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#69734f] transition-transform hover:-translate-y-1 hover:bg-[#69734f] hover:text-white"
          >
            Lihat proyek lainnya
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      ) : null}
    </section>
  );
}
