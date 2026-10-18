let THREE;
let FBXLoader;

const baseUrl = import.meta.env.BASE_URL;
const photoCount = 10;
const applicationWindow = document.getElementById('application-window');
const homePage = document.getElementById('home-page');
const pages = [...document.querySelectorAll('.app-page')];
const pageButtons = [...document.querySelectorAll('.nav-button')];
const windowContent = document.getElementById('window-content');
const heartSparkles = document.getElementById('heart-sparkles');
const reopenButton = document.getElementById('reopen-button');
const notePaper = document.getElementById('note-paper');
const notePageCount = document.getElementById('note-page-count');
const notePreviousButton = document.getElementById('note-previous');
const noteNextButton = document.getElementById('note-next');
const responseRow = document.getElementById('response-row');
const responseMessage = document.getElementById('response-message');
const whatsappLinks = document.getElementById('whatsapp-links');
const photoImage = document.getElementById('photo-image');
const photoCaption = document.getElementById('photo-caption');
const photoFrame = document.getElementById('photo-frame');
const photoOpenButton = document.getElementById('photo-open-button');
const photoViewer = document.getElementById('photo-viewer');
const photoViewerImage = document.getElementById('photo-viewer-image');
const photoViewerCaption = document.getElementById('photo-viewer-caption');
const photoViewerCloseButton = document.getElementById('photo-viewer-close');
const audio = document.getElementById('audio-player');
const audioFiles = document.getElementById('audio-files');
const trackTitle = document.getElementById('track-title');
const trackStatus = document.getElementById('track-status');
const audioProgress = document.getElementById('audio-progress');
const currentTimeLabel = document.getElementById('current-time');
const durationTimeLabel = document.getElementById('duration-time');
const playButton = document.getElementById('play-button');
const previousTrackButton = document.getElementById('track-previous');
const nextTrackButton = document.getElementById('track-next');
const playlistElement = document.getElementById('playlist');
const whatsappNumbers = ['6281297390010', '6285183190243'];

const notePages = [
  [
    'Hai, Louise ❤️',
    'Ada sesuatu yang selama ini ingin aku sampaikan kepadamu.',
  ],
  [
    'Aku minta maaf karena sudah mengecewakanmu.',
    'Aku sadar mungkin ada sikap dan perkataanku yang membuatmu terluka. Aku tidak ingin menganggap remeh perasaanmu, dan aku tahu sekadar meminta maaf tidak akan langsung memperbaiki semuanya.',
  ],
  [
    'Aku ingin belajar dari kesalahan yang pernah aku lakukan.',
    'Aku ingin menjadi seseorang yang lebih baik, lebih dewasa, lebih memahami perasaanmu, dan lebih bisa menjaga kepercayaanmu.',
  ],
  [
    'Jujur, sampai sekarang kamu masih berarti bagiku.',
    'Aku masih menyimpan harapan untuk bisa memperbaiki hubungan kita, bukan dengan mengulangi kesalahan yang sama, tetapi dengan berusaha menjadi lebih baik.',
  ],
  [
    'Louise, kalau masih ada kesempatan dan kamu juga menginginkannya,',
    'aku ingin kita mencoba kembali dari awal. Aku ingin kembali menjadi pacarmu, membangun hubungan yang lebih sehat, dan membuktikan lewat tindakan bahwa permintaan maafku bukan sekadar kata-kata.',
  ],
  [
    'Aku tidak ingin memaksamu menerima perasaanku.',
    'Aku hanya ingin jujur tentang apa yang ada di hatiku. Maafkan aku, Louise. ❤️',
  ],
  [
    'Maaf sudah mengecewakanmu.',
    'Aku ingin belajar dari kesalahanku dan membuktikan bahwa aku bisa menjadi lebih baik.',
    'Kalau masih ada kesempatan, aku ingin memperbaiki semuanya bersamamu.',
    'Louise, maukah kamu memberiku kesempatan untuk kembali menjadi pacarmu?',
  ],
];

