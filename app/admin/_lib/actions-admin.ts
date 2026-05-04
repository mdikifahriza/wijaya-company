"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { deleteImageFileFromR2, uploadImageFileToR2 } from "@/lib/media";
import { requireAdminSession } from "@/lib/auth";
import { normalizeStoredMediaValue } from "@/lib/media-url";

export async function saveHeroAction(formData: FormData) {
  await requireAdminSession();
  
  const id = formData.get("id") as string;
  const headline = formData.get("headline") as string;
  const subheadline = formData.get("subheadline") as string;
  const ctaPrimaryText = formData.get("ctaPrimaryText") as string;
  const ctaPrimaryUrl = formData.get("ctaPrimaryUrl") as string;
  const ctaSecondaryText = formData.get("ctaSecondaryText") as string;
  const ctaSecondaryUrl = formData.get("ctaSecondaryUrl") as string;
  const imageFile = formData.get("image") as File | null;
  const oldImageUrl = normalizeStoredMediaValue(
    String(formData.get("image_old") ?? ""),
  );
  const animatedTextsRaw = formData.get("animatedTexts") as string;
  
  const animatedTexts = animatedTextsRaw
    ? animatedTextsRaw
        .split(/\r?\n|,/)
        .map((text) => text.trim())
        .filter(Boolean)
    : [];

  let imageUrl = oldImageUrl;

  // If a new file is actually uploaded (size > 0), upload it to R2
  if (imageFile && imageFile.size > 0) {
    const uploadResult = await uploadImageFileToR2(imageFile, "hero");
    imageUrl = uploadResult.url ?? oldImageUrl;
    
    // Clean up old image if there was one
    if (oldImageUrl) {
      await deleteImageFileFromR2(oldImageUrl);
    }
  }

  if (id) {
    await prisma.heroSection.update({
      where: { id },
      data: {
        headline,
        subheadline,
        animatedTexts,
        ctaPrimaryText,
        ctaPrimaryUrl,
        ctaSecondaryText,
        ctaSecondaryUrl,
        imageUrl,
      },
    });
  } else {
    // Fallback if no hero exists (should not happen usually since it's single data)
    await prisma.heroSection.create({
      data: {
        headline,
        subheadline,
        animatedTexts,
        ctaPrimaryText,
        ctaPrimaryUrl,
        ctaSecondaryText,
        ctaSecondaryUrl,
        imageUrl,
      },
    });
  }

  revalidatePath("/admin/hero");
  revalidatePath("/", "layout");
}

export async function saveSiteSettingsAction(formData: FormData) {
  await requireAdminSession();

  const id = String(formData.get("id") ?? "");
  const siteName = String(formData.get("siteName") ?? "");
  const tagline = String(formData.get("tagline") ?? "");
  const tabTitle = String(formData.get("tabTitle") ?? "");
  const metaDescription = String(formData.get("metaDescription") ?? "");
  const primaryColor = String(formData.get("primaryColor") ?? "");
  const contactEmail = String(formData.get("contactEmail") ?? "");
  const contactPhone = String(formData.get("contactPhone") ?? "");
  const contactAddress = String(formData.get("contactAddress") ?? "");

  const logoFile = formData.get("logo") as File | null;
  const faviconFile = formData.get("favicon") as File | null;
  const ogImageFile = formData.get("ogImage") as File | null;

  const oldLogoUrl = normalizeStoredMediaValue(
    String(formData.get("logo_old") ?? ""),
  );
  const oldFaviconUrl = normalizeStoredMediaValue(
    String(formData.get("favicon_old") ?? ""),
  );
  const oldOgImageUrl = normalizeStoredMediaValue(
    String(formData.get("ogImage_old") ?? ""),
  );

  let logoUrl = oldLogoUrl || null;
  let faviconUrl = oldFaviconUrl || null;
  let ogImageUrl = oldOgImageUrl || null;

  if (logoFile && logoFile.size > 0) {
    const uploadResult = await uploadImageFileToR2(logoFile, "logo");
    logoUrl = uploadResult.url;

    if (oldLogoUrl) {
      await deleteImageFileFromR2(oldLogoUrl);
    }
  }

  if (faviconFile && faviconFile.size > 0) {
    const uploadResult = await uploadImageFileToR2(faviconFile, "favicon");
    faviconUrl = uploadResult.url;

    if (oldFaviconUrl) {
      await deleteImageFileFromR2(oldFaviconUrl);
    }
  }

  if (ogImageFile && ogImageFile.size > 0) {
    const uploadResult = await uploadImageFileToR2(ogImageFile, "og-image");
    ogImageUrl = uploadResult.url;

    if (oldOgImageUrl) {
      await deleteImageFileFromR2(oldOgImageUrl);
    }
  }

  const data = {
    siteName,
    tagline: tagline || null,
    tabTitle,
    metaDescription: metaDescription || null,
    primaryColor: primaryColor || "#69734f",
    contactEmail: contactEmail || null,
    contactPhone: contactPhone || null,
    contactAddress: contactAddress || null,
    logoUrl,
    faviconUrl,
    ogImageUrl,
  };

  if (id) {
    await prisma.siteSettings.update({
      where: { id },
      data,
    });
  } else {
    await prisma.siteSettings.create({
      data,
    });
  }

  revalidatePath("/admin/site-settings");
  revalidatePath("/", "layout");
}

