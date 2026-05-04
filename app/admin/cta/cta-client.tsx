"use client";

import { useState } from "react";

import {
  AreaField,
  Field,
  ReadonlyField,
} from "@/app/admin/_components/admin-ui";
import { saveCtaAction } from "@/app/admin/_lib/actions-admin";

type CTA = {
  id: string;
  headline: string;
  subheadline: string | null;
  buttonText: string;
  buttonUrl: string;
  buttonStyle: string;
};

export function CtaTableClient({ initialCta }: { initialCta: CTA[] }) {
  const cta = initialCta[0] ?? null;
  const [isEditing, setIsEditing] = useState(!cta);
  const handleSubmit = async (formData: FormData) => {
    await saveCtaAction(formData);
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
          {isEditing ? "Batal Edit" : cta ? "Edit CTA" : "Buat CTA"}
        </button>
      </div>

      {isEditing ? (
        <form action={handleSubmit} className="space-y-6">
          <input type="hidden" name="id" value={cta?.id ?? ""} />

          <div className="space-y-5">
            <Field label="Headline" name="headline" defaultValue={cta?.headline} />
            <AreaField
              label="Subheadline"
              name="subheadline"
              defaultValue={cta?.subheadline}
              rows={4}
            />
          </div>

          <div className="grid gap-5 border-t border-gray-200 pt-6 md:grid-cols-2">
            <div className="space-y-5">
              <Field
                label="Teks Tombol"
                name="buttonText"
                defaultValue={cta?.buttonText}
              />
              <Field
                label="Gaya Tombol"
                name="buttonStyle"
                defaultValue={cta?.buttonStyle}
                placeholder="primary / secondary"
              />
            </div>
            <div className="space-y-5">
              <Field
                label="URL Tombol"
                name="buttonUrl"
                defaultValue={cta?.buttonUrl}
              />
            </div>
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
              Simpan CTA
            </button>
          </div>
        </form>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <ReadonlyField label="Headline" value={cta?.headline} />
          <ReadonlyField label="Subheadline" value={cta?.subheadline} />
          <ReadonlyField label="Teks Tombol" value={cta?.buttonText} />
          <ReadonlyField label="URL Tombol" value={cta?.buttonUrl} mono />
          <ReadonlyField label="Gaya Tombol" value={cta?.buttonStyle} />
        </div>
      )}
    </div>
  );
}
