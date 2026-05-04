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

const packagePlans = [
  {
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
    features: [
      "4 Menu",
      "FREE Domain Web.id",
      "Hosting 500 MB (30 foto kuota kerja)",
      "Integrasi Sosial Media",
      "Website SSL",
      "Template WP Premium",
      "User + Video Panduan Edit",
      "Server Rata-Rata 5 Mili Detik",
      "Bandwidth Unlimited",
      "Standar Kontak Form",
      "Free Support",
      "Bergaransi Selamanya",
    ],
  },
  {
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
    features: [
      "8 Menu",
      "Gratis Domain .com",
      "Hosting 3 GB (70 foto kuota kerja)",
      "Integrasi Media Sosial",
      "Free Whatsapp/Telepon",
      "Website SSL",
      "Template WP Premium",
      "User dan Video Panduan Edit",
      "Free Banner dan Logo",
      "Pemasangan Google Map",
      "Respon Server Rata-Rata 5 Mili Detik",
      "Bandwidth Unlimited",
      "Statistic Kunjungan Website",
      "Standar Kontak Form",
      "Free Support",
      "Garansi Selamanya",
    ],
  },
  {
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
    features: [
      "15-20 Menu",
      "Gratis Domain .com, .id, .co.id",
      "Hosting 5 GB (120 foto kuota kerja)",
      "Free Whatsapp/Telepon",
      "Integrasi Media Sosial",
      "Website SSL",
      "Template WP Premium",
      "User dan Video Panduan Edit",
      "Plugin Premium",
      "Free Banner dan Logo",
      "Free 1 Email Bisnis",
      "Pemasangan Google Map",
      "Respon Server Rata-Rata 5 Mili Detik",
      "Bandwidth Unlimited",
      "Statistic Kunjungan Website",
      "Standar Kontak Form",
      "Free Support",
      "Garansi Selamanya",
      "Integrasi Lapak Media",
    ],
  },
];

async function main() {
  const allowedSlugs = packagePlans.map((plan) => plan.slug);

  await prisma.packagePlan.deleteMany({
    where: {
      slug: {
        notIn: allowedSlugs,
      },
    },
  });

  for (const plan of packagePlans) {
    await prisma.packagePlan.upsert({
      where: {
        slug: plan.slug,
      },
      update: {
        name: plan.name,
        summary: plan.summary,
        priceLabel: plan.priceLabel,
        priceAmount: plan.priceAmount,
        renewalLabel: plan.renewalLabel,
        ctaLabel: plan.ctaLabel,
        ctaUrl: plan.ctaUrl,
        isFeatured: plan.isFeatured,
        sortOrder: plan.sortOrder,
        packageFeatures: {
          deleteMany: {},
          create: plan.features.map((featureText, index) => ({
            featureText,
            sortOrder: index,
          })),
        },
      },
      create: {
        slug: plan.slug,
        name: plan.name,
        summary: plan.summary,
        priceLabel: plan.priceLabel,
        priceAmount: plan.priceAmount,
        renewalLabel: plan.renewalLabel,
        ctaLabel: plan.ctaLabel,
        ctaUrl: plan.ctaUrl,
        isFeatured: plan.isFeatured,
        sortOrder: plan.sortOrder,
        packageFeatures: {
          create: plan.features.map((featureText, index) => ({
            featureText,
            sortOrder: index,
          })),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Failed to seed package plans", error);
    await prisma.$disconnect();
    process.exit(1);
  });
