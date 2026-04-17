import crypto from "crypto";

const SESSION_TTL = 24 * 60 * 60 * 1000;
const REFRESH_THRESHOLD = 60 * 60 * 1000;
const ABSOLUTE_MAX = 7 * 24 * 60 * 60 * 1000;

export interface Session {
  token: string;
  expiresAt: number;
  createdAt: number;
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function createSession(): Session {
  const now = Date.now();
  return {
    token: generateSessionToken(),
    expiresAt: now + SESSION_TTL,
    createdAt: now,
  };
}

export function encodeSession(session: Session): string {
  const data = JSON.stringify(session);
  return Buffer.from(data).toString("base64");
}

export function decodeSession(encoded: string): Session | null {
  try {
    const data = Buffer.from(encoded, "base64").toString("utf-8");
    const session = JSON.parse(data) as Session;
    if (!session.token || !session.expiresAt || !session.createdAt) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function validateSession(session: Session): {
  valid: boolean;
  needsRefresh: boolean;
} {
  const now = Date.now();

  if (now - session.createdAt > ABSOLUTE_MAX) {
    return { valid: false, needsRefresh: false };
  }

  if (now > session.expiresAt) {
    return { valid: false, needsRefresh: false };
  }

  const needsRefresh = session.expiresAt - now < REFRESH_THRESHOLD;
  return { valid: true, needsRefresh };
}

export function refreshSession(session: Session): Session {
  const now = Date.now();
  const remainingAbsolute = ABSOLUTE_MAX - (now - session.createdAt);

  if (remainingAbsolute <= 0) {
    return createSession();
  }

  const newExpiry = now + Math.min(SESSION_TTL, remainingAbsolute);

  return {
    token: session.token,
    expiresAt: newExpiry,
    createdAt: session.createdAt,
  };
}

export const AUTH_COOKIE_NAME = "editor_auth";
