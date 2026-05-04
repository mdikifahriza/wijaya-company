"use client";

import { useState } from "react";
import { Table, TableRow, TableCell } from "@/app/admin/_components/table";
import { Modal } from "@/app/admin/_components/modal";
import { Field } from "@/app/admin/_components/admin-ui";

type FooterLink = {
  id: string;
  label: string;
  url: string;
  isExternal: boolean;
  sortOrder: number;
};

type FooterColumn = {
  id: string;
  columnTitle: string;
  sortOrder: number;
  footerLinks: FooterLink[];
};

export function FooterTableClient({ initialColumns }: { initialColumns: FooterColumn[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FooterColumn | null>(null);

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: FooterColumn) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <i className="bi bi-plus-lg mr-2"></i>
          Tambah Kolom
        </button>
      </div>

      <Table headers={["Nama Kolom", "Jumlah Tautan", "Urutan", "Aksi"]}>
        {initialColumns.map((column) => (
          <TableRow key={column.id}>
            <TableCell>
              <span className="font-semibold text-gray-800">{column.columnTitle}</span>
            </TableCell>
            <TableCell>
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                {column.footerLinks.length} Links
              </span>
            </TableCell>
            <TableCell>{column.sortOrder}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(column)} className="rounded p-1.5 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition">
                  <i className="bi bi-pencil"></i>
                </button>
                <button className="rounded p-1.5 text-red-700 hover:bg-red-50 hover:text-red-800 transition">
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
        title={editingItem ? "Edit Kolom Footer" : "Tambah Kolom Footer"}
      >
        <form className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <Field label="Column Title" defaultValue={editingItem?.columnTitle} placeholder="e.g., Company" />
            <Field label="Display Order" type="number" defaultValue={editingItem?.sortOrder ?? 0} />
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">Links in this column</h3>
              <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700">
                + Add Link
              </button>
            </div>
            
            {editingItem?.footerLinks && editingItem.footerLinks.length > 0 ? (
              <ul className="space-y-2">
                {editingItem.footerLinks.map((link) => (
                  <li key={link.id} className="flex items-center justify-between rounded border border-gray-200 bg-white p-3 shadow-sm">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{link.label}</p>
                      <p className="text-xs text-gray-500">{link.url}</p>
                    </div>
                    <div className="flex gap-1">
                      <button type="button" className="p-1 text-gray-400 hover:text-gray-600">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button type="button" className="p-1 text-gray-400 hover:text-red-600">
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No links added to this column yet.</p>
            )}
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
              type="button"
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
