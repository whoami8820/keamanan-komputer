import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// NOTE:
// Untuk production/hosting, sebaiknya pakai service account JSON dari secret env.
// Di tahap ini, kita dukung 2 cara:
// 1) NEXT_PUBLIC_FIREBASE_PROJECT_ID tidak cukup; butuh private key dari service account.
// 2) TEMP: FIREBASE_SERVICE_ACCOUNT_JSON (stringified JSON) di env.

let app;
if (!getApps().length) {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_JSON env is required for Firestore Admin."
    );
  }

  const serviceAccount = JSON.parse(raw);

  app = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  app = getApps()[0];
}

export const firestoreAdmin = getFirestore(app);

