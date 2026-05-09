import { NextResponse } from "next/server";
import { firestoreAdmin } from "@/lib/firestoreAdmin";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { uid } = body || {};

    if (!uid) {
      return NextResponse.json(
        { ok: false, error: "Missing uid" },
        { status: 400 }
      );
    }

    const doc = await firestoreAdmin.collection("users").doc(uid).get();
    const data = doc.exists ? doc.data() : null;

    return NextResponse.json(
      {
        ok: true,
        activity: {
          uid,
          lastLoginAt: data?.lastLogin?.lastLoginAt || null,
          ip: data?.lastLogin?.ip || null,
          device: data?.lastLogin?.device || null,
        },
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

