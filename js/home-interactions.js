document.querySelector('.hero-copy .actions button')?.addEventListener('click', () => document.querySelector('#lab9-video').scrollIntoView({ behavior: 'smooth' }));
document.querySelector('.announcement-close')?.addEventListener('click', () => document.querySelector('.announcement').remove());
const slides = [...document.querySelectorAll('.slider-slide')];
let slideIndex = 0;
function showSlide(index) {
  slideIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, position) => {
    slide.classList.toggle('is-active', position === slideIndex);
    slide.setAttribute('aria-hidden', String(position !== slideIndex));
  });
  document.querySelector('.slider-status').textContent = (slideIndex + 1) + ' / ' + slides.length;
}
document.querySelector('#slider-previous').addEventListener('click', () => showSlide(slideIndex - 1));
document.querySelector('#slider-next').addEventListener('click', () => showSlide(slideIndex + 1));
showSlide(0);
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setInterval(() => { if (!document.hidden) showSlide(slideIndex + 1); }, 6000);
}

const galleryImages = [
  ['images/hero.png', 'Students working together'],
  ['images/premium.png', 'Online course discussion'],
  ['images/discover.png', 'Learning workspace'],
  ['images/join.png', 'Students collaborating'],
  ['images/benefits.png', 'Course benefits'],
  ['images/blog-1.png', 'Creative learning'],
  ['images/blog-2.png', 'Design practice'],
  ['images/blog-3.png', 'Digital skills'],
  ['images/course-1.png', 'Webflow basics'],
  ['images/course-2.png', 'Webflow interactions']
];
const galleryPhoto = document.querySelector('#gallery-photo');
const galleryThumbs = document.querySelector('#gallery-thumbs');
const galleryStatus = document.querySelector('#gallery-status');
let galleryIndex = 0;
let galleryRevision = 0;
let galleryPlaying = false;
let galleryTimer;
let audio;
function playImageSound(index) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audio ||= new AudioContext();
  if (audio.state === 'suspended') audio.resume();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = ['sine', 'triangle', 'square'][index % 3];
  oscillator.frequency.value = 220 + index * 47;
  gain.gain.setValueAtTime(0.0001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.06, audio.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.22);
  oscillator.connect(gain).connect(audio.destination);
  oscillator.start();
  oscillator.stop(audio.currentTime + 0.24);
}
function showGallery(index, withSound = false) {
  galleryIndex = index;
  const [src, alt] = galleryImages[index];
  const revision = ++galleryRevision;
  galleryPhoto.classList.add('is-changing');
  const next = new Image();
  next.onload = () => {
    if (revision !== galleryRevision) return;
    setTimeout(() => {
      if (revision !== galleryRevision) return;
      galleryPhoto.src = src;
      galleryPhoto.alt = alt;
      requestAnimationFrame(() => galleryPhoto.classList.remove('is-changing'));
    }, 180);
  };
  next.src = src;
  galleryStatus.textContent = (index + 1) + ' / ' + galleryImages.length + ' · ' + alt;
  [...galleryThumbs.children].forEach((button, position) => {
    button.classList.toggle('is-current', position === index);
    button.setAttribute('aria-pressed', String(position === index));
  });
  if (withSound) playImageSound(index);
}
function nextRandom(withSound = false) {
  const offset = 1 + Math.floor(Math.random() * (galleryImages.length - 1));
  showGallery((galleryIndex + offset) % galleryImages.length, withSound);
}
for (const [index, [src, alt]] of galleryImages.entries()) {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', 'Show image ' + (index + 1) + ': ' + alt);
  const image = document.createElement('img');
  image.src = src;
  image.alt = '';
  button.append(image);
  button.addEventListener('click', () => nextRandom(true));
  galleryThumbs.append(button);
}
document.querySelector('#gallery-random').addEventListener('click', () => nextRandom(true));
document.querySelector('#gallery-sound').addEventListener('click', () => playImageSound(galleryIndex));
const galleryPlay = document.querySelector('#gallery-play');
galleryPlay.addEventListener('click', () => {
  galleryPlaying = !galleryPlaying;
  galleryPlay.textContent = galleryPlaying ? 'Pause' : 'Play';
  galleryPlay.setAttribute('aria-pressed', String(galleryPlaying));
  clearInterval(galleryTimer);
  if (galleryPlaying) galleryTimer = setInterval(() => { if (!document.hidden) nextRandom(); }, 4000);
});
showGallery(0);

