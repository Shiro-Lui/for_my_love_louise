# Website Permintaan Maaf untuk Loise

Website statis untuk menyampaikan permintaan maaf dan kesempatan kedua kepada Loise.

## Cara menjalankan

1. `npm install`
2. `npm run dev`
3. Buka alamat lokal yang ditampilkan di terminal.

## Konfigurasi URL QR Code

QR Code berbentuk hati dibuat dengan tingkat koreksi error tinggi agar tetap mudah dipindai. Sebelum membuat QR Code untuk alamat situs, atur environment variable:

```bash
VITE_PUBLIC_URL=https://Shiro-Lui.github.io/for_my_love_louise/
npm run generate:qr
```

Gambar QR Code tersimpan di `public/loise-qr.png`.

## Foto galeri

Letakkan semua foto galeri di folder `public/picture/`. Foto JPG, PNG, WebP, GIF, dan AVIF akan dimasukkan otomatis saat situs dijalankan atau dibangun. Urutan foto mengikuti nama file. Klik foto di susunan berbentuk hati untuk membukanya, lalu gunakan tombol sebelumnya/berikutnya untuk melihat foto lain.

## Deployment GitHub Pages

Workflow GitHub Actions akan membangun dan menerbitkan website setiap kali ada push ke branch `main`. Untuk repository ini, URL website adalah:

https://Shiro-Lui.github.io/for_my_love_louise/

Jika deployment gagal karena GitHub Pages belum diaktifkan, buka Settings > Pages, pilih **GitHub Actions** sebagai Build and deployment source, lalu jalankan ulang workflow **Deploy to GitHub Pages** dari tab Actions.

## Catatan penting

- Workflow membuat QR Code yang mengarah ke URL GitHub Pages repository ini.
