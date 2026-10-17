import galleryPhotoFiles from './gallery-photos.js';

const scenes = [...document.querySelectorAll('.scene')];
const countdownEls = [...document.querySelectorAll('.countdown-number')];
const introLines = [...document.querySelectorAll('.line')];
const galleryHeart = document.getElementById('gallery-heart');
const galleryNextButton = document.getElementById('gallery-next');
const photoViewer = document.getElementById('photo-viewer');
const photoViewerImage = document.getElementById('photo-viewer-image');
const photoCaption = document.getElementById('photo-caption');
const photoCloseButton = document.getElementById('photo-close');
const photoPreviousButton = document.getElementById('photo-previous');
const photoNextButton = document.getElementById('photo-next');
const photoCounter = galleryPhotoFiles.length;
const prevLetterButton = document.getElementById('prev-letter');
const nextLetterButton = document.getElementById('next-letter');
const letterSteps = [...document.querySelectorAll('.letter-step')];
const starsContainer = document.getElementById('stars');
const heartsContainer = document.getElementById('hearts');
let currentLetterIndex = 0;
let currentPhotoIndex = 0;

function setActiveScene(sceneName) {
  scenes.forEach((scene) => {
    scene.classList.toggle('active', scene.classList.contains(`${sceneName}-scene`));
  });
}

function runIntroSequence() {
  countdownEls.forEach((el, index) => {
    const ms = 500 + index * 950;

    setTimeout(() => {
      countdownEls.forEach((item) => item.classList.remove('active', 'glitch'));
      el.classList.add('active', 'glitch');

      setTimeout(() => {
        el.classList.remove('glitch');
      }, 520);
    }, ms);
  });

  introLines.forEach((line, index) => {
    setTimeout(() => {
      line.classList.add('visible');
    }, 3300 + index * 1300);
  });

  setTimeout(() => {
    setActiveScene('sky');
  }, 7200);

  setTimeout(() => {
    setActiveScene('letter');
  }, 10300);
}

function updateLetterView() {
  letterSteps.forEach((step, index) => {
    step.classList.toggle('active', index === currentLetterIndex);
  });

  prevLetterButton.disabled = currentLetterIndex === 0;
  nextLetterButton.textContent = currentLetterIndex === letterSteps.length - 1 ? 'Lanjut ke foto' : 'Lanjut';
}

prevLetterButton.addEventListener('click', () => {
  if (currentLetterIndex > 0) {
    currentLetterIndex -= 1;
    updateLetterView();
  }
});

nextLetterButton.addEventListener('click', () => {
  if (currentLetterIndex < letterSteps.length - 1) {
    currentLetterIndex += 1;
    updateLetterView();
    return;
  }

  setActiveScene('gallery');
});

galleryNextButton.addEventListener('click', () => {
  setActiveScene('closure');
});

function buildStarField() {
  const stars = Array.from({ length: 70 }, () => ({
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: `${(Math.random() * 3 + 1).toFixed(2)}px`,
    duration: `${(Math.random() * 3 + 2).toFixed(2)}s`,
    delay: `${(Math.random() * 2).toFixed(2)}s`,
  }));

  starsContainer.innerHTML = stars
    .map(
      (star) => `
        <span
          class="star"
          style="left:${star.x}; top:${star.y}; width:${star.size}; height:${star.size}; animation-duration:${star.duration}; animation-delay:${star.delay};"
        ></span>
      `
    )
    .join('');
}

function buildFloatingHearts() {
  const heartCount = 18;

  heartsContainer.innerHTML = Array.from({ length: heartCount }, () => {
    const x = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = 8 + Math.random() * 12;
    const left = `${(Math.random() * 100).toFixed(2)}vw`;
    const size = `${(Math.random() * 1.2 + 0.8).toFixed(2)}rem`;
    const shift = `${(Math.random() * 70 - 35).toFixed(2)}px`;

    return `
      <span
        class="floating-heart"
        style="left:${left}; bottom:-8%; font-size:${size}; animation-duration:${duration}s; animation-delay:${delay}s; --x-shift:${shift};"
      >❤</span>
    `;
  }).join('');
}

