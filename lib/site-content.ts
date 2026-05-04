import { cache } from "react";

import { prisma } from "@/lib/prisma";

const fallbackServices = [
  {
    id: "fallback-service-1",
    title: "Website Company Profile",
    description:
      "Halaman profil bisnis yang rapi, cepat, dan dibuat untuk membangun kepercayaan sejak kunjungan pertama.",
    thumbnailUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    serviceFeatures: [
      {
        id: "fallback-feature-1",
        serviceId: "fallback-service-1",
        featureText: "Desain premium yang responsif di semua perangkat",
        sortOrder: 0,
      },
      {
        id: "fallback-feature-2",
        serviceId: "fallback-service-1",
        featureText: "Copy dan struktur halaman yang fokus ke konversi",
        sortOrder: 1,
      },
    ],
  },
  {
    id: "fallback-service-2",
    title: "Landing Page Promosi",
    description:
      "Landing page untuk iklan, campaign, dan peluncuran produk dengan alur yang lebih singkat dan ajakan yang jelas.",
    thumbnailUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    serviceFeatures: [
      {
        id: "fallback-feature-3",
        serviceId: "fallback-service-2",
        featureText: "CTA dan form yang siap dipakai untuk lead generation",
        sortOrder: 0,
      },
      {
        id: "fallback-feature-4",
        serviceId: "fallback-service-2",
        featureText: "Siap dihubungkan ke WhatsApp, email, atau CRM",
        sortOrder: 1,
      },
    ],
  },
  {
    id: "fallback-service-3",
    title: "Dashboard Konten & Update",
    description:
      "Panel admin sederhana agar tim Anda lebih mudah mengubah teks, gambar, dan bagian penting tanpa repot.",
    thumbnailUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    serviceFeatures: [
      {
        id: "fallback-feature-5",
        serviceId: "fallback-service-3",
        featureText: "Struktur konten yang mudah dipelihara",
        sortOrder: 0,
      },
      {
        id: "fallback-feature-6",
        serviceId: "fallback-service-3",
        featureText: "Integrasi database dan media storage modern",
        sortOrder: 1,
      },
    ],
  },
];

