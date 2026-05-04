import { cache } from "react";

import { prisma } from "@/lib/prisma";

export const getAdminPageData = cache(async () => {
  try {
    const [
      siteSettings,
      seoMetadata,
      heroSections,
      biographies,
      projectCategories,
      services,
      packagePlans,
      portfolios,
      socialProof,
      ctaSections,
      footerColumns,
      socialLinks,
    ] = await Promise.all([
      prisma.siteSettings.findFirst({
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.seoMetadata.findMany({
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.heroSection.findMany({
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.biography.findMany({
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.projectCategory.findMany({
        orderBy: {
          name: "asc",
        },
      }),
      prisma.service.findMany({
        include: {
          serviceFeatures: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      }),
      prisma.packagePlan.findMany({
        include: {
          packageFeatures: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
        orderBy: [{ sortOrder: "asc" }, { priceAmount: "asc" }, { createdAt: "asc" }],
      }),
      prisma.portfolio.findMany({
        include: {
          projectCategory: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [
          { isFeatured: "desc" },
          { sortOrder: "asc" },
          { publishedAt: "desc" },
          { createdAt: "desc" },
        ],
      }),
      prisma.socialProof.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
      prisma.ctaSection.findMany({
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.footerColumn.findMany({
        include: {
          footerLinks: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
        orderBy: {
          sortOrder: "asc",
        },
      }),
      prisma.socialLink.findMany({
        orderBy: {
          sortOrder: "asc",
        },
      }),
    ]);

    return {
      siteSettings,
      seoMetadata,
      heroSections,
      biographies,
      projectCategories,
      services,
      packagePlans,
      portfolios,
      socialProof,
      ctaSections,
      footerColumns,
      socialLinks,
    };
  } catch (error) {
    console.error("Failed to load admin page data from database", error);

    return {
      siteSettings: null,
      seoMetadata: [],
      heroSections: [],
      biographies: [],
      projectCategories: [],
      services: [],
      packagePlans: [],
      portfolios: [],
      socialProof: [],
      ctaSections: [],
      footerColumns: [],
      socialLinks: [],
    };
  }
});
