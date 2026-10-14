/**
 * ROYAL ENFIELD HERO SCROLL ANIMATION ENGINE
 * High-performance 300-Frame Sticky Scrollytelling
 */

const FRAME_COUNT = 300;
const canvas = document.getElementById('hero-canvas');
const context = canvas?.getContext('2d');
const heroSection = document.getElementById('hero-scroll-section');
const images = [];
let currentFrame = 1;
let targetFrame = 1;

// Load all 300 frames progressively
for (let i = 1; i <= FRAME_COUNT; i++) {
  const img = new Image();
  const frameNum = String(i).padStart(3, '0');
  img.src = `frames/ezgif-frame-${frameNum}.jpg`;

  if (i === 1) {
    img.onload = () => {
      renderFrame(1);
    };
  }
  images.push(img);
}

function resizeCanvas() {
  if (!canvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  renderFrame(Math.round(currentFrame));
}

function renderFrame(frameIndex) {
  if (!context || !canvas) return;

  const index = Math.min(FRAME_COUNT - 1, Math.max(0, frameIndex - 1));
  let img = images[index];

  // If this frame hasn't loaded yet, find closest loaded frame
  if (!img || !img.complete || img.naturalWidth === 0) {
    for (let offset = 1; offset < 30; offset++) {
      if (images[index - offset]?.complete && images[index - offset]?.naturalWidth > 0) {
        img = images[index - offset];
        break;
      }
      if (images[index + offset]?.complete && images[index + offset]?.naturalWidth > 0) {
        img = images[index + offset];
        break;
      }
    }
  }

  if (!img || !img.complete || img.naturalWidth === 0) return;

  const cw = canvas.width;
  const ch = canvas.height;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  // Cover calculation: scale proportionally to fill entire screen
  const scale = Math.max(cw / iw, ch / ih);
  const sw = iw * scale;
  const sh = ih * scale;
  const sx = (cw - sw) / 2;
  const sy = (ch - sh) / 2;

  context.clearRect(0, 0, cw, ch);
  context.drawImage(img, sx, sy, sw, sh);
}

function onScroll() {
  if (!heroSection) return;

  const rect = heroSection.getBoundingClientRect();
  const maxScroll = heroSection.offsetHeight - window.innerHeight;
  if (maxScroll <= 0) return;

  // Scroll offset within hero section
  const scrollOffset = -rect.top;
  const progress = Math.min(1, Math.max(0, scrollOffset / maxScroll));
  
  targetFrame = Math.min(FRAME_COUNT, Math.max(1, Math.ceil(progress * FRAME_COUNT)));

}

function loop() {
  // Smooth linear interpolation for inertia scrub
  const diff = targetFrame - currentFrame;
  if (Math.abs(diff) > 0.05) {
    currentFrame += diff * 0.22;
  } else {
    currentFrame = targetFrame;
  }

  const rounded = Math.round(currentFrame);
  renderFrame(rounded);

  requestAnimationFrame(loop);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('scroll', onScroll, { passive: true });

// Initialize
resizeCanvas();
onScroll();
requestAnimationFrame(loop);