const configuredTracks = [];
let activePageId = homePage.id;
let notePageIndex = 0;
let photoIndex = 0;
let transitionTimer;
let audioTracks = [...configuredTracks];
let activeTrackIndex = 0;
const bunnyAnimationTimers = new WeakMap();
const bunnyViewers = [];

function switchPage(pageId) {
  const nextPage = pages.find((page) => page.id === pageId);

  if (!nextPage || pageId === activePageId) {
    return;
  }

  closePhotoViewer(false);
  window.clearTimeout(transitionTimer);
  pages.forEach((page) => {
    if (page.id !== activePageId) {
      page.hidden = true;
      page.classList.remove('is-entering', 'is-leaving');
      page.setAttribute('aria-hidden', 'true');
    }
  });
  const currentPage = pages.find((page) => page.id === activePageId);
  if (currentPage) {
    if (currentPage.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    currentPage.classList.add('is-leaving');
    currentPage.setAttribute('aria-hidden', 'true');
  }

  nextPage.hidden = false;
  nextPage.setAttribute('aria-hidden', 'false');
  nextPage.classList.add('is-entering');
  activePageId = pageId;

  pageButtons.forEach((button) => {
    if (button.dataset.page === pageId) {
      button.setAttribute('aria-current', 'page');
    } else {
      button.removeAttribute('aria-current');
    }
  });

  windowContent.scrollTop = 0;
  transitionTimer = window.setTimeout(() => {
    if (currentPage) {
      currentPage.hidden = true;
      currentPage.classList.remove('is-leaving');
      currentPage.setAttribute('aria-hidden', 'true');
    }
    nextPage.classList.remove('is-entering');
  }, 400);
}

function renderNotePage() {
  notePaper.replaceChildren();

  notePages[notePageIndex].forEach((text, index) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;

    if (notePageIndex === 0 && index === 0) {
      paragraph.className = 'note-salutation';
    }
    if (notePageIndex === notePages.length - 1 && index === notePages[notePageIndex].length - 1) {
      paragraph.className = 'note-question';
    }

    notePaper.append(paragraph);
  });

  notePageCount.textContent = `${notePageIndex + 1} / ${notePages.length}`;
  notePreviousButton.disabled = notePageIndex === 0;
  noteNextButton.textContent =
    notePageIndex === notePages.length - 1 ? 'Pilihanmu ♡' : 'Selanjutnya →';
  responseRow.hidden = true;
  responseMessage.textContent = '';
  whatsappLinks.replaceChildren();
}