const fallbackPackagePlans = [
  {
    id: "fallback-package-1",
    slug: "silver",
    name: "Paket Silver",
    summary:
      "Paket ini cocok untuk Anda yang baru memulai bisnis dan membutuhkan website sederhana yang praktis.",
    priceLabel: "Rp 3,7 juta",
    priceAmount: 3700000,
    renewalLabel: "Perpanjangan 500rb/tahun",
    ctaLabel: "Book Now",
    ctaUrl: null,
    isFeatured: false,
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    packageFeatures: [
      {
        id: "fallback-package-feature-1",
        packagePlanId: "fallback-package-1",
        featureText: "4 Menu",
        sortOrder: 0,
      },
      {
        id: "fallback-package-feature-2",
        packagePlanId: "fallback-package-1",
        featureText: "FREE Domain Web.id",
        sortOrder: 1,
      },
      {
        id: "fallback-package-feature-3",
        packagePlanId: "fallback-package-1",
        featureText: "Hosting 500 MB (30 foto kuota kerja)",
        sortOrder: 2,
      },
      {
        id: "fallback-package-feature-4",
        packagePlanId: "fallback-package-1",
        featureText: "Integrasi Sosial Media",
        sortOrder: 3,
      },
      {
        id: "fallback-package-feature-4b",
        packagePlanId: "fallback-package-1",
        featureText: "Website SSL",
        sortOrder: 4,
      },
      {
        id: "fallback-package-feature-4c",
        packagePlanId: "fallback-package-1",
        featureText: "Template WP Premium",
        sortOrder: 5,
      },
      {
        id: "fallback-package-feature-4d",
        packagePlanId: "fallback-package-1",
        featureText: "User + Video Panduan Edit",
        sortOrder: 6,
      },
      {
        id: "fallback-package-feature-4e",
        packagePlanId: "fallback-package-1",
        featureText: "Server Rata-Rata 5 Mili Detik",
        sortOrder: 7,
      },
      {
        id: "fallback-package-feature-4f",
        packagePlanId: "fallback-package-1",
        featureText: "Bandwidth Unlimited",
        sortOrder: 8,
      },
      {
        id: "fallback-package-feature-4g",
        packagePlanId: "fallback-package-1",
        featureText: "Standar Kontak Form",
        sortOrder: 9,
      },
      {
        id: "fallback-package-feature-4h",
        packagePlanId: "fallback-package-1",
        featureText: "Free Support",
        sortOrder: 10,
      },
      {
        id: "fallback-package-feature-4i",
        packagePlanId: "fallback-package-1",
        featureText: "Bergaransi Selamanya",
        sortOrder: 11,
      },
    ],
  },
  {
    id: "fallback-package-2",
    slug: "gold",
    name: "Paket Gold",
    summary:
      "Paket ini ideal untuk Anda yang membutuhkan website dengan fitur lengkap seperti e-commerce, blog, dan lainnya.",
    priceLabel: "Rp 6,8 juta",
    priceAmount: 6800000,
    renewalLabel: "Perpanjangan 600rb/tahun",
    ctaLabel: "Book Now",
    ctaUrl: null,
    isFeatured: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    packageFeatures: [
      {
        id: "fallback-package-feature-5",
        packagePlanId: "fallback-package-2",
        featureText: "8 Menu",
        sortOrder: 0,
      },
      {
        id: "fallback-package-feature-6",
        packagePlanId: "fallback-package-2",
        featureText: "Gratis Domain .com",
        sortOrder: 1,
      },
      {
        id: "fallback-package-feature-7",
        packagePlanId: "fallback-package-2",
        featureText: "Hosting 3 GB (70 foto kuota kerja)",
        sortOrder: 2,
      },
      {
        id: "fallback-package-feature-8",
        packagePlanId: "fallback-package-2",
        featureText: "Integrasi Media Sosial",
        sortOrder: 3,
      },
      {
        id: "fallback-package-feature-9",
        packagePlanId: "fallback-package-2",
        featureText: "Free Whatsapp/Telepon",
        sortOrder: 4,
      },
      {
        id: "fallback-package-feature-9b",
        packagePlanId: "fallback-package-2",
        featureText: "Website SSL",
        sortOrder: 5,
      },
      {
        id: "fallback-package-feature-9c",
        packagePlanId: "fallback-package-2",
        featureText: "Template WP Premium",
        sortOrder: 6,
      },
      {
        id: "fallback-package-feature-9d",
        packagePlanId: "fallback-package-2",
        featureText: "User dan Video Panduan Edit",
        sortOrder: 7,
      },
      {
        id: "fallback-package-feature-9e",
        packagePlanId: "fallback-package-2",
        featureText: "Free Banner dan Logo",
        sortOrder: 8,
      },
      {
        id: "fallback-package-feature-9f",
        packagePlanId: "fallback-package-2",
        featureText: "Pemasangan Google Map",
        sortOrder: 9,
      },
      {
        id: "fallback-package-feature-9g",
        packagePlanId: "fallback-package-2",
        featureText: "Respon Server Rata-Rata 5 Mili Detik",
        sortOrder: 10,
      },
      {
        id: "fallback-package-feature-9h",
        packagePlanId: "fallback-package-2",
        featureText: "Bandwidth Unlimited",
        sortOrder: 11,
      },
      {
        id: "fallback-package-feature-9i",
        packagePlanId: "fallback-package-2",
        featureText: "Statistic Kunjungan Website",
        sortOrder: 12,
      },
      {
        id: "fallback-package-feature-9j",
        packagePlanId: "fallback-package-2",
        featureText: "Standar Kontak Form",
        sortOrder: 13,
      },
      {
        id: "fallback-package-feature-9k",
        packagePlanId: "fallback-package-2",
        featureText: "Free Support",
        sortOrder: 14,
      },
      {
        id: "fallback-package-feature-9l",
        packagePlanId: "fallback-package-2",
        featureText: "Garansi Selamanya",
        sortOrder: 15,
      },
    ],
  },
  {
    id: "fallback-package-3",
    slug: "platinum",
    name: "Paket Platinum",
    summary:
      "Paket ini ideal untuk Anda yang membutuhkan website dengan fitur kompleks dan desain yang unik serta menarik.",
    priceLabel: "Rp 9,8 juta",
    priceAmount: 9800000,
    renewalLabel: "Perpanjangan 50% per tahun",
    ctaLabel: "Book Now",
    ctaUrl: null,
    isFeatured: false,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    packageFeatures: [
      {
        id: "fallback-package-feature-10",
        packagePlanId: "fallback-package-3",
        featureText: "15-20 Menu",
        sortOrder: 0,
      },
      {
        id: "fallback-package-feature-11",
        packagePlanId: "fallback-package-3",
        featureText: "Gratis Domain .com, .id, .co.id",
        sortOrder: 1,
      },
      {
        id: "fallback-package-feature-12",
        packagePlanId: "fallback-package-3",
        featureText: "Hosting 5 GB (120 foto kuota kerja)",
        sortOrder: 2,
      },
      {
        id: "fallback-package-feature-13",
        packagePlanId: "fallback-package-3",
        featureText: "Free Whatsapp/Telepon",
        sortOrder: 3,
      },
      {
        id: "fallback-package-feature-14",
        packagePlanId: "fallback-package-3",
        featureText: "Integrasi Media Sosial",
        sortOrder: 4,
      },
      {
        id: "fallback-package-feature-15",
        packagePlanId: "fallback-package-3",
        featureText: "Website SSL",
        sortOrder: 5,
      },
      {
        id: "fallback-package-feature-16",
        packagePlanId: "fallback-package-3",
        featureText: "Template WP Premium",
        sortOrder: 6,
      },
      {
        id: "fallback-package-feature-17",
        packagePlanId: "fallback-package-3",
        featureText: "User dan Video Panduan Edit",
        sortOrder: 7,
      },
      {
        id: "fallback-package-feature-18",
        packagePlanId: "fallback-package-3",
        featureText: "Plugin Premium",
        sortOrder: 8,
      },
      {
        id: "fallback-package-feature-19",
        packagePlanId: "fallback-package-3",
        featureText: "Free Banner dan Logo",
        sortOrder: 9,
      },
      {
        id: "fallback-package-feature-20",
        packagePlanId: "fallback-package-3",
        featureText: "Free 1 Email Bisnis",
        sortOrder: 10,
      },
      {
        id: "fallback-package-feature-21",
        packagePlanId: "fallback-package-3",
        featureText: "Pemasangan Google Map",
        sortOrder: 11,
      },
      {
        id: "fallback-package-feature-22",
        packagePlanId: "fallback-package-3",
        featureText: "Respon Server Rata-Rata 5 Mili Detik",
        sortOrder: 12,
      },
      {
        id: "fallback-package-feature-23",
        packagePlanId: "fallback-package-3",
        featureText: "Bandwidth Unlimited",
        sortOrder: 13,
      },
      {
        id: "fallback-package-feature-24",
        packagePlanId: "fallback-package-3",
        featureText: "Statistic Kunjungan Website",
        sortOrder: 14,
      },
      {
        id: "fallback-package-feature-25",
        packagePlanId: "fallback-package-3",
        featureText: "Standar Kontak Form",
        sortOrder: 15,
      },
      {
        id: "fallback-package-feature-26",
        packagePlanId: "fallback-package-3",
        featureText: "Free Support",
        sortOrder: 16,
      },
      {
        id: "fallback-package-feature-27",
        packagePlanId: "fallback-package-3",
        featureText: "Garansi Selamanya",
        sortOrder: 17,
      },
      {
        id: "fallback-package-feature-28",
        packagePlanId: "fallback-package-3",
        featureText: "Integrasi Lapak Media",
        sortOrder: 18,
      },
    ],
  },
];