const videoButton = document.querySelector('#video-poster');
videoButton.addEventListener('click', async () => {
  videoButton.disabled = true;
  const status = document.querySelector('#video-status');
  status.textContent = 'Preparing a short local video…';
  if (!HTMLCanvasElement.prototype.captureStream || !window.MediaRecorder) {
    status.textContent = 'Video recording is not supported in this browser.';
    videoButton.disabled = false;
    return;
  }
  const image = new Image();
  image.src = videoButton.querySelector('img').src;
  await image.decode();
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 360;
  const context = canvas.getContext('2d');
  const stream = canvas.captureStream(24);
  const recorder = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp8') ? 'video/webm;codecs=vp8' : 'video/webm' });
  const chunks = [];
  recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
  recorder.onstop = () => {
    stream.getTracks().forEach(track => track.stop());
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.poster = image.src;
    video.setAttribute('aria-label', 'Learnico course preview video');
    video.src = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType }));
    video.addEventListener('loadeddata', () => video.play().catch(() => {}), { once: true });
    video.addEventListener('emptied', () => URL.revokeObjectURL(video.src), { once: true });
    videoButton.replaceWith(video);
    status.textContent = 'Use the video controls to replay or pause.';
  };
  recorder.start();
  const started = performance.now();
  function draw(now) {
    const progress = Math.min(1, (now - started) / 2800);
    const zoom = 1 + progress * 0.1;
    const width = canvas.width * zoom;
    const height = canvas.height * zoom;
    context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
    context.fillStyle = 'rgba(0, 53, 59, .55)';
    context.fillRect(0, 270, 640, 90);
    context.fillStyle = '#fff';
    context.font = 'bold 32px sans-serif';
    const videoText = document.documentElement.lang === 'ru' ? 'Learnico · Начните учиться' : 'Learnico · Start learning';
    context.fillText(videoText, 28, 325);
    if (progress < 1) requestAnimationFrame(draw);
    else recorder.stop();
  }
  requestAnimationFrame(draw);
});

const motionAllowed = !matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = [...document.querySelectorAll('.reveal')];
if (motionAllowed && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
  document.body.classList.add('has-motion');
}

const counters = [...document.querySelectorAll('[data-count]')];
function animateCounter(node) {
  const target = Number(node.dataset.count);
  const suffix = node.dataset.suffix || '';
  const start = performance.now();
  function tick(now) {
    const progress = Math.min(1, (now - start) / 1000);
    node.textContent = Math.round(target * (1 - (1 - progress) ** 3)).toLocaleString(document.documentElement.lang === 'ru' ? 'ru-RU' : 'en-US') + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
if ('IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      if (motionAllowed) animateCounter(entry.target);
      else entry.target.textContent = Number(entry.target.dataset.count).toLocaleString(document.documentElement.lang === 'ru' ? 'ru-RU' : 'en-US') + (entry.target.dataset.suffix || '');
      counterObserver.unobserve(entry.target);
    }
  }, { threshold: 0.4 });
  counters.forEach(item => counterObserver.observe(item));
}

if (motionAllowed) {
  const hero = document.querySelector('.hero');
  const layers = [...document.querySelectorAll('[data-parallax]')];
  let queued = false;
  function updateParallax() {
    const rect = hero.getBoundingClientRect();
    const travel = Math.max(-250, Math.min(250, -rect.top));
    for (const layer of layers) layer.style.setProperty('--parallax-y', travel * Number(layer.dataset.parallax) + 'px');
    queued = false;
  }
  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(updateParallax); }
  }, { passive: true });
  updateParallax();
}
