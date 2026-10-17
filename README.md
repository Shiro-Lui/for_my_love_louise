# Website Permintaan Maaf untuk Loise

Website statis untuk menyampaikan permintaan maaf dan kesempatan kedua kepada Loise.

## Cara menjalankan

1. `npm install`
2. `npm run dev`
3. Buka alamat lokal yang ditampilkan di terminal.

## Konfigurasi URL QR Code

Sebelum menghasilkan QR Code final, atur environment variable:

```bash
VITE_PUBLIC_URL=https://USERNAME.github.io/NAMA-REPOSITORY/
npm run generate:qr
```

Atau edit `public/loise-qr.png` dengan hasil QR final setelah repository GitHub Pages aktif.

## Mengganti foto dummy

1. Buka folder `public/images/`
2. Ganti file `photo1.jpg` sampai `photo8.jpg` dengan foto yang Anda inginkan
3. Pastikan ukuran gambar masih proporsional untuk tampilan hati

## Deployment GitHub Pages

1. Push project ke repository GitHub.
2. Aktifkan GitHub Pages di Settings > Pages.
3. Jika ingin deployment otomatis, gunakan workflow GitHub Actions yang sudah disiapkan pada project.

## Catatan penting

- QR Code final hanya bisa dibuat setelah URL GitHub Pages yang benar diketahui.
- URL lokal atau `example.com` hanya untuk placeholder saat pengembangan.
