# Website Permintaan Maaf untuk Loise

Website statis untuk menyampaikan permintaan maaf dan kesempatan kedua kepada Loise.

## Cara menjalankan

1. `npm install`
2. `npm run dev`
3. Buka alamat lokal yang ditampilkan di terminal.

## Konfigurasi URL QR Code

QR Code hati dihasilkan menggunakan [QR Studio](https://qr-studio.app/heart-shaped-qr-code.php) dengan alamat GitHub Pages situs ini, lalu disimpan sebagai gambar statis:

`public/loise-qr.png`

Saat memperbarui QR, buat kode hati baru di QR Studio dan ganti gambar tersebut. GitHub Actions akan menerbitkan file apa adanya tanpa membuat ulang QR.

## Foto galeri

Letakkan semua foto galeri di folder `public/picture/`. Foto JPG, PNG, WebP, GIF, dan AVIF akan dimasukkan otomatis saat situs dijalankan atau dibangun. Urutan foto mengikuti nama file. Klik foto di susunan berbentuk hati untuk membukanya, lalu gunakan tombol sebelumnya/berikutnya untuk melihat foto lain.

## Deployment GitHub Pages

Workflow GitHub Actions akan membangun dan menerbitkan website setiap kali ada push ke branch `main`. Untuk repository ini, URL website adalah:

https://Shiro-Lui.github.io/for_my_love_louise/

Jika deployment gagal karena GitHub Pages belum diaktifkan, buka Settings > Pages, pilih **GitHub Actions** sebagai Build and deployment source, lalu jalankan ulang workflow **Deploy to GitHub Pages** dari tab Actions.

## Catatan penting

- File QR statis di `public/loise-qr.png` mengarah ke URL GitHub Pages repository ini.
