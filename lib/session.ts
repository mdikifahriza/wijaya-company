import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type SessionPayload = {
  userId: string;
  username: string;
  role: string;
  exp: number;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }

  return secret;
}

function signSessionValue(value: string) {
  return createHmac("sha256", getAuthSecret())
    .update(value)
    .digest("base64url");
}

function safeCompare(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export function createSessionValue(
  payload: Omit<SessionPayload, "exp"> & { exp?: number },
) {
  const completePayload: SessionPayload = {
    ...payload,
    exp:
      payload.exp ??
      Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };

  const encodedPayload = Buffer.from(
    JSON.stringify(completePayload),
  ).toString("base64url");
  const signature = signSessionValue(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifySessionValue(
  value: string | undefined | null,
): SessionPayload | null {
  if (!value) {
    return null;
  }

  const [encodedPayload, signature] = value.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signSessionValue(encodedPayload);

  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as SessionPayload;

    if (
      !payload.userId ||
      !payload.username ||
      !payload.role ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
