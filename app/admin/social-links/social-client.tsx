"use client";

import { useState } from "react";
import { Table, TableRow, TableCell } from "@/app/admin/_components/table";
import { Modal } from "@/app/admin/_components/modal";
import { Field } from "@/app/admin/_components/admin-ui";
import { predefinedSocials, SocialIcon } from "@/lib/social-icons";

type SocialLink = {
  id: string;
  platform: string;
  url: string;
  iconName: string;
  sortOrder: number;
};

export function SocialLinksTableClient({ initialLinks }: { initialLinks: SocialLink[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SocialLink | null>(null);
  
  // Custom state for the dropdown
  const [selectedSocial, setSelectedSocial] = useState<string>("whatsapp");

  const handleAdd = () => {
    setEditingItem(null);
    setSelectedSocial("whatsapp");
    setIsModalOpen(true);
  };

  const handleEdit = (item: SocialLink) => {
    setEditingItem(item);
    const matched =
      predefinedSocials.find((social) => social.icon === item.iconName) ||
      predefinedSocials.find((social) => social.id === item.platform.toLowerCase());
    setSelectedSocial(matched ? matched.id : "whatsapp");
    setIsModalOpen(true);
  };

  // Find the selected platform details
  const activeSocialDetails =
    predefinedSocials.find((social) => social.id === selectedSocial) ||
    predefinedSocials[0];

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <i className="bi bi-plus-lg mr-2"></i>
          Tambah Link
        </button>
      </div>

      <Table headers={["Platform", "URL", "Urutan", "Aksi"]}>
                {initialLinks.map((link) => (
          <TableRow key={link.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-gray-500">
                  <SocialIcon
                    iconName={link.iconName}
                    platform={link.platform}
                    className="h-4 w-4"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{link.platform}</p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">{link.iconName}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <a href={link.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                {link.url}
              </a>
            </TableCell>
            <TableCell>{link.sortOrder}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(link)} className="rounded p-1.5 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition">
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
        title={editingItem ? "Edit Tautan Sosial" : "Tambah Tautan Sosial"}
      >
        <form className="space-y-5">
          <div className="grid gap-2">
             <label htmlFor="social-selector" className="text-sm font-semibold text-gray-700">Platform</label>
             <div className="relative">
               <select 
                 id="social-selector"
                 className="h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-10 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                 value={selectedSocial}
                 onChange={(e) => setSelectedSocial(e.target.value)}
                 name="social_selector"
               >
                 {predefinedSocials.map((social) => (
                   <option key={social.id} value={social.id}>{social.label}</option>
                 ))}
               </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                 <i className="bi bi-chevron-down"></i>
               </div>
             </div>
             
             {/* Hidden inputs to pass data seamlessly */}
             <input type="hidden" name="platform" value={activeSocialDetails.label} />
             <input type="hidden" name="iconName" value={activeSocialDetails.icon} />
             
             <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700">
                <SocialIcon
                  iconName={activeSocialDetails.icon}
                  platform={activeSocialDetails.id}
                  className="h-5 w-5 text-blue-600"
                />
                <span>This icon and name will be displayed.</span>
             </div>
          </div>
          
          <Field label="Target URL" defaultValue={editingItem?.url} placeholder="https://..." />
          
          <div className="grid grid-cols-2 gap-5 border-t border-gray-200 pt-5">
            <Field label="Display Order" type="number" defaultValue={editingItem?.sortOrder ?? 0} />
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