export async function saveBioAction(formData: FormData) {
  await requireAdminSession();
  
  const id = formData.get("id") as string;
  const sectionTitle = formData.get("sectionTitle") as string;
  const contentHtml = formData.get("contentHtml") as string;
  const yearsExperience = formData.get("yearsExperience") as string;
  const projectsCompleted = formData.get("projectsCompleted") as string;
  const clientsServed = formData.get("clientsServed") as string;
  const imageFile = formData.get("image") as File | null;
  const oldImageUrl = normalizeStoredMediaValue(
    String(formData.get("image_old") ?? ""),
  );

  let profileImageUrl = oldImageUrl;

  if (imageFile && imageFile.size > 0) {
    const uploadResult = await uploadImageFileToR2(imageFile, "biography");
    profileImageUrl = uploadResult.url ?? oldImageUrl;
    
    if (oldImageUrl) {
      await deleteImageFileFromR2(oldImageUrl);
    }
  }

  if (id) {
    await prisma.biography.update({
      where: { id },
      data: {
        sectionTitle,
        contentHtml,
        yearsExperience,
        projectsCompleted,
        clientsServed,
        profileImageUrl,
      },
    });
  } else {
     await prisma.biography.create({
        data: {
           sectionTitle,
           contentHtml,
           yearsExperience,
           projectsCompleted,
           clientsServed,
           profileImageUrl
        }
     });
  }

  revalidatePath("/admin/biography");
  revalidatePath("/", "layout");
}

export async function saveCtaAction(formData: FormData) {
  await requireAdminSession();

  const id = String(formData.get("id") ?? "");
  const headline = String(formData.get("headline") ?? "");
  const subheadline = String(formData.get("subheadline") ?? "");
  const buttonText = String(formData.get("buttonText") ?? "");
  const buttonUrl = String(formData.get("buttonUrl") ?? "");
  const buttonStyle = String(formData.get("buttonStyle") ?? "primary");

  const data = {
    headline,
    subheadline: subheadline || null,
    buttonText,
    buttonUrl,
    buttonStyle: buttonStyle || "primary",
  };

  if (id) {
    await prisma.ctaSection.update({
      where: { id },
      data,
    });
  } else {
    await prisma.ctaSection.create({
      data,
    });
  }

  revalidatePath("/admin/cta");
  revalidatePath("/", "layout");
}

export async function updateSeoMetadataAction(formData: FormData) {
  await requireAdminSession();
  
  const id = formData.get("id") as string;
  const metaTitle = formData.get("Meta Title") as string;
  const metaDescription = formData.get("Meta Description") as string;
  const ogTitle = formData.get("OG Title") as string;
  const ogDescription = formData.get("OG Description") as string;
  const canonicalUrl = formData.get("Canonical URL") as string;
  const ogImageUrl = formData.get("OG Image URL") as string;
  const indexPage = formData.get("Index Page") === "on";

  if (!id) {
    throw new Error("ID tidak ditemukan");
  }

  await prisma.seoMetadata.update({
    where: { id },
    data: {
      metaTitle,
      metaDescription,
      ogTitle,
      ogDescription,
      canonicalUrl,
      ogImageUrl,
      indexPage,
    },
  });

  revalidatePath("/admin/seo");
  revalidatePath("/", "layout");
}