function showResponse(message) {
  responseMessage.textContent = message;
  whatsappLinks.replaceChildren();

  const instruction = document.createElement('span');
  instruction.textContent = 'Pesan siap dibuka:';
  whatsappLinks.append(instruction);

  whatsappNumbers.forEach((number, index) => {
    const link = document.createElement('a');
    link.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `WhatsApp ${index + 1}`;
    whatsappLinks.append(link);
  });

  responseMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showNoteChoices() {
  if (notePageIndex === notePages.length - 1) {
    responseRow.hidden = false;
  }
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

async function isDashMp4(file) {
  const header = new Uint8Array(await file.slice(4, 12).arrayBuffer());
  return (
    header.length === 8 &&
    String.fromCharCode(...header.slice(0, 4)) === 'ftyp' &&
    String.fromCharCode(...header.slice(4, 8)) === 'dash'
  );
}

function renderPlaylist() {
  playlistElement.replaceChildren();

  audioTracks.forEach((track, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `${index + 1}. ${track.title}`;
    button.setAttribute('aria-current', index === activeTrackIndex ? 'true' : 'false');
    button.addEventListener('click', () => loadTrack(index, true));
    item.append(button);
    playlistElement.append(item);
  });
}

function updateAudioControls() {
  const hasTracks = audioTracks.length > 0;
  const hasMultipleTracks = audioTracks.length > 1;

  playButton.disabled = false;
  previousTrackButton.disabled = !hasMultipleTracks;
  nextTrackButton.disabled = !hasMultipleTracks;
  audioProgress.disabled = !hasTracks || !Number.isFinite(audio.duration);
  playButton.classList.toggle('is-playing', !audio.paused);
  playButton.setAttribute(
    'aria-label',
    !hasTracks ? 'Pilih lagu untuk diputar' : audio.paused ? 'Putar musik' : 'Jeda musik'
  );
  renderPlaylist();
}

function loadTrack(index, shouldPlay = false) {
  if (index < 0 || index >= audioTracks.length) {
    return;
  }

  activeTrackIndex = index;
  const track = audioTracks[activeTrackIndex];
  audio.src = track.src;
  trackTitle.textContent = track.title;
  trackStatus.textContent = track.local
    ? 'Lagu pilihanmu siap diputar.'
    : 'Memuat lagu…';
  currentTimeLabel.textContent = '0:00';
  durationTimeLabel.textContent = '0:00';
  audioProgress.value = '0';
  updateAudioControls();

  if (shouldPlay) {
    audio.play().catch(() => {
      trackStatus.textContent = 'Lagu tidak dapat diputar. Coba pilih file audio lain.';
      updateAudioControls();
    });
  }
}

function changeTrack(direction) {
  if (audioTracks.length < 2) {
    return;
  }

  const nextIndex = (activeTrackIndex + direction + audioTracks.length) % audioTracks.length;
  loadTrack(nextIndex, true);
}

function updatePhoto(direction) {
  photoIndex = (photoIndex + direction + photoCount) % photoCount;
  photoFrame.style.setProperty('--photo-direction', direction > 0 ? '6px' : '-6px');
  photoFrame.classList.add('is-changing');

  window.setTimeout(() => {
    photoImage.src = `${baseUrl}images/photo${photoIndex + 1}.jpg`;
    photoImage.alt = `Foto kenangan ${photoIndex + 1}`;
    photoOpenButton.setAttribute('aria-label', `Perbesar foto kenangan ${photoIndex + 1}`);
    photoCaption.textContent = `Foto ${photoIndex + 1} dari ${photoCount}`;
    if (!photoViewer.hidden) {
      syncPhotoViewer();
    }
    photoFrame.classList.remove('is-changing');
  }, 180);
}

function syncPhotoViewer() {
  photoViewerImage.src = photoImage.src;
  photoViewerImage.alt = photoImage.alt;
  photoViewerCaption.textContent = photoCaption.textContent;
}

function openPhotoViewer() {
  syncPhotoViewer();
  photoViewer.hidden = false;
  photoViewer.focus();
  photoViewerCloseButton.focus();
}

function closePhotoViewer(restoreFocus = true) {
  if (photoViewer.hidden) {
    return;
  }

  photoViewer.hidden = true;
  photoViewerImage.removeAttribute('src');
  if (restoreFocus) {
    photoOpenButton.focus();
  }
}

function spawnHearts(event) {
  const target = event.target instanceof Element ? event.target.closest('button') : null;
  if (!target || target.disabled || target.id === 'close-button') {
    return;
  }

  const bounds = target.getBoundingClientRect();
  const centerX = bounds.left + bounds.width / 2;
  const centerY = bounds.top + bounds.height / 2;

  for (let index = 0; index < 3; index += 1) {
    const heart = document.createElement('span');
    heart.className = 'sparkle-heart';
    heart.textContent = index === 1 ? '♥' : '♡';
    heart.style.left = `${centerX + (index - 1) * 14}px`;
    heart.style.top = `${centerY}px`;
    heart.style.setProperty('--heart-drift', `${(index - 1) * 10}px`);
    heartSparkles.append(heart);
    window.setTimeout(() => heart.remove(), 800);
  }
}

document.querySelectorAll('.nav-button').forEach((button) => {
  button.addEventListener('click', () => switchPage(button.dataset.page));
});

document.getElementById('home-continue').addEventListener('click', () => switchPage('note-page'));
document.getElementById('mail-button').addEventListener('click', () => switchPage('note-page'));
document.getElementById('profile-button').addEventListener('click', () => switchPage('home-page'));

document.getElementById('close-button').addEventListener('click', () => {
  applicationWindow.classList.add('is-closed');
  reopenButton.hidden = false;
  reopenButton.focus();
});

reopenButton.addEventListener('click', () => {
  applicationWindow.classList.remove('is-closed');
  reopenButton.hidden = true;
  document.getElementById('close-button').focus();
});

notePreviousButton.addEventListener('click', () => {
  if (notePageIndex > 0) {
    notePageIndex -= 1;
    renderNotePage();
  }
});

noteNextButton.addEventListener('click', () => {
  if (notePageIndex < notePages.length - 1) {
    notePageIndex += 1;
    renderNotePage();
    return;
  }

  showNoteChoices();
});

document.getElementById('accept-button').addEventListener('click', () => {
  showResponse(
    'Terima kasih sudah memberiku kesempatan, Louise. Aku ingin menjalani semuanya dengan lebih baik, satu langkah demi satu langkah. ❤️'
  );
});

document.getElementById('delay-button').addEventListener('click', () => {
  showResponse(
    'Tidak apa-apa, Louise. Terima kasih sudah membaca sampai akhir. Aku akan menghargai waktumu dan keputusanmu. ❤️'
  );
});

document.getElementById('photo-previous').addEventListener('click', () => updatePhoto(-1));
document.getElementById('photo-next').addEventListener('click', () => updatePhoto(1));
photoOpenButton.addEventListener('click', openPhotoViewer);
photoViewerCloseButton.addEventListener('click', () => closePhotoViewer());
photoViewer.addEventListener('click', (event) => {
  if (event.target === photoViewer) {
    closePhotoViewer();
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !photoViewer.hidden) {
    closePhotoViewer();
  }
});

function createBunnyHeadPivots(model) {
  const rigs = [];
  model.updateMatrixWorld(true);

  ['bunny1', 'bunny2'].forEach((prefix) => {
    const makePivot = (matches) => {
      const parts = model.children.filter(
        (child) =>
          child.isMesh &&
          child.name.startsWith(`${prefix}_`) &&
          matches.some((part) => child.name.includes(part))
      );

      if (parts.length === 0) {
        return null;
      }

      const bounds = new THREE.Box3();
      parts.forEach((part) => bounds.union(new THREE.Box3().setFromObject(part)));
      const pivot = new THREE.Group();
      pivot.position.copy(bounds.getCenter(new THREE.Vector3()));
      model.add(pivot);

      const pivotOffset = new THREE.Matrix4().makeTranslation(
        -pivot.position.x,
        -pivot.position.y,
        -pivot.position.z
      );

      parts.forEach((part) => {
        part.updateMatrix();
        const localMatrix = pivotOffset.clone().multiply(part.matrix);
        model.remove(part);
        part.matrixAutoUpdate = false;
        part.matrix.copy(localMatrix);
        pivot.add(part);
      });

      return pivot;
    };

    const rig = {
      arms: makePivot(['arms']),
      body: makePivot(['body']),
      ears: makePivot(['ears']),
      eyes: makePivot(['eyes']),
      head: makePivot(['head', 'nose', 'eyebrow']),
      legs: makePivot(['legs']),
      scarf: makePivot(['scraf']),
      tail: makePivot(['tail']),
    };

    if (Object.values(rig).some(Boolean)) {
      rigs.push(rig);
    }
  });

  return rigs;
}

function reportBunnyLoadError(error) {
  console.error('Kelinci 3D gagal dimuat.', error);
  document.querySelectorAll('.bunny-trigger').forEach((button) => {
    button.disabled = true;
    const message = button.querySelector('.bunny-error');
    if (message) {
      message.hidden = false;
      message.textContent = 'Model kelinci 3D tidak dapat dimuat.';
    }
    button.setAttribute('aria-label', 'Model kelinci 3D tidak dapat dimuat');
  });
}

function resizeBunnyViewer(viewer) {
  const { width, height } = viewer.canvas.getBoundingClientRect();
  if (width <= 0 || height <= 0) {
    return;
  }

  viewer.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  viewer.renderer.setSize(width, height, false);
  viewer.camera.aspect = width / height;
  viewer.camera.updateProjectionMatrix();
}

async function initializeBunnyViewers() {
  const [threeModule, loaderModule] = await Promise.all([
    import('three'),
    import('three/addons/loaders/FBXLoader.js'),
  ]);
  THREE = threeModule;
  FBXLoader = loaderModule.FBXLoader;

  const bunnyArtwork = document.getElementById('bunny-artwork');

  document.querySelectorAll('.bunny-trigger').forEach((button) => {
    const artwork = bunnyArtwork.content.cloneNode(true);
    const canvas = artwork.querySelector('.bunny-art');
    button.disabled = true;
    button.setAttribute('aria-label', 'Memuat model kelinci 3D');
    button.append(artwork);

    try {
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0xffffff, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      const scene = new THREE.Scene();
      scene.add(new THREE.HemisphereLight(0xfff8f8, 0x9a7b82, 2.1));

      const keyLight = new THREE.DirectionalLight(0xfff7f2, 3.2);
      keyLight.position.set(-3, 5, 5);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xd8e4ff, 1.1);
      fillLight.position.set(4, 1, 3);
      scene.add(fillLight);

      const floorShadow = new THREE.Mesh(
        new THREE.CircleGeometry(0.48, 48),
        new THREE.MeshBasicMaterial({
          color: 0x9e6576,
          transparent: true,
          opacity: 0.14,
          depthWrite: false,
        })
      );
      floorShadow.rotation.x = -Math.PI / 2;
      floorShadow.position.y = -0.47;
      floorShadow.scale.set(1.5, 0.55, 1);
      scene.add(floorShadow);

      const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
      camera.position.set(0, 0, 2.1);
      camera.lookAt(0, 0, 0);

      const root = new THREE.Group();
      scene.add(root);
      const viewer = {
        button,
        camera,
        canvas,
        rigs: [],
        motion: null,
        visible: false,
        renderer,
        root,
        scene,
      };
      bunnyViewers.push(viewer);
      new ResizeObserver(() => resizeBunnyViewer(viewer)).observe(button);
      new IntersectionObserver(([entry]) => {
        viewer.visible = entry.isIntersecting;
      }).observe(button);
      resizeBunnyViewer(viewer);

      button.addEventListener('click', () => {
        if (!viewer.model) {
          return;
        }

        window.clearTimeout(bunnyAnimationTimers.get(button));
        const movement = button.dataset.nextMove === 'shake' ? 'shake' : 'nod';
        button.dataset.nextMove = movement === 'nod' ? 'shake' : 'nod';
        viewer.motion = { startedAt: performance.now(), type: movement };
        bunnyAnimationTimers.set(
          button,
          window.setTimeout(() => {
            button.classList.remove('is-bouncing', 'is-nodding', 'is-shaking');
            viewer.motion = null;
        }, 1050)
        );
        button.classList.remove('is-bouncing', 'is-nodding', 'is-shaking');
        void button.offsetWidth;
        button.classList.add('is-bouncing', `is-${movement === 'nod' ? 'nodding' : 'shaking'}`);
      });
    } catch (error) {
      reportBunnyLoadError(error);
    }
  });

  if (bunnyViewers.length === 0) {
    return;
  }

  const bunnyLoader = new FBXLoader();
  bunnyLoader.setResourcePath(`${baseUrl}models/bunny/textures/`);
  bunnyLoader.load(
    `${baseUrl}models/bunny/bunny_fbx.fbx`,
    (modelTemplate) => {
      bunnyViewers.forEach((viewer) => {
        const model = modelTemplate.clone(true);
        model.traverse((object) => {
          if (!object.isMesh) {
            return;
          }

          object.castShadow = true;
          object.receiveShadow = true;
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            if (material.map) {
              material.map.colorSpace = THREE.SRGBColorSpace;
            }
          });
        });

        viewer.rigs = createBunnyHeadPivots(model);
        model.scale.setScalar(0.00105);
        model.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(model);
        model.position.sub(bounds.getCenter(new THREE.Vector3()));
        viewer.root.add(model);
        viewer.model = model;
        viewer.button.disabled = false;
        viewer.button.setAttribute(
          'aria-label',
          'Kelinci 3D karya Minimoku, klik untuk membuatnya bergerak'
        );
      });
    },
    undefined,
    reportBunnyLoadError
  );

  function animateBunnies(timestamp) {
    window.requestAnimationFrame(animateBunnies);
    const seconds = timestamp / 1000;

    bunnyViewers.forEach((viewer, index) => {
      if (!viewer.model || !viewer.visible) {
        return;
      }

      const { root, rigs, motion } = viewer;
      const idleBob = Math.sin(seconds * 2.8 + index * 0.5);
      root.position.y = idleBob * 0.022;
      root.rotation.y = Math.sin(seconds * 1.15 + index) * 0.04;
      root.rotation.z = Math.sin(seconds * 1.8 + index * 0.7) * 0.022;

      rigs.forEach((rig, rigIndex) => {
        const phase = seconds * 2.2 + rigIndex * 0.65;
        if (rig.head) {
          rig.head.rotation.set(
            Math.sin(phase * 0.72) * 0.03,
            0,
            Math.sin(phase) * 0.05
          );
        }
        if (rig.ears) {
          rig.ears.rotation.z = Math.sin(phase * 1.4) * 0.09;
        }
        if (rig.arms) {
          rig.arms.rotation.z = Math.sin(phase * 1.5) * 0.1;
        }
        if (rig.legs) {
          rig.legs.rotation.x = Math.max(0, idleBob) * 0.075;
        }
        if (rig.tail) {
          rig.tail.rotation.x = Math.sin(phase * 2.1) * 0.14;
        }
        if (rig.scarf) {
          rig.scarf.rotation.z = Math.sin(phase * 1.8) * 0.06;
        }
        if (rig.eyes) {
          const blinkPhase = (seconds + rigIndex * 0.55) % 4.2;
          const blink = blinkPhase > 3.88 && blinkPhase < 3.98 ? 0.12 : 1;
          rig.eyes.scale.y = blink;
        }
        if (rig.body) {
          rig.body.scale.y = 1 + (Math.sin(phase * 1.1) + 1) * 0.006;
        }
      });

      if (motion) {
        const progress = Math.min((timestamp - motion.startedAt) / 1050, 1);
        const bounce = Math.sin(progress * Math.PI);
        const rhythm = bounce * Math.sin(progress * Math.PI * 4);
        root.position.y = idleBob * 0.022 + bounce * 0.2;
        root.rotation.z = bounce * -0.085;

        rigs.forEach((rig, rigIndex) => {
          const offset = rigIndex * 0.3;
          if (motion.type === 'nod') {
            if (rig.head) {
              rig.head.rotation.x += Math.sin(progress * Math.PI * 3 + offset) * 0.24;
              rig.head.rotation.z += bounce * 0.16;
            }
          } else if (rig.head) {
            rig.head.rotation.y = Math.sin(progress * Math.PI * 4 + offset) * 0.42;
          }
          if (rig.ears) {
            rig.ears.rotation.z += rhythm * 0.24;
          }
          if (rig.arms) {
            rig.arms.rotation.z += Math.sin(progress * Math.PI * 6 + offset) * bounce * 0.34;
          }
          if (rig.legs) {
            rig.legs.rotation.x += Math.sin(progress * Math.PI * 4 + offset) * bounce * 0.32;
          }
          if (rig.tail) {
            rig.tail.rotation.x += Math.sin(progress * Math.PI * 8 + offset) * bounce * 0.28;
          }
          if (rig.scarf) {
            rig.scarf.rotation.z += Math.sin(progress * Math.PI * 6 + offset) * bounce * 0.18;
          }
        });
      }

      viewer.renderer.render(viewer.scene, viewer.camera);
    });
  }

  window.requestAnimationFrame(animateBunnies);
}

