import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  createSession,
  validateSession,
  refreshSession,
  encodeSession,
  decodeSession,
  AUTH_COOKIE_NAME,
} from "@/lib/session";

const AUTH_PASSWORD = process.env.EDITOR_PASSWORD || "changeme";
const COOKIE_MAX_AGE = 24 * 60 * 60;

function setAuthCookie(encodedSession: string, maxAge: number = COOKIE_MAX_AGE) {
  return {
    name: AUTH_COOKIE_NAME,
    value: encodedSession,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge,
    path: "/",
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (password !== AUTH_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    const session = createSession();
    const encoded = encodeSession(session);
    const cookieStore = await cookies();
    cookieStore.set(setAuthCookie(encoded));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (!cookie) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const session = decodeSession(cookie.value);
  if (!session) {
    cookieStore.delete(AUTH_COOKIE_NAME);
    return NextResponse.json(
      { error: "Invalid session" },
      { status: 401 }
    );
  }

  const { valid, needsRefresh } = validateSession(session);

  if (!valid) {
    cookieStore.delete(AUTH_COOKIE_NAME);
    return NextResponse.json(
      { error: "Session expired" },
      { status: 401 }
    );
  }

  if (needsRefresh) {
    const refreshed = refreshSession(session);
    const encoded = encodeSession(refreshed);
    cookieStore.set(setAuthCookie(encoded));
    return NextResponse.json({ success: true, refreshed: true });
  }

  return NextResponse.json({ success: true, refreshed: false });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  return NextResponse.json({ success: true });
}
