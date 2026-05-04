import type { Metadata } from "next";
import { connection } from "next/server";
import { resolveMediaUrl } from "@/lib/media-url";
import { prisma } from "@/lib/prisma";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const defaultSiteName = "Wijaya Company";
const defaultDescription =
  "Website profesional untuk bisnis, sekolah, desa, dan UMKM yang ingin tampil lebih meyakinkan.";
const metadataBase =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  await connection();

  const [homeSeo, siteSettings] = await Promise.all([
    prisma.seoMetadata.findUnique({
      where: {
        pageSlug: "home",
      },
    }),
    prisma.siteSettings.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    }),
  ]);

  const siteName = siteSettings?.siteName ?? defaultSiteName;
  const title =
    homeSeo?.metaTitle ?? siteSettings?.tabTitle ?? `${siteName} | Website`;
  const description =
    homeSeo?.metaDescription ??
    siteSettings?.metaDescription ??
    defaultDescription;
  const ogTitle = homeSeo?.ogTitle ?? siteName;
  const ogDescription = homeSeo?.ogDescription ?? description;
  const ogImage = resolveMediaUrl(
    homeSeo?.ogImageUrl ?? siteSettings?.ogImageUrl,
  );
  const icon = resolveMediaUrl(
    siteSettings?.faviconUrl ?? siteSettings?.logoUrl,
  );

  return {
    metadataBase: new URL(metadataBase),
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    alternates: homeSeo?.canonicalUrl
      ? {
        canonical: homeSeo.canonicalUrl,
      }
      : undefined,
    icons: icon
      ? {
        icon,
        shortcut: icon,
        apple: icon,
      }
      : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
