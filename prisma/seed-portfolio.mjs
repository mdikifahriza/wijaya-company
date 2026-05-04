import nextEnv from "@next/env";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const portfolioItems = [
  {
    slug: "company-profile-aruna",
    title: "Aruna Profile",
    summary:
      "Website company profile yang menonjolkan layanan studio dan memperjelas alur kontak calon klien.",
    contentHtml:
      "<p>Project company profile dengan fokus pada alur presentasi layanan, galeri hasil kerja, dan CTA yang lebih jelas untuk calon klien.</p>",
    thumbnailUrl: null,
    projectUrl: "#contact",
    clientName: "Studio Aruna",
    projectCategory: "Company Profile",
    sortOrder: 0,
    isFeatured: true,
    publishedAt: new Date("2026-03-12T08:00:00.000Z"),
  },
  {
    slug: "landing-page-nusantara-print",
    title: "Nusantara Print",
    summary:
      "Landing page promosi untuk menjelaskan layanan cetak dengan CTA yang lebih fokus dan cepat dipahami.",
    contentHtml:
      "<p>Project landing page untuk campaign promosi dengan struktur konten lebih singkat, penekanan pada value utama, dan tombol aksi yang lebih tegas.</p>",
    thumbnailUrl: null,
    projectUrl: "#contact",
    clientName: "Nusantara Print",
    projectCategory: "Landing Page",
    sortOrder: 1,
    isFeatured: false,
    publishedAt: new Date("2026-02-25T08:00:00.000Z"),
  },
  {
    slug: "cms-sagara-edu",
    title: "Sagara Edu",
    summary:
      "Website profil dengan panel update konten ringan agar tim internal bisa memperbarui informasi lebih cepat.",
    contentHtml:
      "<p>Website profil institusi dengan area konten yang lebih mudah dipelihara, cocok untuk tim internal yang perlu memperbarui informasi berkala.</p>",
    thumbnailUrl: null,
    projectUrl: "#contact",
    clientName: "Sagara Edu",
    projectCategory: "CMS",
    sortOrder: 2,
    isFeatured: false,
    publishedAt: new Date("2026-01-18T08:00:00.000Z"),
  },
];

async function main() {
  for (const item of portfolioItems) {
    await prisma.portfolio.upsert({
      where: {
        slug: item.slug,
      },
      update: item,
      create: item,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Failed to seed portfolio", error);
    await prisma.$disconnect();
    process.exit(1);
  });
