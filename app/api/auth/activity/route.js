// app/api/auth/activity/route.js
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";     // ← konsisten
import { adminDb } from "@/lib/firebase-admin";       // ← export juga dari firebase-admin

function parseDevice(userAgent = "") {
  const ua = userAgent.toLowerCase();
  
  const os = ua.includes("windows") ? "Windows"
           : ua.includes("android") ? "Android"
           : ua.includes("iphone") || ua.includes("ipad") ? "iOS"
           : ua.includes("macintosh") ? "macOS"
           : "Unknown";

  const browser = ua.includes("chrome") && !ua.includes("edg") ? "Chrome"
                 : ua.includes("firefox") ? "Firefox"
                 : ua.includes("safari") ? "Safari"
                 : ua.includes("edge") || ua.includes("edg") ? "Edge"
                 : "Unknown";

  return { os, browser };
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { uid, email, idToken } = body || {};

    if (!uid) {
      return NextResponse.json(
        { ok: false, error: "Missing uid" },
        { status: 400 }
      );
    }

    // === Security Check ===
    let decodedToken = null;
    if (idToken) {
      try {
        decodedToken = await adminAuth.verifyIdToken(idToken);
        if (decodedToken.uid !== uid) {
          return NextResponse.json({ ok: false, error: "Token mismatch" }, { status: 401 });
        }
      } catch (err) {
        return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
      }
    }

    // Capture metadata
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = req.headers.get("user-agent") || "";
    const device = parseDevice(userAgent);

    const lastLoginAt = new Date().toISOString();

    const activityData = {
      uid,
      email: email || null,
      ip,
      userAgent,
      device,
      lastLoginAt,
      createdAt: Date.now(),
    };

    // Simpan history login
    const activityRef = adminDb
      .collection("loginActivities")
      .doc(uid)
      .collection("entries")
      .doc(); // auto ID

    await activityRef.set(activityData);

    // Update summary user terakhir login
    await adminDb.collection("users").doc(uid).set(
      {
        lastLogin: {
          lastLoginAt,
          ip,
          device,
          email: email || null,
        },
        updatedAt: Date.now(),
      },
      { merge: true }
    );

    return NextResponse.json({ 
      ok: true, 
      message: "Login activity recorded" 
    });

  } catch (error) {
    console.error("Activity log error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}