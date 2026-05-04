import { useId } from "react";

import { resolveMediaUrl } from "@/lib/media-url";

export function formatDate(date: Date | null | undefined) {
  if (!date) {
    return "Belum ada data";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export function SectionShell({
  title,
  actionLabel,
  onAction,
  actionType = "button",
  children,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  actionType?: "button" | "submit";
  children: React.ReactNode;
}) {
  return (
    <section className="h-full">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {title}
          </h1>
        </div>
        {actionLabel && (
          <button
            type={actionType}
            onClick={onAction}
            className="inline-flex w-fit items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <i className="bi bi-plus-lg mr-2"></i>
            {actionLabel}
          </button>
        )}
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {children}
      </div>
    </section>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
}: {
  label: string;
  name?: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  type?: string;
}) {
  const fieldId = useId();

  return (
    <label htmlFor={fieldId} className="grid gap-2">
      <span className="text-sm font-semibold text-gray-700">
        {label}
      </span>
      <input
        id={fieldId}
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none ring-0 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </label>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  options,
  placeholder = "Pilih salah satu",
}: {
  label: string;
  name?: string;
  defaultValue?: string | null;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}) {
  const fieldId = useId();

  return (
    <label htmlFor={fieldId} className="grid gap-2">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <select
        id={fieldId}
        name={name}
        defaultValue={defaultValue ?? ""}
        className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none ring-0 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AreaField({
  label,
  name,
  defaultValue,
  rows = 5,
  placeholder,
}: {
  label: string;
  name?: string;
  defaultValue?: string | null;
  rows?: number;
  placeholder?: string;
}) {
  const fieldId = useId();

  return (
    <label htmlFor={fieldId} className="grid gap-2">
      <span className="text-sm font-semibold text-gray-700">
        {label}
      </span>
      <textarea
        id={fieldId}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="min-h-[100px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm leading-relaxed text-gray-800 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </label>
  );
}

export function ToggleField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name?: string;
  defaultChecked?: boolean;
}) {
  const fieldId = useId();

  return (
    <label htmlFor={fieldId} className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
      <input
        id={fieldId}
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      {label}
    </label>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center text-sm text-gray-500">
      {message}
    </div>
  );
}

export function ReadonlyField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: React.ReactNode;
  mono?: boolean;
}) {
  const hasValue =
    value !== null &&
    value !== undefined &&
    !(typeof value === "string" && value.trim() === "");

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <div
        className={`mt-2 text-sm text-gray-800 ${
          mono ? "font-mono break-all" : ""
        }`}
      >
        {hasValue ? value : "Belum diisi"}
      </div>
    </div>
  );
}

export function ReadonlyImageField({
  label,
  src,
  alt,
  className = "h-32 w-full",
}: {
  label: string;
  src?: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <div className="mt-3">
        {src ? (
          <img
            src={resolveMediaUrl(src) ?? ""}
            alt={alt}
            className={`${className} rounded-xl border border-gray-200 object-cover bg-white`}
          />
        ) : (
          <div
            className={`${className} flex items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white text-sm text-gray-400`}
          >
            Belum ada gambar
          </div>
        )}
      </div>
    </div>
  );
}

export function MicroStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/12 bg-white/6 px-4 py-4">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-[0.68rem] uppercase tracking-[0.22em] text-[#d5dbc9]">
        {label}
      </p>
    </div>
  );
}
