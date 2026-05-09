"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
} from "@/lib/firebase";
import { useRouter } from "next/navigation";

const postLoginActivity = async ({ uid, email, idToken }) => {
  try {
    await fetch("/api/auth/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, email, idToken }),
    });
  } catch (e) {
    console.log("Activity log failed:", e?.message);
  }
};

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (nextUser) {
        const next = {
          uid: nextUser.uid,
          email: nextUser.email,
          displayName: nextUser.displayName,
          photoURL: nextUser.photoURL,
          emailVerified: nextUser.emailVerified,
        };
        setUser(next);

        try {
          const idToken = await nextUser.getIdToken();
          postLoginActivity({ uid: next.uid, email: next.email, idToken });
        } catch (e) {
          // token fetch failed; still set user
          postLoginActivity({ uid: next.uid, email: next.email, idToken: null });
        }

        console.log("User logged in:", nextUser.email);
      } else {
        setUser(null);
        console.log("User logged out");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);

      if (!result.user.emailVerified) {
        await signOut(auth);
        throw new Error("Email belum diverifikasi. Silakan cek email Anda.");
      }

      return result.user;
    } catch (err) {
      let message = err.message;
      if (err.code === "auth/invalid-credential") {
        message = "Email atau password salah";
      } else if (err.code === "auth/user-not-found") {
        message = "Akun tidak ditemukan";
      } else if (err.code === "auth/wrong-password") {
        message = "Password salah";
      }
      setError(message);
      throw err;
    }
  };

  const registerWithEmail = async (email, password) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(result.user);
      return result.user;
    } catch (err) {
      let message = err.message;
      if (err.code === "auth/email-already-in-use") {
        message = "Email sudah terdaftar";
      } else if (err.code === "auth/weak-password") {
        message = "Password terlalu lemah (minimal 6 karakter)";
      }
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, loginWithEmail, registerWithEmail, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

