"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logoutAction } from "@/app/login/actions";
import { adminNavigation } from "@/app/admin/_lib/navigation";

export function AdminSidebar({
  siteName,
  username,
  onNavigate,
}: {
  siteName: string;
  username: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-200 w-64">
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
        <h1 className="font-display text-xl font-bold text-gray-800">
          {siteName || "Admin Dasher"}
        </h1>
        {onNavigate && (
          <button onClick={onNavigate} className="xl:hidden text-gray-400 hover:text-gray-600">
            <i className="bi bi-x-lg text-xl"></i>
          </button>
        )}
      </div>

      <div className="px-6 py-4">
         <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Menu Utama</p>
         <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-gray-400">Masuk Sebagai</p>
            <p className="mt-1 text-sm font-semibold text-gray-700">{username}</p>
         </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
        {adminNavigation.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
                <i className={`bi bi-${item.countLabel === 'home' ? 'grid' : 
                                      item.countLabel === 'site' ? 'gear' :
                                      item.countLabel === 'seo' ? 'search' :
                                      item.countLabel === 'hero' ? 'window-sidebar' :
                                      item.countLabel === 'bio' ? 'person-badge' :
                                      item.countLabel === 'svc' ? 'briefcase' :
                                      item.countLabel === 'pkg' ? 'boxes' :
                                      item.countLabel === 'port' ? 'images' :
                                      item.countLabel === 'proof' ? 'chat-square-quote' :
                                      item.countLabel === 'cta' ? 'lightning' :
                                      item.countLabel === 'foot' ? 'layout-split' :
                                      item.countLabel === 'social' ? 'share' :
                                      'folder'} ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'} text-lg`}></i>
                <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-gray-200 p-4">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <i className="bi bi-box-arrow-left text-lg text-gray-400 group-hover:text-red-500"></i>
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