function buildGallery() {
  const rows = [
    { y: 20, start: 30, end: 70, weight: 0.2, count: 0 },
    { y: 40, start: 17, end: 83, weight: 0.35, count: 0 },
    { y: 60, start: 28, end: 72, weight: 0.3, count: 0 },
    { y: 80, start: 40, end: 60, weight: 0.15, count: 0 },
  ];
  let unplacedCount = galleryPhotoFiles.length;

  rows.forEach((row) => {
    row.count = Math.floor(galleryPhotoFiles.length * row.weight);
    unplacedCount -= row.count;
  });

  rows
    .map((row, index) => ({
      index,
      remainder: galleryPhotoFiles.length * row.weight - row.count,
    }))
    .sort((a, b) => b.remainder - a.remainder)
    .slice(0, unplacedCount)
    .forEach(({ index }) => {
      rows[index].count += 1;
    });

  const positions = rows.flatMap((row) =>
    Array.from({ length: row.count }, (_, index) => ({
      left: row.count === 1 ? 50 : row.start + ((row.end - row.start) * index) / (row.count - 1),
      top: row.y,
    }))
  );
  const minSpacing = Math.min(
    ...rows
      .filter((row) => row.count > 1)
      .map((row) => ((row.end - row.start) / (row.count - 1)) * 0.9)
  );
  const populatedRows = rows.filter((row) => row.count > 0);
  const minVerticalSpacing = Math.min(
    ...populatedRows.slice(1).map((row, index) => (row.y - populatedRows[index].y) * 0.82 * 0.9)
  );
  const photoWidth = Math.min(20, minSpacing, minVerticalSpacing);
  galleryHeart.style.setProperty('--gallery-photo-width', `${photoWidth}%`);

  galleryHeart.innerHTML = galleryPhotoFiles
    .map(
      (fileName, index) => `
        <button
          class="gallery-item"
          type="button"
          data-photo-index="${index}"
          aria-label="Lihat foto ke-${index + 1}"
          style="left:${positions[index].left}%; top:${positions[index].top}%; --delay:${index * 0.08}s; z-index:${index + 1};"
        >
          <img
            src="${import.meta.env.BASE_URL}picture/${encodeURIComponent(fileName)}"
            alt=""
            loading="lazy"
          />
        </button>
      `
    )
    .join('');
}

function showPhoto(index) {
  currentPhotoIndex = (index + photoCounter) % photoCounter;
  const fileName = galleryPhotoFiles[currentPhotoIndex];

  photoViewerImage.src = `${import.meta.env.BASE_URL}picture/${encodeURIComponent(fileName)}`;
  photoViewerImage.alt = `Foto ke-${currentPhotoIndex + 1}`;
  photoCaption.textContent = `Foto ${currentPhotoIndex + 1} dari ${photoCounter}`;

  if (!photoViewer.open) {
    photoViewer.showModal();
  }
}

galleryHeart.addEventListener('click', (event) => {
  const photoButton = event.target.closest('[data-photo-index]');
  if (photoButton) {
    showPhoto(Number(photoButton.dataset.photoIndex));
  }
});

photoCloseButton.addEventListener('click', () => photoViewer.close());
photoPreviousButton.addEventListener('click', () => showPhoto(currentPhotoIndex - 1));
photoNextButton.addEventListener('click', () => showPhoto(currentPhotoIndex + 1));

photoViewer.addEventListener('click', (event) => {
  if (event.target === photoViewer) {
    photoViewer.close();
  }
});

function init() {
  setActiveScene('intro');
  buildStarField();
  buildFloatingHearts();
  buildGallery();
  updateLetterView();
  runIntroSequence();
}

init();
