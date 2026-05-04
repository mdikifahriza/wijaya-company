"use client";

import { useState } from "react";

import {
  AreaField,
  Field,
  ReadonlyField,
  ReadonlyImageField,
} from "@/app/admin/_components/admin-ui";
import { ImageUploader } from "@/app/admin/_components/image-uploader";
import { saveBioAction } from "@/app/admin/_lib/actions-admin";

type Biography = {
  id: string;
  sectionTitle: string;
  contentHtml: string;
  profileImageUrl: string | null;
  yearsExperience: string | null;
  projectsCompleted: string | null;
  clientsServed: string | null;
};

export function BioTableClient({ initialBio }: { initialBio: Biography[] }) {
  const bio = initialBio[0] ?? null;
  const [isEditing, setIsEditing] = useState(!bio);
  const handleSubmit = async (formData: FormData) => {
    await saveBioAction(formData);
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
          {isEditing ? "Batal Edit" : bio ? "Edit Biografi" : "Buat Biografi"}
        </button>
      </div>

      {isEditing ? (
        <form action={handleSubmit} className="space-y-6">
          <input type="hidden" name="id" value={bio?.id ?? ""} />

          <div className="space-y-5">
            <Field
              label="Judul Bagian"
              name="sectionTitle"
              defaultValue={bio?.sectionTitle}
            />
            <AreaField
              label="Konten HTML"
              name="contentHtml"
              defaultValue={bio?.contentHtml}
              rows={8}
            />
          </div>

          <div className="grid gap-5 border-t border-gray-200 pt-6 md:grid-cols-3">
            <Field
              label="Pengalaman"
              name="yearsExperience"
              defaultValue={bio?.yearsExperience}
            />
            <Field
              label="Proyek"
              name="projectsCompleted"
              defaultValue={bio?.projectsCompleted}
            />
            <Field
              label="Klien"
              name="clientsServed"
              defaultValue={bio?.clientsServed}
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <ImageUploader
              label="Foto Profil"
              name="image"
              defaultValue={bio?.profileImageUrl}
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
              Simpan Biografi
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            <ReadonlyField label="Judul Bagian" value={bio?.sectionTitle} />
            <ReadonlyField
              label="Pengalaman"
              value={bio?.yearsExperience}
            />
            <ReadonlyField
              label="Proyek"
              value={bio?.projectsCompleted}
            />
            <ReadonlyField label="Klien" value={bio?.clientsServed} />
          </div>

          <div className="grid gap-6 border-t border-gray-200 pt-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Konten Biografi
              </p>
              <div
                className="prose prose-sm mt-3 max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: bio?.contentHtml || "<p>Belum ada konten.</p>",
                }}
              />
            </div>

            <ReadonlyImageField
              label="Foto Profil"
              src={bio?.profileImageUrl}
              alt={bio?.sectionTitle ?? "Foto profil"}
              className="h-72 w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
