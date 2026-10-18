import fs from 'node:fs/promises';
import path from 'node:path';
import QRCode from 'qrcode';
import pngjs from 'pngjs';

const targetUrl = process.env.VITE_PUBLIC_URL || 'https://example.com/loise';
const outputPath = path.resolve('public', 'loise-qr.png');
const { PNG } = pngjs;
const imageSize = 720;
const quietZone = 4;
const qr = QRCode.create(targetUrl, { errorCorrectionLevel: 'H' });
const moduleCount = qr.modules.size;
const totalModules = moduleCount + quietZone * 2;
const moduleSize = imageSize / totalModules;
const image = new PNG({ width: imageSize, height: imageSize });
const lightColor = [255, 247, 251];
const darkColor = [46, 12, 56];
const backgroundColor = [245, 193, 219];

for (let pixelIndex = 0; pixelIndex < image.data.length; pixelIndex += 4) {
  image.data[pixelIndex] = backgroundColor[0];
  image.data[pixelIndex + 1] = backgroundColor[1];
  image.data[pixelIndex + 2] = backgroundColor[2];
  image.data[pixelIndex + 3] = 255;
}

function isInsideHeart(x, y) {
  const xSquared = x * x;
  const ySquared = y * y;

  return (xSquared + ySquared - 1) ** 3 - xSquared * ySquared * y <= 0;
}

function keepFinderPattern(row, column) {
  return (
    (row <= 7 && column <= 7) ||
    (row <= 7 && column >= moduleCount - 8) ||
    (row >= moduleCount - 8 && column <= 7)
  );
}

for (let y = 0; y < imageSize; y += 1) {
  const imageRow = Math.floor(y / moduleSize);
  const qrRow = imageRow - quietZone;

  for (let x = 0; x < imageSize; x += 1) {
    const imageColumn = Math.floor(x / moduleSize);
    const qrColumn = imageColumn - quietZone;
    const heartX = (((imageColumn + 0.5) / totalModules) * 2 - 1) * 1.125;
    const heartY = 1.25 - ((imageRow + 0.5) / totalModules) * 2.25;
    const inQr = qrRow >= 0 && qrRow < moduleCount && qrColumn >= 0 && qrColumn < moduleCount;
    const insideHeart = isInsideHeart(heartX, heartY);
    const keepFinder = inQr && keepFinderPattern(qrRow, qrColumn);

    if (!insideHeart && !keepFinder) {
      continue;
    }

    const pixelIndex = (y * imageSize + x) * 4;
    const isDarkModule = inQr && qr.modules.get(qrRow, qrColumn);
    const color = isDarkModule ? darkColor : lightColor;

    image.data[pixelIndex] = color[0];
    image.data[pixelIndex + 1] = color[1];
    image.data[pixelIndex + 2] = color[2];
    image.data[pixelIndex + 3] = 255;
  }
}

await fs.writeFile(outputPath, PNG.sync.write(image));
console.log(`Heart-shaped QR code created: ${outputPath}`);
console.log(`Target URL: ${targetUrl}`);
