# Website Permintaan Maaf untuk Louise

Website statis permintaan maaf untuk Louise, disajikan sebagai jendela aplikasi kawaii berwarna
pastel. Isi surat, pilihan respons, galeri foto, dan pemutar musik berada dalam satu pengalaman.

## Cara menjalankan

1. `npm install`
2. `npm run dev`
3. Buka alamat lokal yang ditampilkan di terminal.

## Foto kenangan

Halaman **Pict** menampilkan sepuluh foto kenangan di `public/images/photo1.jpg` sampai
`photo10.jpg`. Gunakan tombol panah untuk berpindah.

## Model kelinci 3D

Model FBX dan tekstur yang digunakan di website berada di `public/models/bunny/`. Model
dibuat oleh Minimoku; izin penggunaan dan publikasi di website telah dikonfirmasi oleh pemilik
project. Pertahankan kredit ini dan ikuti ketentuan lisensi sumber saat membagikan website.

## Menambahkan musik

Halaman **Kaseta** memutar file audio yang dipilih dari perangkat. Tekan tombol **Putar** untuk
memilih file MP3 Westlife — My Love atau lagu lain; lagu akan langsung diputar setelah dipilih.
Tombol **Pilih file MP3** juga dapat digunakan untuk mengganti atau memilih beberapa lagu.
Pemutar tetap berjalan saat berpindah ke halaman **Note** atau **Pict**. File yang dipilih hanya
tersedia di browser tersebut dan tidak diunggah ke server.

Untuk menyertakan lagu pada website yang di-deploy:

1. Buat folder `public/assets/music/` dan letakkan file audio yang boleh dibagikan di sana.
2. Buka `src/main.js` dan tambahkan setiap lagu ke array `configuredTracks`, misalnya:

   ```js
   const configuredTracks = [
     { title: 'Judul lagu', src: `${baseUrl}assets/music/01-song.mp3` },
   ];
   ```

3. Build dan deploy ulang website. Gunakan hanya audio yang Anda punya izin untuk dibagikan.

Website tidak menyertakan rekaman Westlife; untuk memutarnya, pilih file yang tersedia di perangkat.

## Deployment GitHub Pages

1. Push project ke repository GitHub.
2. Aktifkan GitHub Pages di Settings > Pages.
3. Jika ingin deployment otomatis, gunakan workflow GitHub Actions yang sudah disiapkan pada project.
