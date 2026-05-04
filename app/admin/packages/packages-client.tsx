"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Modal } from "@/app/admin/_components/modal";
import {
  AreaField,
  EmptyState,
  Field,
  ReadonlyField,
  ToggleField,
} from "@/app/admin/_components/admin-ui";
import {
  deletePackagePlanAction,
  savePackagePlanAction,
} from "@/app/admin/_lib/actions-admin";

type PackageFeature = {
  id: string;
  featureText: string;
  sortOrder: number;
};

type PackagePlan = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  priceLabel: string;
  priceAmount: number;
  renewalLabel: string | null;
  ctaLabel: string;
  ctaUrl: string | null;
  isFeatured: boolean;
  sortOrder: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  packageFeatures?: PackageFeature[];
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

function featureLinesFromPackage(item?: PackagePlan | null) {
  return (item?.packageFeatures ?? [])
    .slice()
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((feature) => feature.featureText)
    .join("\n");
}

function formatCompactPrice(value: string) {
  return value
    .replace(/\bIDR\b/gi, "Rp")
    .replace(/\bJUTA\b/gi, "jt");
}

export function PackagesTableClient({
  initialPackages,
}: {
  initialPackages: PackagePlan[];
}) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<PackagePlan | null>(null);
  const [editingItem, setEditingItem] = useState<PackagePlan | null>(null);
  const [isPending, startTransition] = useTransition();

  const sortedPackages = useMemo(
    () =>
      [...initialPackages].sort((left, right) => {
        if (left.sortOrder !== right.sortOrder) {
          return left.sortOrder - right.sortOrder;
        }

        return left.priceAmount - right.priceAmount;
      }),
    [initialPackages],
  );

  const handleAdd = () => {
    setViewingItem(null);
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleView = (item: PackagePlan) => {
    setViewingItem(item);
  };

  const handleEdit = (item: PackagePlan) => {
    setViewingItem(null);
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: PackagePlan) => {
    const confirmed = window.confirm(`Hapus paket "${item.name}"?`);

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await deletePackagePlanAction(item.id);
      router.refresh();
    });
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      await savePackagePlanAction(formData);
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
          Tambah Paket
        </button>
      </div>

      {sortedPackages.length === 0 ? (
        <EmptyState message="Belum ada paket website." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sortedPackages.map((item) => (
            <article
              key={item.id}
              className={`overflow-hidden rounded-2xl border shadow-sm transition hover:shadow-md ${
                item.isFeatured
                  ? "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="space-y-5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      {item.isFeatured ? (
                        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-700">
                          Unggulan
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gray-400">
                      /{item.slug}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-900 px-3 py-2 text-right text-white">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">Harga</p>
                    <p className="text-sm font-semibold">{formatCompactPrice(item.priceLabel)}</p>
                  </div>
                </div>

                <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
                  {item.summary}
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
                  <div className="rounded-xl border border-gray-200 px-3 py-3">
                    Urutan tampil: <span className="font-semibold text-gray-700">{item.sortOrder}</span>
                  </div>
                  <div className="rounded-xl border border-gray-200 px-3 py-3">
                    CTA: <span className="font-semibold text-gray-700">{item.ctaLabel}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500">
                  Terakhir diubah: {formatDate(item.updatedAt ?? item.createdAt)}
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
          ))}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        title={editingItem ? "Edit Paket" : "Tambah Paket"}
      >
        <form action={handleSubmit} className="space-y-6">
          <input type="hidden" name="id" value={editingItem?.id ?? ""} />

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Nama Paket" name="name" defaultValue={editingItem?.name} />
            <Field label="Slug" name="slug" defaultValue={editingItem?.slug} placeholder="paket-gold" />
            <Field label="Label Harga" name="priceLabel" defaultValue={editingItem?.priceLabel} placeholder="IDR 1,6 JUTA" />
            <Field
              label="Nominal Harga"
              name="priceAmount"
              type="number"
              defaultValue={editingItem?.priceAmount ?? 0}
            />
            <Field label="CTA Label" name="ctaLabel" defaultValue={editingItem?.ctaLabel ?? "Book Now"} />
            <Field label="CTA URL" name="ctaUrl" defaultValue={editingItem?.ctaUrl} placeholder="https://wa.me/..." />
            <Field
              label="Urutan Tampil"
              name="sortOrder"
              type="number"
              defaultValue={editingItem?.sortOrder ?? 0}
            />
            <Field
              label="Catatan Perpanjangan"
              name="renewalLabel"
              defaultValue={editingItem?.renewalLabel}
              placeholder="Perpanjangan 500rb/tahun"
            />
          </div>

          <AreaField
            label="Ringkasan Paket"
            name="summary"
            defaultValue={editingItem?.summary}
            rows={4}
          />

          <AreaField
            label="Detail Paket"
            name="features"
            defaultValue={featureLinesFromPackage(editingItem)}
            rows={7}
            placeholder={"Satu baris untuk satu fitur\nGratis domain .com\nHosting 3 GB"}
          />

          <div className="flex gap-6 border-t border-gray-200 pt-5">
            <ToggleField
              label="Tandai sebagai paket unggulan"
              name="isFeatured"
              defaultChecked={editingItem?.isFeatured ?? false}
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
        title="Detail Paket"
      >
        <div className="space-y-6">
          <ReadonlyField label="Nama Paket" value={viewingItem?.name} />
          <ReadonlyField label="Slug" value={viewingItem?.slug} mono />
          <ReadonlyField label="Ringkasan" value={viewingItem?.summary} />
          <ReadonlyField label="Label Harga" value={formatCompactPrice(viewingItem?.priceLabel ?? "")} />
          <ReadonlyField label="Nominal Harga" value={viewingItem?.priceAmount?.toLocaleString("id-ID")} />
          <ReadonlyField label="CTA Label" value={viewingItem?.ctaLabel} />
          <ReadonlyField label="CTA URL" value={viewingItem?.ctaUrl} mono />
          <ReadonlyField label="Perpanjangan" value={viewingItem?.renewalLabel} />
          <ReadonlyField label="Paket Unggulan" value={viewingItem?.isFeatured ? "Ya" : "Tidak"} />
          <ReadonlyField label="Urutan Tampil" value={viewingItem?.sortOrder} />
          <ReadonlyField label="Diubah" value={formatDate(viewingItem?.updatedAt)} />

          {(viewingItem?.packageFeatures?.length ?? 0) > 0 ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Detail Paket
              </p>
              <ul className="mt-3 space-y-2">
                {viewingItem?.packageFeatures
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
