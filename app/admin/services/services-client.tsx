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
} from "@/app/admin/_components/admin-ui";
import { ImageUploader } from "@/app/admin/_components/image-uploader";
import {
  deleteServiceAction,
  saveServiceAction,
} from "@/app/admin/_lib/actions-admin";
import { resolveMediaUrl } from "@/lib/media-url";

type ServiceFeature = {
  id: string;
  featureText: string;
  sortOrder: number;
};

type Service = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  serviceFeatures?: ServiceFeature[];
};

function formatDate(value?: Date | string) {
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

export function ServicesTableClient({
  initialServices,
}: {
  initialServices: Service[];
}) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<Service | null>(null);
  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [isPending, startTransition] = useTransition();

  const sortedServices = useMemo(
    () =>
      [...initialServices].sort((left, right) => {
        const leftDate = new Date(left.updatedAt ?? left.createdAt ?? 0).getTime();
        const rightDate = new Date(right.updatedAt ?? right.createdAt ?? 0).getTime();

        return rightDate - leftDate;
      }),
    [initialServices],
  );

  const handleAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleView = (item: Service) => {
    setViewingItem(item);
  };

  const handleEdit = (item: Service) => {
    setViewingItem(null);
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: Service) => {
    const confirmed = window.confirm(`Hapus layanan "${item.title}"?`);

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await deleteServiceAction(item.id, item.thumbnailUrl);
      router.refresh();
    });
  };

  const handleSubmit = async (formData: FormData) => {
    await saveServiceAction(formData);
    setIsFormOpen(false);
    setEditingItem(null);
    router.refresh();
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
          Tambah Layanan
        </button>
      </div>

      {sortedServices.length === 0 ? (
        <EmptyState message="Belum ada layanan." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sortedServices.map((service) => {
            const imageUrl = resolveMediaUrl(service.thumbnailUrl);

            return (
              <article
                key={service.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-44 bg-gray-100">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      Belum ada gambar
                    </div>
                  )}
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <h3 className="line-clamp-2 text-lg font-semibold text-gray-800">
                      {service.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500">
                      {service.description}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500">
                    Terakhir diubah: {formatDate(service.updatedAt ?? service.createdAt)}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleView(service)}
                      className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(service)}
                      className="inline-flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(service)}
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
        title={editingItem ? "Edit Layanan" : "Tambah Layanan"}
      >
        <form action={handleSubmit} className="space-y-6">
          <input type="hidden" name="id" value={editingItem?.id ?? ""} />

          <div className="space-y-5">
            <Field
              label="Title"
              name="title"
              defaultValue={editingItem?.title}
            />
            <AreaField
              label="Description"
              name="description"
              defaultValue={editingItem?.description}
              rows={5}
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <ImageUploader
              label="Image"
              name="image"
              defaultValue={editingItem?.thumbnailUrl}
            />
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
        title="Detail Layanan"
      >
        <div className="space-y-6">
          <ReadonlyField label="Title" value={viewingItem?.title} />
          <ReadonlyField label="Description" value={viewingItem?.description} />
          <ReadonlyField
            label="Dibuat"
            value={formatDate(viewingItem?.createdAt)}
          />
          <ReadonlyField
            label="Diubah"
            value={formatDate(viewingItem?.updatedAt)}
          />
          <ReadonlyImageField
            label="Image"
            src={viewingItem?.thumbnailUrl}
            alt={viewingItem?.title ?? "Layanan"}
            className="h-64 w-full"
          />

          {(viewingItem?.serviceFeatures?.length ?? 0) > 0 ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Termasuk
              </p>
              <ul className="mt-3 space-y-2">
                {viewingItem?.serviceFeatures
                  ?.slice()
                  .sort((left, right) => left.sortOrder - right.sortOrder)
                  .map((feature) => (
                    <li
                      key={feature.id}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <i className="bi bi-check-circle-fill mt-0.5 text-emerald-500"></i>
                      <span>{feature.featureText}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}

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
