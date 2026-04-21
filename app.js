/* ════════════════════════════════════════════════════════
   CELESTIAL REPACKS — app.js
   ════════════════════════════════════════════════════════ */

'use strict';

/* ── Star Canvas ── */
(function initStars() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [], W, H, raf;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  function createStars(n) {
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      alpha: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.4 + 0.05,
      dir: Math.random() > 0.5 ? 1 : -1,
      phase: Math.random() * Math.PI * 2,
    }));
  }
  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    const now = t * 0.001;
    stars.forEach(s => {
      const a = s.alpha * (0.5 + 0.5 * Math.sin(now * s.speed * s.dir + s.phase));
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`; ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  }
  function init() { resize(); createStars(220); cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
  window.addEventListener('resize', () => { resize(); createStars(220); });
  init();
})();

/* ── Nav: scroll state + mobile toggle + active link ── */
(function initNav() {
  const nav    = document.getElementById('mainNav');
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!nav) return;

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('click', e => {
      if (!nav.contains(e.target)) {
        links.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Highlight active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  function updateActive() {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
    navLinks.forEach(l => l.classList.toggle('active-link', l.getAttribute('href') === `#${cur}`));
  }
  window.addEventListener('scroll', updateActive, { passive: true });
})();

/* ── Scroll Reveal ── */
(function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => obs.observe(el));
})();

/* ── Transparency Tabs ── */
(function initTabs() {
  const btns   = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  if (!btns.length) return;
  const colorMap = { comet: 'comet-active', eclipse: 'eclipse-active', supernova: 'supernova-active' };

  function activate(id) {
    btns.forEach(b => {
      const on = b.dataset.tab === id;
      b.classList.toggle('active', on);
      Object.values(colorMap).forEach(c => b.classList.remove(c));
      if (on) b.classList.add(colorMap[id] || '');
    });
    panels.forEach(p => p.classList.toggle('active', p.id === `tab-${id}`));
  }
  activate('comet');
  btns.forEach(b => b.addEventListener('click', () => activate(b.dataset.tab)));
})();

/* ── FAQ Accordion ── */
(function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;
  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ── Smooth scroll ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    });
  });
})();

/* ── Tier card tilt on mouse move ── */
(function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.tier-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 16;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 16;
      card.style.transform = `translateY(-10px) rotateX(${-y * 0.4}deg) rotateY(${x * 0.4}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ── Nav styles injection ── */
(function() {
  const s = document.createElement('style');
  s.textContent = [
    '.nav-link.active-link{color:rgba(255,255,255,.9);background:rgba(255,255,255,.05)}',
    '.nav-toggle.active span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}',
    '.nav-toggle.active span:nth-child(2){opacity:0}',
    '.nav-toggle.active span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}',
    '.nav-toggle span{transform-origin:center;transition:transform .3s ease,opacity .3s ease}',
  ].join('');
  document.head.appendChild(s);
})();

/* ════════════════════════════════════════════════════════
   CART SYSTEM
   ════════════════════════════════════════════════════════ */
const Cart = (function() {
  const STORAGE_KEY = 'celestial_cart';
  const EMOJIS = { comet: '☄️', eclipse: '🌑', supernova: '🌟' };
  let items = [];

  function load() {
    try { items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { items = []; }
  }
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
  function total() { return items.reduce((s, i) => s + i.price * i.qty, 0); }
  function count() { return items.reduce((s, i) => s + i.qty, 0); }

  function addItem(id, name, price, img) {
    const existing = items.find(i => i.id === id);
    if (existing) existing.qty += 1;
    else items.push({ id, name, price: parseFloat(price), img, qty: 1 });
    save(); render(); updateBadge();
    showToast(`${EMOJIS[id] || '✨'} ${name} added to cart`);
  }

  function removeItem(id) {
    items = items.filter(i => i.id !== id);
    save(); render(); updateBadge();
  }

  function updateQty(id, delta) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(0, item.qty + delta);
    if (item.qty === 0) removeItem(id);
    else { save(); render(); updateBadge(); }
  }

  function updateBadge() {
    document.querySelectorAll('#navCartBadge').forEach(badge => {
      const n = count();
      badge.textContent = n;
      badge.classList.toggle('visible', n > 0);
    });
  }

  function openDrawer() {
    document.getElementById('cartDrawer')?.classList.add('open');
    document.getElementById('cartOverlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    document.getElementById('cartDrawer')?.classList.remove('open');
    document.getElementById('cartOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function render() {
    const list    = document.getElementById('cartItemsList');
    const empty   = document.getElementById('cartEmpty');
    const totalEl = document.getElementById('cartTotalAmount');
    if (!list) return;

    if (items.length === 0) {
      list.innerHTML = '';
      empty?.classList.remove('hidden');
    } else {
      empty?.classList.add('hidden');
      list.innerHTML = items.map(item => `
        <div class="cart-item" data-id="${item.id}">
          ${item.img
            ? `<img src="${item.img}" alt="${item.name}" class="cart-item-img"
                onerror="this.outerHTML='<div class=\\'cart-item-img-placeholder\\'>${EMOJIS[item.id]||'📦'}</div>'">`
            : `<div class="cart-item-img-placeholder">${EMOJIS[item.id] || '📦'}</div>`}
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
          </div>
          <div class="cart-item-controls">
            <div class="cart-qty-row">
              <button class="cart-qty-btn" onclick="Cart.updateQty('${item.id}', -1)">−</button>
              <span class="cart-qty-num">${item.qty}</span>
              <button class="cart-qty-btn" onclick="Cart.updateQty('${item.id}', +1)">+</button>
            </div>
            <button class="cart-item-remove" onclick="Cart.removeItem('${item.id}')">Remove</button>
          </div>
        </div>
      `).join('');
    }
    if (totalEl) totalEl.textContent = `$${total().toFixed(2)}`;
  }

  let toastTimer;
  function showToast(msg) {
    let toast = document.getElementById('cartToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cartToast';
      toast.className = 'cart-toast';
      toast.innerHTML = '<span class="cart-toast-icon">✅</span><span class="cart-toast-msg"></span>';
      document.body.appendChild(toast);
    }
    toast.querySelector('.cart-toast-msg').textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  function init() {
    load(); updateBadge(); render();

    document.querySelectorAll('#navCartBtn').forEach(btn =>
      btn.addEventListener('click', openDrawer)
    );
    document.getElementById('cartCloseBtn')?.addEventListener('click', closeDrawer);
    document.getElementById('cartOverlay')?.addEventListener('click', closeDrawer);
    document.getElementById('cartContinueBtn')?.addEventListener('click', closeDrawer);
    document.getElementById('cartCheckoutBtn')?.addEventListener('click', () => {
      if (items.length === 0) return;
      showToast('Redirecting to checkout…');
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const { id, name, price, img } = btn.dataset;
        if (!id) return;
        addItem(id, name, price, img);
        const orig = btn.innerHTML;
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Added!';
        btn.classList.add('added');
        setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('added'); }, 1600);
      });
    });
  }

  return { init, addItem, removeItem, updateQty, openDrawer, closeDrawer };
})();

window.Cart = Cart;
document.addEventListener('DOMContentLoaded', () => Cart.init());