const fallbackPortfolios = [
  {
    id: "fallback-portfolio-1",
    slug: "company-profile-aruna",
    title: "Aruna Profile",
    summary: "Website company profile yang menonjolkan layanan studio dan memperjelas alur kontak calon klien.",
    contentHtml:
      "<p>Project company profile dengan fokus pada alur presentasi layanan, galeri hasil kerja, dan CTA yang lebih jelas untuk calon klien.</p>",
    thumbnailUrl: null,
    projectUrl: "#contact",
    clientName: "Studio Aruna",
    projectCategory: "Company Profile",
    sortOrder: 0,
    isFeatured: true,
    publishedAt: new Date("2026-03-12T08:00:00.000Z"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "fallback-portfolio-2",
    slug: "landing-page-nusantara-print",
    title: "Nusantara Print",
    summary: "Landing page promosi untuk menjelaskan layanan cetak dengan CTA yang lebih fokus dan cepat dipahami.",
    contentHtml:
      "<p>Project landing page untuk campaign promosi dengan struktur konten lebih singkat, penekanan pada value utama, dan tombol aksi yang lebih tegas.</p>",
    thumbnailUrl: null,
    projectUrl: "#contact",
    clientName: "Nusantara Print",
    projectCategory: "Landing Page",
    sortOrder: 1,
    isFeatured: false,
    publishedAt: new Date("2026-02-25T08:00:00.000Z"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "fallback-portfolio-3",
    slug: "cms-sagara-edu",
    title: "Sagara Edu",
    summary: "Website profil dengan panel update konten ringan agar tim internal bisa memperbarui informasi lebih cepat.",
    contentHtml:
      "<p>Website profil institusi dengan area konten yang lebih mudah dipelihara, cocok untuk tim internal yang perlu memperbarui informasi berkala.</p>",
    thumbnailUrl: null,
    projectUrl: "#contact",
    clientName: "Sagara Edu",
    projectCategory: "CMS",
    sortOrder: 2,
    isFeatured: false,
    publishedAt: new Date("2026-01-18T08:00:00.000Z"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const fallbackProofs = [
  {
    id: "fallback-proof-1",
    clientName: "Rina Prasetya",
    clientTitle: "Founder",
    clientCompany: "Studio Aruna",
    testimonialText:
      "Timnya cepat menangkap kebutuhan bisnis kami. Hasilnya terasa premium dan jauh lebih meyakinkan saat dipresentasikan ke calon klien.",
    rating: 5,
    avatarUrl: null,
    projectCategory: "Company Profile",
    sortOrder: 0,
    isFeatured: true,
    createdAt: new Date(),
  },
  {
    id: "fallback-proof-2",
    clientName: "Fajar Nugroho",
    clientTitle: "Owner",
    clientCompany: "Nusantara Print",
    testimonialText:
      "Landing page baru membantu kami menjelaskan layanan dengan lebih singkat dan langsung terasa profesional.",
    rating: 5,
    avatarUrl: null,
    projectCategory: "Landing Page",
    sortOrder: 1,
    isFeatured: false,
    createdAt: new Date(),
  },
  {
    id: "fallback-proof-3",
    clientName: "Dewi Lestari",
    clientTitle: "Manager Operasional",
    clientCompany: "Sagara Edu",
    testimonialText:
      "Struktur kontennya rapi dan adminnya enak dipakai. Tim internal kami jadi lebih cepat update informasi.",
    rating: 5,
    avatarUrl: null,
    projectCategory: "CMS",
    sortOrder: 2,
    isFeatured: false,
    createdAt: new Date(),
  },
];

const fallbackFooterColumns = [
  {
    id: "fallback-footer-1",
    columnTitle: "Navigasi",
    sortOrder: 0,
    footerLinks: [
      {
        id: "fallback-link-1",
        columnId: "fallback-footer-1",
        label: "Hero",
        url: "#hero",
        isExternal: false,
        sortOrder: 0,
      },
      {
        id: "fallback-link-2",
        columnId: "fallback-footer-1",
        label: "Layanan",
        url: "#services",
        isExternal: false,
        sortOrder: 1,
      },
      {
        id: "fallback-link-3",
        columnId: "fallback-footer-1",
        label: "Bukti",
        url: "#portfolio",
        isExternal: false,
        sortOrder: 2,
      },
    ],
  },
  {
    id: "fallback-footer-2",
    columnTitle: "Kontak",
    sortOrder: 1,
    footerLinks: [
      {
        id: "fallback-link-4",
        columnId: "fallback-footer-2",
        label: "Hubungi Kami",
        url: "#contact",
        isExternal: false,
        sortOrder: 0,
      },
    ],
  },
];

export const getLandingPageData = cache(async () => {
  try {
    const [
      siteSettings,
      homeSeo,
      hero,
      services,
      packagePlans,
      portfolios,
      socialProof,
      cta,
      footerColumns,
      socialLinks,
      biographies,
    ] = await Promise.all([
      prisma.siteSettings.findFirst({
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.seoMetadata.findUnique({
        where: {
          pageSlug: "home",
        },
      }),
      prisma.heroSection.findFirst({
        orderBy: {
          updatedAt: "desc",
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
        orderBy: [
          {
            isFeatured: "desc",
          },
          {
            sortOrder: "asc",
          },
          {
            publishedAt: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
      }),
      prisma.socialProof.findMany({
        orderBy: [
          {
            isFeatured: "desc",
          },
          {
            sortOrder: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
      }),
      prisma.ctaSection.findFirst({
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
      prisma.biography.findMany({
        orderBy: {
          updatedAt: "desc",
        },
      }),
    ]);

    return {
      siteSettings,
      homeSeo,
      hero,
      services: services.length > 0 ? services : fallbackServices,
      packagePlans:
        packagePlans.length > 0 ? packagePlans : fallbackPackagePlans,
      portfolios: portfolios.length > 0 ? portfolios : fallbackPortfolios,
      socialProof: socialProof.length > 0 ? socialProof : fallbackProofs,
      cta,
      footerColumns:
        footerColumns.length > 0 ? footerColumns : fallbackFooterColumns,
      socialLinks,
      biographies,
    };
  } catch (error) {
    console.error("Failed to load landing page data from database", error);

    return {
      siteSettings: null,
      homeSeo: null,
      hero: null,
      services: fallbackServices,
      packagePlans: fallbackPackagePlans,
      portfolios: fallbackPortfolios,
      socialProof: fallbackProofs,
      cta: null,
      footerColumns: fallbackFooterColumns,
      socialLinks: [],
      biographies: [],
    };
  }
});
