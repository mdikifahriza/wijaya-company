"use client";

import { useState } from "react";

import {
  AreaField,
  Field,
  ReadonlyField,
  ReadonlyImageField,
} from "@/app/admin/_components/admin-ui";
import { ImageUploader } from "@/app/admin/_components/image-uploader";
import { saveSiteSettingsAction } from "@/app/admin/_lib/actions-admin";

type SiteSettingsRecord = {
  id: string;
  siteName: string;
  tagline: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  tabTitle: string;
  metaDescription: string | null;
  ogImageUrl: string | null;
  primaryColor: string;
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
};

export function SiteSettingsClient({
  siteSettings,
}: {
  siteSettings: SiteSettingsRecord | null;
}) {
  const [isEditing, setIsEditing] = useState(!siteSettings);
  const handleSubmit = async (formData: FormData) => {
    await saveSiteSettingsAction(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsEditing((current) => !current)}
          className="inline-flex w-fit items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          {isEditing ? "Batal Edit" : siteSettings ? "Edit Pengaturan" : "Buat Pengaturan"}
        </button>
      </div>

      {isEditing ? (
        <form action={handleSubmit} className="space-y-8">
          <input type="hidden" name="id" value={siteSettings?.id ?? ""} />

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <Field
                label="Nama Situs"
                name="siteName"
                defaultValue={siteSettings?.siteName}
                placeholder="Contoh: My Company"
              />
              <Field
                label="Tagline"
                name="tagline"
                defaultValue={siteSettings?.tagline}
                placeholder="Contoh: We do awesome things"
              />
              <Field
                label="Warna Utama (Hex)"
                name="primaryColor"
                defaultValue={siteSettings?.primaryColor ?? "#69734f"}
                placeholder="#69734f"
              />
              <AreaField
                label="Alamat Kontak"
                name="contactAddress"
                defaultValue={siteSettings?.contactAddress}
              />
            </div>

            <div className="space-y-6">
              <Field
                label="Tab Title"
                name="tabTitle"
                defaultValue={siteSettings?.tabTitle}
                placeholder="Contoh: My Company - Awesome Things"
              />
              <AreaField
                label="Meta Description"
                name="metaDescription"
                defaultValue={siteSettings?.metaDescription}
              />
              <Field
                label="Email Kontak"
                name="contactEmail"
                defaultValue={siteSettings?.contactEmail}
                type="email"
                placeholder="halo@domain.com"
              />
              <Field
                label="Telepon Kontak"
                name="contactPhone"
                defaultValue={siteSettings?.contactPhone}
                placeholder="+62..."
              />
            </div>
          </div>

          <div className="grid gap-8 border-t border-[#dde3d3] pt-8 md:grid-cols-3">
            <ImageUploader label="Logo" name="logo" defaultValue={siteSettings?.logoUrl} />
            <ImageUploader
              label="Favicon"
              name="favicon"
              defaultValue={siteSettings?.faviconUrl}
              accept=".ico, image/x-icon, image/vnd.microsoft.icon"
            />
            <ImageUploader
              label="OG Image"
              name="ogImage"
              defaultValue={siteSettings?.ogImageUrl}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            <ReadonlyField label="Nama Situs" value={siteSettings?.siteName} />
            <ReadonlyField label="Tagline" value={siteSettings?.tagline} />
            <ReadonlyField label="Tab Title" value={siteSettings?.tabTitle} />
            <ReadonlyField label="Warna Utama" value={siteSettings?.primaryColor} mono />
            <ReadonlyField label="Email Kontak" value={siteSettings?.contactEmail} />
            <ReadonlyField label="Telepon Kontak" value={siteSettings?.contactPhone} />
          </div>

          <ReadonlyField label="Alamat Kontak" value={siteSettings?.contactAddress} />
          <ReadonlyField
            label="Meta Description"
            value={siteSettings?.metaDescription}
          />

          <div className="grid gap-4 border-t border-gray-200 pt-8 md:grid-cols-3">
            <ReadonlyImageField
              label="Logo"
              src={siteSettings?.logoUrl}
              alt={siteSettings?.siteName ?? "Logo situs"}
              className="h-40 w-full"
            />
            <ReadonlyImageField
              label="Favicon"
              src={siteSettings?.faviconUrl}
              alt="Favicon situs"
              className="h-40 w-full object-contain p-6"
            />
            <ReadonlyImageField
              label="OG Image"
              src={siteSettings?.ogImageUrl}
              alt="OG image situs"
              className="h-40 w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
