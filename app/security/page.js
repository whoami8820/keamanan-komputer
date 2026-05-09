"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function SecuritySettingsPage() {
  const { user, loading, error, setError } = useAuth();
  const [themeMode, setThemeMode] = useState("system");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("themeMode") : null;
    if (saved) {
      // schedule state update to avoid sync setState warning
      queueMicrotask(() => setThemeMode(saved));
    }
  }, []);

  useEffect(() => {
    // Apply theme toggle using class on <html>
    const root = document.documentElement;
    if (themeMode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    if (themeMode === "system") {
      // If system prefers dark, tailwind will still work with `darkMode: media`
      // but our Tailwind config isn't known here; we keep it simple.
    }
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Memuat...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-700">Silakan login terlebih dahulu.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-500">Kembali ke login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <nav className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Security Settings
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-300">{user.email}</div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Multi-Factor Authentication (MFA)
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Pada fase 1, UI ini menyiapkan tempat untuk Phone MFA.
            </p>

            <div className="mt-4 p-4 rounded-md bg-gray-50 dark:bg-gray-900">
              <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                Phone Auth (SMS OTP)
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Implementasi verify OTP akan ditambahkan berikutnya.
              </div>
              <button
                type="button"
                disabled
                className="mt-3 w-full py-2 px-4 rounded-md bg-gray-300 text-gray-700 cursor-not-allowed"
              >
                Enable MFA (Phone) - Soon
              </button>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Appearance (Dark Mode)
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Toggle dark mode untuk meningkatkan UX.
            </p>

            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                <input
                  type="radio"
                  name="theme"
                  value="system"
                  checked={themeMode === "system"}
                  onChange={() => setThemeMode("system")}
                />
                System
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={themeMode === "light"}
                  onChange={() => setThemeMode("light")}
                />
                Light
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={themeMode === "dark"}
                  onChange={() => setThemeMode("dark")}
                />
                Dark
              </label>
            </div>
          </section>
        </div>

        {error ? (
          <div className="mt-6 text-red-600 bg-red-50 border border-red-200 p-3 rounded">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}

