"use client";

import { useState } from "react";

import {
  AreaField,
  Field,
  ReadonlyField,
  ReadonlyImageField,
} from "@/app/admin/_components/admin-ui";
import { ImageUploader } from "@/app/admin/_components/image-uploader";
import { saveHeroAction } from "@/app/admin/_lib/actions-admin";

type HeroSection = {
  id: string;
  headline: string;
  subheadline: string | null;
  animatedTexts: string[];
  imageUrl: string | null;
  ctaPrimaryText: string | null;
  ctaPrimaryUrl: string | null;
  ctaSecondaryText: string | null;
  ctaSecondaryUrl: string | null;
};

export function HeroTableClient({ initialHero }: { initialHero: HeroSection[] }) {
  const hero = initialHero[0] ?? null;
  const [isEditing, setIsEditing] = useState(!hero);
  const handleSubmit = async (formData: FormData) => {
    await saveHeroAction(formData);
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
          {isEditing ? "Batal Edit" : hero ? "Edit Hero" : "Buat Hero"}
        </button>
      </div>

      {isEditing ? (
        <form action={handleSubmit} className="space-y-6">
          <input type="hidden" name="id" value={hero?.id ?? ""} />

          <div className="space-y-5">
            <Field label="Headline" name="headline" defaultValue={hero?.headline} />
            <Field
              label="Subheadline"
              name="subheadline"
              defaultValue={hero?.subheadline}
              placeholder="Teks pembuka sebelum animasi"
            />
            <AreaField
              label="Animated Texts"
              name="animatedTexts"
              defaultValue={hero?.animatedTexts.join("\n")}
              placeholder={"Saya adalah seorang developer\nSaya membangun website modern\nSaya membantu bisnis tampil profesional"}
              rows={5}
            />
          </div>

          <div className="grid gap-5 border-t border-gray-200 pt-6 md:grid-cols-2">
            <div className="space-y-5">
              <Field
                label="Teks Tombol Utama"
                name="ctaPrimaryText"
                defaultValue={hero?.ctaPrimaryText}
              />
              <Field
                label="URL Tombol Utama"
                name="ctaPrimaryUrl"
                defaultValue={hero?.ctaPrimaryUrl}
              />
            </div>
            <div className="space-y-5">
              <Field
                label="Teks Tombol Sekunder"
                name="ctaSecondaryText"
                defaultValue={hero?.ctaSecondaryText}
              />
              <Field
                label="URL Tombol Sekunder"
                name="ctaSecondaryUrl"
                defaultValue={hero?.ctaSecondaryUrl}
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <ImageUploader
              label="Background Hero"
              name="image"
              defaultValue={hero?.imageUrl}
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
              Simpan Hero
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            <ReadonlyField label="Headline" value={hero?.headline} />
            <ReadonlyField label="Subheadline" value={hero?.subheadline} />
            <ReadonlyField
              label="Animated Texts"
              value={hero?.animatedTexts?.length ? hero.animatedTexts.join(" | ") : ""}
            />
            <ReadonlyField label="CTA Utama" value={hero?.ctaPrimaryText} />
            <ReadonlyField label="URL CTA Utama" value={hero?.ctaPrimaryUrl} mono />
            <ReadonlyField label="CTA Sekunder" value={hero?.ctaSecondaryText} />
            <ReadonlyField label="URL CTA Sekunder" value={hero?.ctaSecondaryUrl} mono />
          </div>

          <div className="border-t border-gray-200 pt-8">
            <ReadonlyImageField
              label="Background Hero"
              src={hero?.imageUrl}
              alt={hero?.headline ?? "Hero"}
              className="h-56 w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
