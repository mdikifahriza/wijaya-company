import { timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import {
  createSessionValue,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
  verifySessionValue,
} from "@/lib/session";

function safeCompareText(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export async function authenticateUser(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return null;
  }

  if (!safeCompareText(user.password, password)) {
    return null;
  }

  return user;
}

export async function createUserSession(user: {
  id: bigint;
  username: string;
  role: string;
}) {
  const cookieStore = await cookies();
  const sessionValue = createSessionValue({
    userId: user.id.toString(),
    username: user.username,
    role: user.role,
  });

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: sessionValue,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function deleteUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession() {
  const cookieStore = await cookies();
  return verifySessionValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function requireAdminSession() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