export async function saveServiceAction(formData: FormData) {
  await requireAdminSession();

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageFile = formData.get("image") as File | null;
  const oldImageUrl = normalizeStoredMediaValue(
    String(formData.get("image_old") ?? ""),
  );

  if (!title) {
    throw new Error("Judul layanan wajib diisi.");
  }

  if (!description) {
    throw new Error("Deskripsi layanan wajib diisi.");
  }

  let thumbnailUrl = oldImageUrl;

  if (imageFile && imageFile.size > 0) {
    const uploadResult = await uploadImageFileToR2(imageFile, "service");
    thumbnailUrl = uploadResult.url ?? oldImageUrl;

    if (oldImageUrl && oldImageUrl !== thumbnailUrl) {
      await deleteImageFileFromR2(oldImageUrl);
    }
  }

  const data = {
    title,
    description,
    thumbnailUrl,
  };

  if (id) {
    await prisma.service.update({
      where: { id },
      data,
    });
  } else {
    await prisma.service.create({
      data,
    });
  }

  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function deleteServiceAction(id: string, oldImageUrl?: string | null) {
  await requireAdminSession();
  
  if (!id) throw new Error("ID required");

  // Jika service dihapus, kita hapus juga thumbnail-nya dari R2
  const normalizedOldImageUrl = normalizeStoredMediaValue(oldImageUrl);

  if (normalizedOldImageUrl) {
    await deleteImageFileFromR2(normalizedOldImageUrl);
  }

  await prisma.service.delete({
    where: { id },
  });

  revalidatePath("/admin/services");
  revalidatePath("/");
}

function slugifyPackageName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function slugifyText(value: string, maxLength = 120) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength);
}

function parseFeatureLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((feature) => feature.trim())
    .filter(Boolean);
}