initializeBunnyViewers().catch(reportBunnyLoadError);

audioFiles.addEventListener('change', async () => {
  const files = [...(audioFiles.files ?? [])];
  audioFiles.value = '';
  const validFiles = files.filter(
    (file) => file.type.startsWith('audio/') || file.name.toLowerCase().endsWith('.mp3')
  );

  if (validFiles.length === 0) {
    trackStatus.textContent = 'Pilih file audio berformat MP3 atau format audio umum.';
    audioFiles.value = '';
    return;
  }

  const dashFiles = new Set(
    (await Promise.all(validFiles.map(async (file) => (await isDashMp4(file)) ? file : null))).filter(
      (file) => file !== null
    )
  );
  const playableFiles = validFiles.filter((file) => !dashFiles.has(file));

  if (playableFiles.length === 0) {
    trackStatus.textContent =
      'File ini sebenarnya berformat MP4/DASH, bukan MP3 biasa. Konversikan ke MP3 standar atau pilih file audio lain.';
    return;
  }

  audio.pause();
  audioTracks
    .filter((track) => track.local)
    .forEach((track) => URL.revokeObjectURL(track.src));

  audioTracks = playableFiles.map((file) => ({
    title: file.name.replace(/\.[^.]+$/, ''),
    src: URL.createObjectURL(file),
    local: true,
  }));
  activeTrackIndex = 0;
  loadTrack(activeTrackIndex, true);
  trackStatus.textContent = dashFiles.size
    ? `Memutar ${audioTracks[activeTrackIndex].title}. File MP4/DASH dilewati karena tidak kompatibel.`
    : `Memutar ${audioTracks[activeTrackIndex].title}. File hanya digunakan di browser ini.`;
});

