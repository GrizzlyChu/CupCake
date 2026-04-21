/* ════════════════════════════════════════════════════════
   CELESTIAL REPACKS — tier-page.js
   Carousel + Lightbox
   ════════════════════════════════════════════════════════ */

'use strict';

(function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const thumbs = document.querySelectorAll('.carousel-thumb');
  const counter = document.getElementById('slideNum');
  if (!slides.length) return;

  let current = 0;

  function goTo(n) {
    slides[current].classList.remove('active');
    thumbs[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    thumbs[current]?.classList.add('active');
    if (counter) counter.textContent = current + 1;
    // Scroll active thumb into view
    thumbs[current]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  // Expose globally for onclick handlers
  window.changeSlide = function(dir) { goTo(current + dir); };
  window.goToSlide   = function(n)   { goTo(n); };

  // Click main image to open lightbox
  slides.forEach(slide => {
    slide.addEventListener('click', () => {
      const src = slide.querySelector('img')?.src;
      if (src) openLightbox(src);
    });
    slide.style.cursor = 'zoom-in';
  });

  // Keyboard arrow navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  changeSlide(-1);
    if (e.key === 'ArrowRight') changeSlide(1);
  });

  // Touch/swipe support
  let touchStartX = 0;
  const stage = document.querySelector('.carousel-stage');
  if (stage) {
    stage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend',   e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) changeSlide(diff > 0 ? 1 : -1);
    });
  }
})();

/* ── Lightbox ── */
function openLightbox(src) {
  const lb  = document.getElementById('imgLightbox');
  const img = document.getElementById('lightboxImg');
  if (!lb || !img) return;
  img.src = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('imgLightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});