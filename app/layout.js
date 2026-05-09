"use client";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <title>Multi Authentication System</title>
        <meta name="description" content="Sistem autentikasi multi metode dengan Next.js dan Firebase" />
      </head>
      <body className="bg-gray-50">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}