playButton.addEventListener('click', () => {
  if (!audioTracks.length) {
    trackStatus.textContent = 'Pilih file MP3 Westlife — My Love atau lagu lain dari perangkatmu.';
    audioFiles.click();
    return;
  }

  if (audio.paused) {
    audio.play().catch(() => {
      trackStatus.textContent = 'Browser tidak dapat memutar lagu ini. Coba pilih MP3 lain.';
      updateAudioControls();
    });
  } else {
    audio.pause();
    trackStatus.textContent = 'Lagu dijeda.';
  }
});

previousTrackButton.addEventListener('click', () => changeTrack(-1));
nextTrackButton.addEventListener('click', () => changeTrack(1));

audio.addEventListener('loadedmetadata', () => {
  durationTimeLabel.textContent = formatTime(audio.duration);
  if (audio.paused) {
    trackStatus.textContent = audioTracks[activeTrackIndex]?.local
      ? 'Lagu pilihanmu siap diputar.'
      : 'Lagu siap diputar.';
  }
  audioProgress.disabled = !Number.isFinite(audio.duration) || audio.duration <= 0;
});

photoImage.addEventListener('error', () => {
  photoImage.alt = 'Foto ini tidak dapat dimuat';
  photoCaption.textContent = 'Foto ini tidak dapat dimuat.';
});

audio.addEventListener('timeupdate', () => {
  currentTimeLabel.textContent = formatTime(audio.currentTime);
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audioProgress.value = String((audio.currentTime / audio.duration) * 1000);
  }
});

audio.addEventListener('play', () => {
  trackStatus.textContent = `Sedang diputar: ${audioTracks[activeTrackIndex]?.title ?? 'lagu pilihanmu'}.`;
  updateAudioControls();
});
audio.addEventListener('pause', () => {
  updateAudioControls();
});
audio.addEventListener('ended', () => {
  if (audioTracks.length > 1) {
    changeTrack(1);
  } else {
    trackStatus.textContent = 'Lagu selesai diputar.';
  }
});

audio.addEventListener('error', () => {
  if (audioTracks.length) {
    trackStatus.textContent = 'File audio tidak dapat dimuat. Pilih file MP3 lain.';
  }
});

audioProgress.addEventListener('input', () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(audioProgress.value) / 1000) * audio.duration;
  }
});

applicationWindow.addEventListener('click', spawnHearts);

document.getElementById('photo-image').src = `${baseUrl}images/photo1.jpg`;
renderNotePage();
renderPlaylist();
updateAudioControls();
