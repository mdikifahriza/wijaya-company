"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Modal } from "@/app/admin/_components/modal";
import {
  AreaField,
  EmptyState,
  Field,
  ReadonlyField,
  ReadonlyImageField,
  ToggleField,
} from "@/app/admin/_components/admin-ui";
import { ImageUploader } from "@/app/admin/_components/image-uploader";
import {
  deletePortfolioAction,
  savePortfolioAction,
} from "@/app/admin/_lib/actions-admin";
import { resolveMediaUrl } from "@/lib/media-url";

type Portfolio = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  contentHtml: string | null;
  thumbnailUrl: string | null;
  projectUrl: string | null;
  clientName: string | null;
  projectCategory: { id: string; name: string } | null;
  sortOrder: number;
  isFeatured: boolean;
  publishedAt?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

function formatDate(value?: Date | string | null) {
  if (!value) {
    return "Belum tersedia";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Belum tersedia";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function formatDateInput(value?: Date | string | null) {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export function PortfolioTableClient({
  initialPortfolios,
}: {
  initialPortfolios: Portfolio[];
}) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<Portfolio | null>(null);
  const [editingItem, setEditingItem] = useState<Portfolio | null>(null);
  const [isPending, startTransition] = useTransition();

  const sortedPortfolios = useMemo(
    () =>
      [...initialPortfolios].sort((left, right) => {
        if (left.sortOrder !== right.sortOrder) {
          return left.sortOrder - right.sortOrder;
        }

        const leftDate = new Date(left.publishedAt ?? left.updatedAt ?? 0).getTime();
        const rightDate = new Date(right.publishedAt ?? right.updatedAt ?? 0).getTime();
        return rightDate - leftDate;
      }),
    [initialPortfolios],
  );

  const handleAdd = () => {
    setViewingItem(null);
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleView = (item: Portfolio) => {
    setViewingItem(item);
  };

  const handleEdit = (item: Portfolio) => {
    setViewingItem(null);
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: Portfolio) => {
    const confirmed = window.confirm(`Hapus referensi web "${item.title}"?`);

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await deletePortfolioAction(item.id, item.thumbnailUrl);
      router.refresh();
    });
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      await savePortfolioAction(formData);
      setIsFormOpen(false);
      setEditingItem(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <i className="bi bi-plus-lg mr-2"></i>
          Tambah Referensi Web
        </button>
      </div>

      {sortedPortfolios.length === 0 ? (
        <EmptyState message="Belum ada referensi web." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sortedPortfolios.map((item) => {
            const imageUrl = resolveMediaUrl(item.thumbnailUrl);

            return (
              <article
                key={item.id}
                className={`overflow-hidden rounded-2xl border shadow-sm transition hover:shadow-md ${
                  item.isFeatured
                    ? "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="relative h-44 bg-gray-100">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      Belum ada gambar
                    </div>
                  )}
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="line-clamp-2 text-lg font-semibold text-gray-800">
                          {item.title}
                        </h3>
                        {item.isFeatured ? (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                            Unggulan
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gray-400">
                        /{item.slug}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-900 px-3 py-2 text-right text-white">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">Urutan</p>
                      <p className="text-sm font-semibold">{item.sortOrder}</p>
                    </div>
                  </div>

                  <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
                    {item.summary}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
                    <div className="rounded-xl border border-gray-200 px-3 py-3">
                      Client: <span className="font-semibold text-gray-700">{item.clientName ?? "-"}</span>
                    </div>
                    <div className="rounded-xl border border-gray-200 px-3 py-3">
                      Kategori: <span className="font-semibold text-gray-700">{item.projectCategory?.name ?? "-"}</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500">
                    Publikasi: {formatDate(item.publishedAt ?? item.updatedAt)}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleView(item)}
                      className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="inline-flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={isPending}
                      className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        title={editingItem ? "Edit Referensi Web" : "Tambah Referensi Web"}
      >
        <form action={handleSubmit} className="space-y-6">
          <input type="hidden" name="id" value={editingItem?.id ?? ""} />

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Judul" name="title" defaultValue={editingItem?.title} />
            <Field label="Slug" name="slug" defaultValue={editingItem?.slug} placeholder="project-sample" />
            <Field label="Client" name="clientName" defaultValue={editingItem?.clientName} />
            <Field label="Kategori" name="projectCategory" defaultValue={editingItem?.projectCategory?.name} />
            <Field label="Link Proyek" name="projectUrl" defaultValue={editingItem?.projectUrl} placeholder="https://..." />
            <Field
              label="Urutan"
              name="sortOrder"
              type="number"
              defaultValue={editingItem?.sortOrder ?? 0}
            />
            <Field
              label="Tanggal Publikasi"
              name="publishedAt"
              type="date"
              defaultValue={formatDateInput(editingItem?.publishedAt)}
            />
          </div>

          <AreaField
            label="Ringkasan"
            name="summary"
            defaultValue={editingItem?.summary}
            rows={4}
          />

          <AreaField
            label="Detail HTML"
            name="contentHtml"
            defaultValue={editingItem?.contentHtml}
            rows={6}
            placeholder="<p>Detail project...</p>"
          />

          <div className="flex gap-6 border-t border-gray-200 pt-5">
            <ToggleField
              label="Tandai sebagai unggulan"
              name="isFeatured"
              defaultChecked={editingItem?.isFeatured ?? false}
            />
          </div>

          <div className="border-t border-gray-200 pt-5">
            <ImageUploader label="Gambar Referensi" name="image" defaultValue={editingItem?.thumbnailUrl} />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                setEditingItem(null);
              }}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(viewingItem)}
        onClose={() => setViewingItem(null)}
        title="Detail Referensi Web"
      >
        <div className="space-y-6">
          <ReadonlyField label="Judul" value={viewingItem?.title} />
          <ReadonlyField label="Slug" value={viewingItem?.slug} mono />
          <ReadonlyField label="Ringkasan" value={viewingItem?.summary} />
          <ReadonlyField label="Client" value={viewingItem?.clientName} />
          <ReadonlyField label="Kategori" value={viewingItem?.projectCategory?.name} />
          <ReadonlyField label="Link Proyek" value={viewingItem?.projectUrl} mono />
          <ReadonlyField label="Unggulan" value={viewingItem?.isFeatured ? "Ya" : "Tidak"} />
          <ReadonlyField label="Urutan" value={viewingItem?.sortOrder} />
          <ReadonlyField label="Publikasi" value={formatDate(viewingItem?.publishedAt)} />
          <ReadonlyField label="Detail HTML" value={viewingItem?.contentHtml} />
          <ReadonlyImageField
            label="Gambar"
            src={viewingItem?.thumbnailUrl}
            alt={viewingItem?.title ?? "Referensi Web"}
            className="h-64 w-full"
          />

          <div className="flex justify-end border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => setViewingItem(null)}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Tutup
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
