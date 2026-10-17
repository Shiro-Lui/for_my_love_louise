import fs from 'node:fs';
import path from 'node:path';
import QRCode from 'qrcode';

const targetUrl = process.env.VITE_PUBLIC_URL || 'https://example.com/loise';
const outputPath = path.resolve('public', 'loise-qr.png');

QRCode.toFile(
  outputPath,
  targetUrl,
  {
    type: 'png',
    width: 720,
    margin: 3,
    color: {
      dark: '#2e0c38',
      light: '#fff7fb',
    },
  },
  (error) => {
    if (error) {
      console.error('Gagal membuat QR Code:', error);
      process.exit(1);
    }

    console.log(`QR code berhasil dibuat: ${outputPath}`);
    console.log(`Target URL: ${targetUrl}`);
  }
);
