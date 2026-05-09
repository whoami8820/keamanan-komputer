# TODO - Keamanan & UX Enhancements

## Fase 1 (langsung jadi, minim backend berat)
- [x] Buat rencana pengerjaan (brainstorm plan) + TODO awal
- [x] Implement Security Settings page (`app/security/page.js`)
- [ ] Implement Phone MFA flow (enable + verify) via Firebase (tambah modul di `lib/firebase.js` dan metode di `context/AuthContext.js`)
- [x] Tambah activity log minimal: simpan `lastLogin` + `device` (user-agent) + `ip` via API route (`app/api/auth/activity/route.js`)
- [x] Update dashboard (`app/dashboard/page.js`) untuk menampilkan Last Login & Device Info + tombol ke Security Settings
- [x] Tambahkan dark mode toggle (class-based) di UI

## Fase 2 (butuh komponen server/DB lebih)
- [ ] RBAC sederhana: simpan role di Firestore + proteksi route admin via `middleware.js`
- [ ] Account Recovery: Recovery code atau security questions (API route + Firestore)
- [ ] Password strength upgrade (UI + change password)
- [ ] Password history (butuh desain hashing + penyimpanan)
- [ ] Rate limit & brute force protection (API route/Upstash)
- [ ] Token refresh & logout all devices (revocation di Firebase Auth)

