/* ------------------------------------------------------------------
   Mobile navigation
   ------------------------------------------------------------------ */
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

const setMenu = (open) => {
  nav.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
};

menuToggle.addEventListener('click', () => {
  setMenu(!nav.classList.contains('open'));
});

nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    setMenu(false);
    menuToggle.focus();
  }
});

document.addEventListener('click', (event) => {
  if (!nav.classList.contains('open')) return;
  if (!nav.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false);
});

// Rotating a phone or resizing to desktop must not leave the panel stranded open.
window.matchMedia('(min-width: 701px)').addEventListener('change', (event) => {
  if (event.matches) setMenu(false);
});

/* ------------------------------------------------------------------
   Sticky header separator
   ------------------------------------------------------------------ */
const sentinel = document.createElement('div');
sentinel.setAttribute('aria-hidden', 'true');
sentinel.style.height = '1px';
header.before(sentinel);

new IntersectionObserver(
  ([entry]) => header.classList.toggle('is-stuck', !entry.isIntersecting),
  { threshold: 1 }
).observe(sentinel);

/* ------------------------------------------------------------------
   Deferred video playback — only load and play when visible, and never
   on reduced-motion or data-saver setups.
   ------------------------------------------------------------------ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const savesData = navigator.connection?.saveData === true;
const videos = document.querySelectorAll('.lazy-video');

if (!prefersReducedMotion && !savesData) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (!video.src && video.dataset.src) video.src = video.dataset.src;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { rootMargin: '200px 0px', threshold: 0.25 }
  );

  videos.forEach((video) => videoObserver.observe(video));
} else {
  // Still show a still frame rather than an empty box.
  videos.forEach((video) => {
    video.preload = 'metadata';
    video.controls = true;
    video.removeAttribute('aria-hidden');
    if (video.dataset.src) video.src = video.dataset.src;
  });
}

