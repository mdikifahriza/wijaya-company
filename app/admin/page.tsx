import Link from "next/link";
import { connection } from "next/server";

import { getAdminPageData } from "@/lib/admin-content";
import { requireAdminSession } from "@/lib/auth";

export default async function AdminOverviewPage() {
  await connection();
  const session = await requireAdminSession();

  const {
    biographies,
    ctaSections,
    footerColumns,
    heroSections,
    packagePlans,
    portfolios,
    services,
    socialProof,
  } = await getAdminPageData();

  return (
    <>
      <div className="mb-6">
        <h1 className="fs-3 font-bold text-2xl mb-1 text-gray-800">Halo {session.username},</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-6">
        {/* Card 1 */}
        <div className="card card-lg bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="card-body p-6 flex flex-col gap-6">
            <div className="d-flex align-items-center gap-3 flex">
              <div className="icon-shape h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                <i className="bi bi-briefcase text-xl"></i>
              </div>
              <div className="font-semibold text-gray-600">Layanan</div>
            </div>
            <div className="d-flex justify-content-between align-items-center lh-1 flex justify-between items-center mt-4">
              <div className="fs-3 fw-bold text-3xl font-bold text-gray-800">{services.length}</div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card card-lg bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="card-body p-6 flex flex-col gap-6">
            <div className="d-flex align-items-center gap-3 flex">
              <div className="icon-shape h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                <i className="bi bi-chat-square-quote text-xl"></i>
              </div>
              <div className="font-semibold text-gray-600">Paket</div>
            </div>
            <div className="d-flex justify-content-between align-items-center lh-1 flex justify-between items-center mt-4">
              <div className="fs-3 fw-bold text-3xl font-bold text-gray-800">{packagePlans.length}</div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="card card-lg bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="card-body p-6 flex flex-col gap-6">
            <div className="d-flex align-items-center gap-3 flex">
              <div className="icon-shape h-12 w-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                <i className="bi bi-layers text-xl"></i>
              </div>
              <div className="font-semibold text-gray-600">Referensi Web</div>
            </div>
            <div className="d-flex justify-content-between align-items-center lh-1 flex justify-between items-center mt-4">
              <div className="fs-3 fw-bold text-3xl font-bold text-gray-800">{portfolios.length}</div>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="card card-lg bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="card-body p-6 flex flex-col gap-6">
            <div className="d-flex align-items-center gap-3 flex">
              <div className="icon-shape h-12 w-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3">
                <i className="bi bi-link-45deg text-xl"></i>
              </div>
              <div className="font-semibold text-gray-600">Testimoni</div>
            </div>
            <div className="d-flex justify-content-between align-items-center lh-1 flex justify-between items-center mt-4">
              <div className="fs-3 fw-bold text-3xl font-bold text-gray-800">
                {socialProof.length}
              </div>
            </div>
          </div>
        </div>

        <div className="card card-lg bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="card-body p-6 flex flex-col gap-6">
            <div className="d-flex align-items-center gap-3 flex">
              <div className="icon-shape h-12 w-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3">
                <i className="bi bi-link-45deg text-xl"></i>
              </div>
              <div className="font-semibold text-gray-600">Blok Konten</div>
            </div>
            <div className="d-flex justify-content-between align-items-center lh-1 flex justify-between items-center mt-4">
              <div className="fs-3 fw-bold text-3xl font-bold text-gray-800">
                {heroSections.length + biographies.length + ctaSections.length + footerColumns.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
         <div className="xl:col-span-2">
            <div className="card card-lg bg-white rounded-xl shadow-sm border border-gray-200 h-full">
               <div className="card-header border-b border-gray-100 px-6 py-4">
                  <h5 className="mb-0 font-bold text-gray-800">Aksi Cepat</h5>
               </div>
               <div className="card-body p-6">
                  <div className="flex flex-wrap gap-4">
                     <Link
                        href="/admin/services"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                     >
                        Kelola Layanan
                     </Link>
                     <Link
                        href="/admin/packages"
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                     >
                        Kelola Paket
                     </Link>
                     <Link
                        href="/admin/portfolio"
                        className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                     >
                        Kelola Referensi Web
                     </Link>
                     <Link
                        href="/"
                        target="_blank"
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                     >
                        Lihat Website
                        <i className="bi bi-box-arrow-up-right"></i>
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </>
  );
}
