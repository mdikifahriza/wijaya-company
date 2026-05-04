"use client";

import { useState } from "react";
import { Table, TableRow, TableCell } from "@/app/admin/_components/table";
import { Modal } from "@/app/admin/_components/modal";
import { Field, AreaField, ToggleField } from "@/app/admin/_components/admin-ui";

type SeoMeta = {
  id: string;
  pageSlug: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageUrl: string | null;
  canonicalUrl: string | null;
  indexPage: boolean;
};

export function SeoTableClient({ initialSeo }: { initialSeo: SeoMeta[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SeoMeta | null>(null);

  const handleEdit = (item: SeoMeta) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <>
      <Table headers={["Slug Halaman", "Meta Title", "Index", "Aksi"]}>
        {initialSeo.map((seo) => (
          <TableRow key={seo.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <i className="bi bi-file-earmark-code text-lg"></i>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{seo.pageSlug}</p>
                  <p className="text-xs text-gray-500 font-mono">{seo.canonicalUrl || `/${seo.pageSlug}`}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
               <p className="max-w-[250px] truncate text-sm font-medium text-gray-800">{seo.metaTitle}</p>
            </TableCell>
            <TableCell>
              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${seo.indexPage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {seo.indexPage ? 'Indexed' : 'NoIndex'}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(seo)} className="rounded p-1.5 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition">
                  <i className="bi bi-pencil"></i> Edit
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Edit SEO: ${editingItem?.pageSlug}`}
      >
        <form className="space-y-5">
          <input type="hidden" name="id" value={editingItem?.id || ""} />
          
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-5">
              <Field label="Meta Title" defaultValue={editingItem?.metaTitle} />
              <AreaField label="Meta Description" defaultValue={editingItem?.metaDescription} rows={5} />
            </div>
            <div className="space-y-5">
              <Field label="OG Title" defaultValue={editingItem?.ogTitle} />
              <AreaField label="OG Description" defaultValue={editingItem?.ogDescription} rows={5} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-5 border-t border-gray-200 pt-5">
             <Field label="OG Image URL" defaultValue={editingItem?.ogImageUrl} />
             <Field label="Canonical URL" defaultValue={editingItem?.canonicalUrl} />
          </div>

          <div className="flex gap-6 border-t border-gray-200 pt-5">
            <ToggleField label="Allow Search Engine Indexing (Index Page)" defaultChecked={editingItem?.indexPage ?? true} />
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
              onClick={() => setIsModalOpen(false)}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
