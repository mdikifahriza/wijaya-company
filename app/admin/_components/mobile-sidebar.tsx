"use client";

import { useState } from "react";
import { AdminSidebar } from "./admin-sidebar";

export function MobileAdminSidebar({
  siteName,
  username,
}: {
  siteName: string;
  username: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="xl:hidden flex items-center justify-center p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Open Sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
           <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-gray-900/50 backdrop-blur-sm transition-opacity xl:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed inset-y-0 left-0 z-[70] w-64 transform bg-white shadow-2xl transition-transform duration-300 ease-in-out xl:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar siteName={siteName} username={username} onNavigate={() => setIsOpen(false)} />
      </div>
    </>
  );
}
