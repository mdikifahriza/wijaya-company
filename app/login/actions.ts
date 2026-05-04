"use server";

import { redirect } from "next/navigation";

import { authenticateUser, createUserSession, deleteUserSession } from "@/lib/auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/admin");

  if (!username || !password) {
    return {
      error: "Username dan password wajib diisi.",
    };
  }

  try {
    const user = await authenticateUser(username, password);

    if (!user) {
      return {
        error: "Username atau password tidak valid.",
      };
    }

    await createUserSession(user);
  } catch (error) {
    console.error("Login failed", error);

    return {
      error:
        "Login gagal diproses. Pastikan tabel users tersedia dan koneksi database aktif.",
    };
  }

  redirect(from.startsWith("/admin") ? from : "/admin");
}

export async function logoutAction() {
  await deleteUserSession();
  redirect("/login");
}