export async function savePackagePlanAction(formData: FormData) {
  await requireAdminSession();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const priceLabel = String(formData.get("priceLabel") ?? "").trim();
  const priceAmount = Number(formData.get("priceAmount") ?? 0);
  const renewalLabel = String(formData.get("renewalLabel") ?? "").trim();
  const ctaLabel = String(formData.get("ctaLabel") ?? "").trim();
  const ctaUrl = String(formData.get("ctaUrl") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const isFeatured = formData.get("isFeatured") === "on";
  const featureLines = parseFeatureLines(String(formData.get("features") ?? ""));

  if (!name) {
    throw new Error("Nama paket wajib diisi.");
  }

  if (!summary) {
    throw new Error("Deskripsi paket wajib diisi.");
  }

  if (!priceLabel) {
    throw new Error("Label harga wajib diisi.");
  }

  if (!Number.isFinite(priceAmount) || priceAmount < 0) {
    throw new Error("Nominal harga tidak valid.");
  }

  if (featureLines.length === 0) {
    throw new Error("Tambahkan minimal satu detail paket.");
  }

  const slug = slugifyPackageName(slugInput || name);

  if (!slug) {
    throw new Error("Slug paket tidak valid.");
  }

  const data = {
    slug,
    name,
    summary,
    priceLabel,
    priceAmount,
    renewalLabel: renewalLabel || null,
    ctaLabel: ctaLabel || "Book Now",
    ctaUrl: ctaUrl || null,
    isFeatured,
    sortOrder,
    packageFeatures: {
      deleteMany: {},
      create: featureLines.map((featureText, index) => ({
        featureText,
        sortOrder: index,
      })),
    },
  };

  if (id) {
    await prisma.packagePlan.update({
      where: { id },
      data,
    });
  } else {
    await prisma.packagePlan.create({
      data,
    });
  }

  revalidatePath("/admin/packages");
  revalidatePath("/");
}

export async function deletePackagePlanAction(id: string) {
  await requireAdminSession();

  if (!id) {
    throw new Error("ID required");
  }

  await prisma.packagePlan.delete({
    where: { id },
  });

  revalidatePath("/admin/packages");
  revalidatePath("/");
}

export async function savePortfolioAction(formData: FormData) {
  await requireAdminSession();

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const contentHtml = String(formData.get("contentHtml") ?? "").trim();
  const projectUrl = String(formData.get("projectUrl") ?? "").trim();
  const clientName = String(formData.get("clientName") ?? "").trim();
  const projectCategoryName = String(formData.get("projectCategory") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const isFeatured = formData.get("isFeatured") === "on";
  const publishedAtInput = String(formData.get("publishedAt") ?? "").trim();
  const imageFile = formData.get("image") as File | null;
  const oldImageUrl = normalizeStoredMediaValue(
    String(formData.get("image_old") ?? ""),
  );

  if (!title) {
    throw new Error("Judul portfolio wajib diisi.");
  }

  if (!summary) {
    throw new Error("Ringkasan portfolio wajib diisi.");
  }

  const slug = slugifyText(slugInput || title, 120);

  if (!slug) {
    throw new Error("Slug portfolio tidak valid.");
  }

  let thumbnailUrl = oldImageUrl || null;

  if (imageFile && imageFile.size > 0) {
    const uploadResult = await uploadImageFileToR2(imageFile, "portfolio");
    thumbnailUrl = uploadResult.url ?? oldImageUrl;

    if (oldImageUrl && oldImageUrl !== thumbnailUrl) {
      await deleteImageFileFromR2(oldImageUrl);
    }
  }

  const publishedAt = publishedAtInput ? new Date(publishedAtInput) : null;

  let projectCategoryId = null;
  if (projectCategoryName) {
    let category = await prisma.projectCategory.findFirst({
      where: { name: { equals: projectCategoryName, mode: "insensitive" } },
    });

    if (!category) {
      category = await prisma.projectCategory.create({
        data: { name: projectCategoryName },
      });
    }
    projectCategoryId = category.id;
  }

  const data = {
    slug,
    title,
    summary,
    contentHtml: contentHtml || null,
    thumbnailUrl,
    projectUrl: projectUrl || null,
    clientName: clientName || null,
    projectCategoryId,
    sortOrder,
    isFeatured,
    publishedAt: publishedAt && !Number.isNaN(publishedAt.getTime()) ? publishedAt : null,
  };

  if (id) {
    await prisma.portfolio.update({
      where: { id },
      data,
    });
  } else {
    await prisma.portfolio.create({
      data,
    });
  }

  revalidatePath("/admin/portfolio");
  revalidatePath("/");
}

export async function deletePortfolioAction(id: string, oldImageUrl?: string | null) {
  await requireAdminSession();

  if (!id) {
    throw new Error("ID required");
  }

  const normalizedOldImageUrl = normalizeStoredMediaValue(oldImageUrl);

  if (normalizedOldImageUrl) {
    await deleteImageFileFromR2(normalizedOldImageUrl);
  }

  await prisma.portfolio.delete({
    where: { id },
  });

  revalidatePath("/admin/portfolio");
  revalidatePath("/");
}

export async function saveSocialProofAction(formData: FormData) {
  await requireAdminSession();

  const id = String(formData.get("id") ?? "");
  const clientName = String(formData.get("clientName") ?? "").trim();
  const clientTitle = String(formData.get("clientTitle") ?? "").trim();
  const clientCompany = String(formData.get("clientCompany") ?? "").trim();
  const projectCategory = String(formData.get("projectCategory") ?? "").trim();
  const testimonialText = String(formData.get("testimonialText") ?? "").trim();
  const rating = Number(formData.get("rating") ?? 5);
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const isFeatured = formData.get("isFeatured") === "on";
  
  const imageFile = formData.get("image") as File | null;
  const oldImageUrl = normalizeStoredMediaValue(
    String(formData.get("image_old") ?? ""),
  );

  let avatarUrl = oldImageUrl;

  if (imageFile && imageFile.size > 0) {
    const uploadResult = await uploadImageFileToR2(imageFile, "avatar");
    avatarUrl = uploadResult.url ?? oldImageUrl;

    if (oldImageUrl && oldImageUrl !== avatarUrl) {
      await deleteImageFileFromR2(oldImageUrl);
    }
  }

  const data = {
    clientName,
    clientTitle: clientTitle || null,
    clientCompany: clientCompany || null,
    projectCategory: projectCategory || null,
    testimonialText,
    rating,
    sortOrder,
    isFeatured,
    avatarUrl,
  };

  if (id) {
    await prisma.socialProof.update({
      where: { id },
      data,
    });
  } else {
    await prisma.socialProof.create({
      data,
    });
  }

  revalidatePath("/admin/proof");
  revalidatePath("/");
}

export async function deleteSocialProofAction(id: string, oldImageUrl?: string | null) {
  await requireAdminSession();
  
  if (!id) throw new Error("ID required");

  // Hapus foto klien dari R2 jika ada
  if (oldImageUrl) {
    await deleteImageFileFromR2(oldImageUrl);
  }

  await prisma.socialProof.delete({
    where: { id },
  });

  revalidatePath("/admin/proof");
  revalidatePath("/");
}
