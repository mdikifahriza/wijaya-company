"use client";

import { useEffect, useId, useState } from "react";
import { resolveMediaUrl } from "@/lib/media-url";

export function ImageUploader({
  label,
  name = "image",
  defaultValue = "",
  accept = "image/png, image/jpeg, image/webp, image/gif, image/x-icon, image/vnd.microsoft.icon",
}: {
  label: string;
  name?: string;
  defaultValue?: string | null;
  accept?: string;
}) {
  const inputId = useId();
  const [preview, setPreview] = useState(resolveMediaUrl(defaultValue) || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(resolveMediaUrl(defaultValue) || "");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  // Cleanup object URL
  useEffect(() => {
    setPreview((currentPreview) => {
      if (currentPreview.startsWith("blob:")) {
        return currentPreview;
      }

      return resolveMediaUrl(defaultValue) || "";
    });
  }, [defaultValue]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-widest text-gray-500">
        {label}
      </label>
      {/* Hidden input to store the old URL if no new file is uploaded */}
      <input type="hidden" name={`${name}_old`} value={defaultValue || ""} />
      
      <label
        htmlFor={inputId}
        className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-blue-500 hover:bg-blue-50"
        style={{ minHeight: "150px" }}
      >
        <input 
          id={inputId}
          type="file" 
          name={name}
          onChange={handleFileChange}
          accept={accept}
          className="hidden" 
        />
        
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <span className="rounded-lg bg-gray-900/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                Ganti Gambar
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 p-6 text-center text-gray-500 transition-colors group-hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span className="text-sm font-medium">
              Klik untuk upload gambar
            </span>
          </div>
        )}
      </label>
    </div>
  );
}
