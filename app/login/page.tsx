import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";

import { LoginForm } from "@/app/login/login-form";
import { getSession } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  await connection();

  const session = await getSession();

  if (session) {
    redirect("/admin");
  }

  const resolvedSearchParams = await searchParams;
  const from = resolvedSearchParams.from?.startsWith("/admin")
    ? resolvedSearchParams.from
    : "/admin";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e5e9dc] px-4 py-8 sm:px-6 relative">
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-[#69734f] uppercase tracking-widest hover:text-[#50593b] transition-colors"
      >
        <i className="bi bi-arrow-left"></i>
        Kembali ke Beranda
      </Link>
      
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-[0px_2px_20px_rgba(0,0,0,0.1)]">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-[#69734f] uppercase tracking-wider mb-2">Admin Login</h1>
          <p className="text-sm text-[#60684f]">Please sign in to continue</p>
        </div>
        <LoginForm from={from} />
      </div>
    </main>
  );
}
