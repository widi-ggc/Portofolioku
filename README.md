# Web Portofolio (Next.js + Supabase)

Web portofolio dengan halaman publik (landing page) dan dashboard admin untuk
mengelola karya (gambar, video via link YouTube/Vimeo, dan dokumen PDF).

## 1. Buat Project Supabase (gratis)

1. Daftar di https://supabase.com dan buat project baru.
2. Buka menu **SQL Editor**, tempel isi file `supabase/schema.sql`, lalu klik **Run**.
   Ini akan membuat tabel `works`, `profile`, storage bucket `portfolio-media`,
   dan aturan keamanan (Row Level Security).
3. Buka menu **Authentication > Users**, klik **Add user**, isi email & password
   untuk akun admin kamu. Ini adalah akun yang dipakai untuk login di `/admin/login`.
   (Pendaftaran admin baru sengaja tidak dibuka untuk publik — hanya kamu yang
   bisa menambah admin lewat dashboard Supabase.)
4. Buka menu **Project Settings > API**, salin:
   - `Project URL`
   - `anon public` key

## 2. Setup di komputer

```bash
npm install
cp .env.local.example .env.local
```

Isi `.env.local` dengan `Project URL` dan `anon key` dari langkah di atas:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=isi-anon-key-di-sini
```

Jalankan secara lokal:

```bash
npm run dev
```

Buka http://localhost:3000 untuk halaman publik, dan
http://localhost:3000/admin/login untuk login admin.

## 3. Deploy (gratis)

1. Push folder ini ke repository GitHub.
2. Buka https://vercel.com, klik **Add New Project**, hubungkan repo tadi.
3. Saat diminta Environment Variables, isi `NEXT_PUBLIC_SUPABASE_URL` dan
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` yang sama seperti di `.env.local`.
4. Klik **Deploy**. Selesai — web kamu online.

## Struktur Fitur

- **Halaman publik (`/`)**: menampilkan profil, filter kategori karya, dan detail
  karya (gambar, video ter-embed, atau link PDF) lewat modal.
- **Login admin (`/admin/login`)**: pakai akun yang dibuat di Supabase Auth.
- **Dashboard admin (`/admin/dashboard`)**: tambah/ubah/hapus karya (dengan
  upload gambar & PDF langsung ke Supabase Storage), serta edit info profil.
  Halaman ini dilindungi — otomatis redirect ke halaman login kalau belum masuk.

## Fitur Tema & Dark Mode

- Admin bisa memilih salah satu dari **5 tema warna** di tab **Profil** pada
  dashboard (Riso Cerah, Ocean Kalem, Sunset Hangat, Forest Earthy, Monokrom
  Minimalis). Tema berlaku untuk seluruh halaman publik.
- Ada tombol 🌙/☀️ di pojok kanan atas (baik halaman publik maupun dashboard
  admin) untuk beralih mode gelap/terang. Pilihan ini tersimpan otomatis di
  browser masing-masing pengunjung (tidak memengaruhi pengunjung lain).
- Kalau kamu upgrade dari versi sebelumnya, jalankan ulang `supabase/schema.sql`
  di SQL Editor Supabase dulu supaya kolom `theme` tersedia di tabel `profile`.

## Proteksi Karya (Watermark & Pembatasan Halaman)

Untuk mencegah kebocoran file kerja asli beresolusi/berhalaman penuh, setiap
kali admin mengunggah file lewat dashboard, prosesnya berjalan **di browser
sebelum file dikirim ke server**:

- **Gambar (sampul & galeri):** otomatis diberi watermark teks transparan
  yang berulang secara diagonal di seluruh gambar (memakai nama dari Profil).
- **PDF:** otomatis diberi watermark transparan di setiap halaman, DAN
  **dipotong maksimal 15 halaman pertama** — sisa halaman tidak pernah
  terupload ke server sama sekali.

Karena diproses di browser (bukan file asli yang diunggah), berkas asli
beresolusi/berhalaman penuh di komputer kamu tidak pernah terkirim ke internet.

**Batasan:** proteksi ini hanya berlaku untuk file yang diunggah *setelah*
fitur ini aktif. Karya yang sudah pernah diunggah sebelumnya tidak otomatis
diberi watermark — perlu diedit ulang (unggah ulang filenya) kalau ingin
diberi proteksi yang sama.

## Catatan

- Halaman publik **tidak punya tombol atau tautan ke admin sama sekali** —
  akses ke `/admin/login` hanya lewat mengetik alamatnya langsung di browser
  (atau lewat bookmark). Ini membuat pengunjung biasa tidak melihat jejak
  form login sama sekali.
- Video karya memakai link YouTube/Vimeo (bukan upload file) supaya tidak
  membebani storage & kuota gratis Supabase.
- Untuk menambah admin lain, cukup tambahkan user baru lewat
  Supabase Dashboard > Authentication > Users — tidak perlu ubah kode.
- Bucket storage `portfolio-media` bersifat publik untuk dibaca (agar gambar
  bisa tampil di web), tapi hanya admin yang login yang bisa upload/hapus file.
