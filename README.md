# Website Permintaan Maaf untuk Loise

Website statis untuk menyampaikan permintaan maaf dan kesempatan kedua kepada Loise.

## Cara menjalankan

1. `npm install`
2. `npm run dev`
3. Buka alamat lokal yang ditampilkan di terminal.

## Konfigurasi URL QR Code

Sebelum menghasilkan QR Code final, atur environment variable:

```bash
VITE_PUBLIC_URL=https://Shiro-Lui.github.io/for_my_love_louise/
npm run generate:qr
```

Atau edit `public/loise-qr.png` dengan hasil QR final setelah repository GitHub Pages aktif.

## Mengganti foto dummy

1. Buka folder `public/images/`
2. Ganti file `photo1.jpg` sampai `photo8.jpg` dengan foto yang Anda inginkan
3. Pastikan ukuran gambar masih proporsional untuk tampilan hati

## Deployment GitHub Pages

Workflow GitHub Actions akan membangun dan menerbitkan website setiap kali ada push ke branch `main`. Untuk repository ini, URL website adalah:

https://Shiro-Lui.github.io/for_my_love_louise/

Jika deployment gagal karena GitHub Pages belum diaktifkan, buka Settings > Pages, pilih **GitHub Actions** sebagai Build and deployment source, lalu jalankan ulang workflow **Deploy to GitHub Pages** dari tab Actions.

## Catatan penting

- Workflow membuat QR Code yang mengarah ke URL GitHub Pages repository ini.
