"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    console.log("Dashboard - loading:", loading);
    console.log("Dashboard - user:", user);

    if (!loading && !user) {
      console.log("No user, redirecting to login");
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!user?.uid) return;
      try {
        const res = await fetch("/api/auth/activity-get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        });
        const json = await res.json();
        if (json?.ok) setActivity(json.activity);
      } catch (e) {
        // noop
      }
    };
    fetchActivity();
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Memuat...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Akan redirect oleh useEffect
  }

  const getLoginMethod = () => {
    // Heuristic mapping; can be improved when we store explicit auth provider.
    if (user.photoURL?.includes('google')) return 'Google';
    if (user.photoURL?.includes('github')) return 'GitHub';
    return 'Email/Password';
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">
                Dashboard Sistem Multi Autentikasi
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
              <Link
                href="/security"
                className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                Security Settings
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6 bg-white">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Selamat Datang, {user.displayName || user.email}
            </h2>
            
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <p className="text-green-700 font-medium">
                ✅ Anda berhasil login dengan sistem multi autentikasi yang aman!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg shadow p-4">
                <h3 className="font-bold text-lg mb-3 text-gray-800 border-b pb-2">
                  Informasi User
                </h3>
                <ul className="space-y-2 text-black">
                  <li><strong>UID:</strong> <span className="font-mono text-xs">{user.uid}</span></li>
                  <li><strong>Email:</strong> {user.email}</li>
                  <li><strong>Email Verified:</strong> {user.emailVerified ? "✅ Ya" : "❌ Belum"}</li>
                  <li><strong>Metode Login:</strong> {getLoginMethod()}</li>
                  <li><strong>Display Name:</strong> {user.displayName || "-"}</li>

                  <li>
                    <strong>Last Login:</strong>
                    {activity?.lastLoginAt ? new Date(activity.lastLoginAt).toLocaleString() : "-"}
                  </li>
                  <li>
                    <strong>Device:</strong>
                    {activity?.device ? `${activity.device.os} / ${activity.device.browser}` : "-"}
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg shadow p-4">
                <h3 className="font-bold text-lg mb-3 text-gray-800 border-b pb-2">
                  Fitur Keamanan
                </h3>
                <ul className="list-disc list-inside space-y-1 text-black">
                  <li>Multi Authentication (Email, Google, GitHub)</li>
                  <li>Email Verification (MFA Layer)</li>
                  <li>Secure Session Management</li>
                  <li>Account Linking untuk konflik akun</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}