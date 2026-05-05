"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Modal } from "@/app/admin/_components/modal";
import {
  EmptyState,
  Field,
  ReadonlyField,
  ReadonlyImageField,
  ToggleField,
} from "@/app/admin/_components/admin-ui";
import { ImageUploader } from "@/app/admin/_components/image-uploader";
import {
  deletePaymentPartnerAction,
  savePaymentPartnerAction,
} from "@/app/admin/_lib/actions-admin";
import { resolveMediaUrl } from "@/lib/media-url";

type PaymentPartner = {
  id: string;
  name: string;
  logoUrl: string;
  linkUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
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

export function PaymentPartnersTableClient({
  initialPartners,
}: {
  initialPartners: PaymentPartner[];
}) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PaymentPartner | null>(null);
  const [viewingItem, setViewingItem] = useState<PaymentPartner | null>(null);
  const [isPending, startTransition] = useTransition();

  const sortedPartners = useMemo(
    () =>
      [...initialPartners].sort((left, right) => {
        if (left.sortOrder !== right.sortOrder) {
          return left.sortOrder - right.sortOrder;
        }

        const leftDate = new Date(left.updatedAt ?? left.createdAt ?? 0).getTime();
        const rightDate = new Date(right.updatedAt ?? right.createdAt ?? 0).getTime();

        return rightDate - leftDate;
      }),
    [initialPartners],
  );

  const handleAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: PaymentPartner) => {
    setViewingItem(null);
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: PaymentPartner) => {
    const confirmed = window.confirm(`Hapus payment partner "${item.name}"?`);

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await deletePaymentPartnerAction(item.id, item.logoUrl);
      router.refresh();
    });
  };

  const handleSubmit = async (formData: FormData) => {
    await savePaymentPartnerAction(formData);
    setEditingItem(null);
    setIsFormOpen(false);
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
          Tambah Partner
        </button>
      </div>

      {sortedPartners.length === 0 ? (
        <EmptyState message="Belum ada payment partner." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sortedPartners.map((partner) => {
            const logoUrl = resolveMediaUrl(partner.logoUrl);

            return (
              <article
                key={partner.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="space-y-4 p-5">
                  <div className="relative flex h-24 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-3">
                    {logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={logoUrl}
                        alt={partner.name}
                        className="max-h-14 w-full object-contain"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-gray-400">
                        Belum ada logo
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {partner.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Urutan: {partner.sortOrder}
                    </p>
                    <p
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                        partner.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {partner.isActive ? "Aktif" : "Nonaktif"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500">
                    Terakhir diubah: {formatDate(partner.updatedAt ?? partner.createdAt)}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setViewingItem(partner)}
                      className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(partner)}
                      className="inline-flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(partner)}
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
        title={editingItem ? "Edit Payment Partner" : "Tambah Payment Partner"}
      >
        <form action={handleSubmit} className="space-y-6">
          <input type="hidden" name="id" value={editingItem?.id ?? ""} />

          <div className="grid gap-5">
            <Field
              label="Nama Partner"
              name="name"
              defaultValue={editingItem?.name}
              placeholder="Contoh: BCA"
            />
            <Field
              label="Link URL (opsional)"
              name="linkUrl"
              defaultValue={editingItem?.linkUrl}
              placeholder="https://..."
            />
            <Field
              label="Urutan"
              name="sortOrder"
              type="number"
              defaultValue={editingItem?.sortOrder ?? 0}
            />
            <ToggleField
              label="Tampilkan di beranda"
              name="isActive"
              defaultChecked={editingItem?.isActive ?? true}
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <ImageUploader
              label="Logo Partner"
              name="image"
              defaultValue={editingItem?.logoUrl}
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
        title="Detail Payment Partner"
      >
        <div className="space-y-6">
          <ReadonlyField label="Nama Partner" value={viewingItem?.name} />
          <ReadonlyField label="Link URL" value={viewingItem?.linkUrl} mono />
          <ReadonlyField
            label="Urutan"
            value={typeof viewingItem?.sortOrder === "number" ? viewingItem.sortOrder : null}
          />
          <ReadonlyField
            label="Status"
            value={viewingItem?.isActive ? "Aktif" : "Nonaktif"}
          />
          <ReadonlyField
            label="Dibuat"
            value={formatDate(viewingItem?.createdAt)}
          />
          <ReadonlyField
            label="Diubah"
            value={formatDate(viewingItem?.updatedAt)}
          />
          <ReadonlyImageField
            label="Logo"
            src={viewingItem?.logoUrl}
            alt={viewingItem?.name ?? "Payment Partner"}
            className="h-40 w-full"
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
