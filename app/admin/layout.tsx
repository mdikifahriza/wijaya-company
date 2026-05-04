import { connection } from "next/server";

import { AdminSidebar } from "@/app/admin/_components/admin-sidebar";
import { MobileAdminSidebar } from "@/app/admin/_components/mobile-sidebar";
import { getAdminPageData } from "@/lib/admin-content";
import { requireAdminSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();

  const session = await requireAdminSession();
  const {
    siteSettings,
  } = await getAdminPageData();

  return (
    <main className="min-h-screen bg-[#f3f4f6] text-gray-800">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 h-full flex-shrink-0 hidden xl:block shadow-sm z-10 relative">
          <AdminSidebar
            siteName={siteSettings?.siteName ?? "Admin"}
            username={session.username}
          />
        </aside>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
           {/* Topbar */}
           <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6 justify-between flex-shrink-0 shadow-sm z-10">
             <div className="flex items-center gap-4">
                <MobileAdminSidebar 
                  siteName={siteSettings?.siteName ?? "Admin"}
                  username={session.username}
                />
             </div>
             
             {/* Header Right Content */}
             <div className="flex items-center gap-3 sm:gap-4">
                <div className="hidden sm:flex items-center gap-3">
                   <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                      {session.username.charAt(0).toUpperCase()}
                   </div>
                   <span className="text-sm font-semibold text-gray-700">{session.username}</span>
                </div>
                
                {/* Mobile 3-dots Menu for Profile / More Actions if requested */}
                <div className="sm:hidden relative group">
                   <button className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
                      <i className="bi bi-three-dots-vertical text-xl"></i>
                   </button>
                   <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100 mb-1">
                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                            {session.username.charAt(0).toUpperCase()}
                         </div>
                         <p className="text-sm font-semibold text-gray-700">{session.username}</p>
                      </div>
                      <a href="/" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                         <i className="bi bi-box-arrow-up-right"></i> Lihat Website
                      </a>
                   </div>
                </div>
             </div>
           </header>
           
           {/* Page Content */}
           <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
             <div className="mx-auto w-full max-w-7xl">
               {children}
             </div>
           </div>
        </div>
      </div>
    </main>
  );
}
