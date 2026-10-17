const scenes = [...document.querySelectorAll('.scene')];
const countdownEls = [...document.querySelectorAll('.countdown-number')];
const introLines = [...document.querySelectorAll('.line')];
const galleryHeart = document.getElementById('gallery-heart');
const galleryNextButton = document.getElementById('gallery-next');
const prevLetterButton = document.getElementById('prev-letter');
const nextLetterButton = document.getElementById('next-letter');
const letterSteps = [...document.querySelectorAll('.letter-step')];
const starsContainer = document.getElementById('stars');
const heartsContainer = document.getElementById('hearts');

let currentLetterIndex = 0;
let introSequenceFinished = false;

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
    introSequenceFinished = true;
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
  const photoNames = Array.from(
    { length: 8 },
    (_, index) => `${import.meta.env.BASE_URL}images/photo${index + 1}.jpg`
  );
  const positions = [
    { left: '20%', top: '18%', angle: '-8deg', shift: '-10px', delay: '0s' },
    { left: '37%', top: '12%', angle: '10deg', shift: '12px', delay: '0.15s' },
    { left: '57%', top: '18%', angle: '-12deg', shift: '-14px', delay: '0.3s' },
    { left: '72%', top: '30%', angle: '8deg', shift: '14px', delay: '0.45s' },
    { left: '16%', top: '52%', angle: '9deg', shift: '-14px', delay: '0.6s' },
    { left: '34%', top: '62%', angle: '-10deg', shift: '8px', delay: '0.75s' },
    { left: '53%', top: '54%', angle: '12deg', shift: '-10px', delay: '0.9s' },
    { left: '68%', top: '62%', angle: '-7deg', shift: '12px', delay: '1.05s' },
  ];

  galleryHeart.innerHTML = photoNames
    .map(
      (src, index) => `
        <img
          class="gallery-item"
          src="${src}"
          alt="Foto ke-${index + 1}"
          style="left:${positions[index].left}; top:${positions[index].top}; --angle:${positions[index].angle}; --x-shift:${positions[index].shift}; --delay:${positions[index].delay};"
        />
      `
    )
    .join('');
}

function init() {
  setActiveScene('intro');
  buildStarField();
  buildFloatingHearts();
  buildGallery();
  updateLetterView();
  runIntroSequence();
}

init();
