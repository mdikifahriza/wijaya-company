"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Table, TableRow, TableCell } from "@/app/admin/_components/table";
import { Modal } from "@/app/admin/_components/modal";
import { Field, AreaField, ToggleField } from "@/app/admin/_components/admin-ui";
import { ImageUploader } from "@/app/admin/_components/image-uploader";
import { saveSocialProofAction, deleteSocialProofAction } from "@/app/admin/_lib/actions-admin";

type SocialProof = {
  id: string;
  clientName: string;
  clientTitle: string | null;
  clientCompany: string | null;
  testimonialText: string;
  rating: number;
  avatarUrl: string | null;
  projectCategory: string | null;
  sortOrder: number;
  isFeatured: boolean;
};

export function ProofTableClient({ initialProof }: { initialProof: SocialProof[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SocialProof | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: SocialProof) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item: SocialProof) => {
    const confirmed = window.confirm(`Hapus testimoni dari "${item.clientName}"?`);
    if (!confirmed) return;

    startTransition(async () => {
      await deleteSocialProofAction(item.id, item.avatarUrl);
      router.refresh();
    });
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      await saveSocialProofAction(formData);
      setIsModalOpen(false);
      setEditingItem(null);
      router.refresh();
    });
  };

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <i className="bi bi-plus-lg mr-2"></i>
          Tambah Testimoni
        </button>
      </div>

      <Table headers={["Klien", "Rating", "Urutan", "Aksi"]}>
        {initialProof.map((proof) => (
          <TableRow key={proof.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                {proof.avatarUrl ? (
                  <img src={proof.avatarUrl} alt={proof.clientName} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                    {proof.clientName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-800">{proof.clientName}</p>
                  <p className="text-xs text-gray-500">
                    {proof.clientTitle} {proof.clientCompany ? `@ ${proof.clientCompany}` : ""}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <i key={`${proof.id}-${i}`} className={`bi ${i < proof.rating ? 'bi-star-fill' : 'bi-star'} text-sm`}></i>
                ))}
              </div>
            </TableCell>
            <TableCell>{proof.sortOrder}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(proof)} className="rounded p-1.5 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition">
                  <i className="bi bi-pencil"></i>
                </button>
                <button onClick={() => handleDelete(proof)} className="rounded p-1.5 text-red-700 hover:bg-red-50 hover:text-red-800 transition">
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Edit Testimoni" : "Tambah Testimoni"}
      >
        <form action={handleSubmit} className="space-y-5">
          <input type="hidden" name="id" value={editingItem?.id ?? ""} />
          <div className="grid grid-cols-2 gap-5">
            <Field label="Client Name" name="clientName" defaultValue={editingItem?.clientName} />
            <Field label="Job Title" name="clientTitle" defaultValue={editingItem?.clientTitle} />
            <Field label="Company" name="clientCompany" defaultValue={editingItem?.clientCompany} />
            <Field label="Project Category" name="projectCategory" defaultValue={editingItem?.projectCategory} />
          </div>
          
          <AreaField label="Testimonial Text" name="testimonialText" defaultValue={editingItem?.testimonialText} rows={4} />
          
          <div className="grid grid-cols-2 gap-5 border-t border-gray-200 pt-5">
            <Field label="Rating (1-5)" name="rating" type="number" defaultValue={editingItem?.rating ?? 5} />
            <Field label="Display Order" name="sortOrder" type="number" defaultValue={editingItem?.sortOrder ?? 0} />
          </div>

          <div className="flex gap-6 border-t border-gray-200 pt-5">
            <ToggleField label="Featured Testimonial" name="isFeatured" defaultChecked={editingItem?.isFeatured ?? false} />
          </div>
          
          <div className="border-t border-gray-200 pt-5">
            <ImageUploader label="Client Photo" name="image" defaultValue={editingItem?.avatarUrl} />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
