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
      ctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(3) + ')'; ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  }
  function init() { resize(); createStars(220); cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
  window.addEventListener('resize', function() { resize(); createStars(220); });
  init();
})();

/* ── Nav ── */
(function initNav() {
  const nav    = document.getElementById('mainNav');
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!nav) return;
  window.addEventListener('scroll', function() { nav.classList.toggle('scrolled', window.scrollY > 40); }, { passive: true });
  nav.classList.toggle('scrolled', window.scrollY > 40);
  if (toggle && links) {
    toggle.addEventListener('click', function() {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        links.classList.remove('open'); toggle.classList.remove('active');
      });
    });
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target)) { links.classList.remove('open'); toggle.classList.remove('active'); }
    });
  }
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', function() {
    let cur = '';
    sections.forEach(function(s) { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
    navLinks.forEach(function(l) { l.classList.toggle('active-link', l.getAttribute('href') === '#' + cur); });
  }, { passive: true });
})();

/* ── Scroll Reveal ── */
(function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;
  const obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function(el) { obs.observe(el); });
})();

/* ── Tabs ── */
(function initTabs() {
  const btns   = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  if (!btns.length) return;
  const colorMap = { comet: 'comet-active', eclipse: 'eclipse-active', supernova: 'supernova-active' };
  function activate(id) {
    btns.forEach(function(b) {
      const on = b.dataset.tab === id;
      b.classList.toggle('active', on);
      Object.values(colorMap).forEach(function(c) { b.classList.remove(c); });
      if (on) b.classList.add(colorMap[id] || '');
    });
    panels.forEach(function(p) { p.classList.toggle('active', p.id === 'tab-' + id); });
  }
  activate('comet');
  btns.forEach(function(b) { b.addEventListener('click', function() { activate(b.dataset.tab); }); });
})();

/* ── FAQ ── */
(function initFaq() {
  document.querySelectorAll('.faq-item').forEach(function(item) {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', function() {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ── Smooth scroll ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    });
  });
})();

/* ── Card tilt ── */
(function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.tier-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 16;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 16;
      card.style.transform = 'translateY(-10px) rotateX(' + (-y * 0.4) + 'deg) rotateY(' + (x * 0.4) + 'deg)';
    });
    card.addEventListener('mouseleave', function() { card.style.transform = ''; });
  });
})();

/* ── Nav style injection ── */
(function() {
  const s = document.createElement('style');
  s.textContent = '.nav-link.active-link{color:rgba(255,255,255,.9);background:rgba(255,255,255,.05)}.nav-toggle.active span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}.nav-toggle.active span:nth-child(2){opacity:0}.nav-toggle.active span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}.nav-toggle span{transform-origin:center;transition:transform .3s ease,opacity .3s ease}';
  document.head.appendChild(s);
})();

/* ════════════════════════════════════════════════════════
   CART — defined at module scope so all functions
   can reference each other without scope issues
   ════════════════════════════════════════════════════════ */

var cartItems = [];
var CART_KEY  = 'celestial_cart';
var EMOJIS    = { comet: '☄️', eclipse: '🌑', supernova: '🌟' };
var toastTimer;

function cartLoad() {
  try { cartItems = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch(e) { cartItems = []; }
}
function cartSave() {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
}
function cartTotal() {
  return cartItems.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
}
function cartCount() {
  return cartItems.reduce(function(s, i) { return s + i.qty; }, 0);
}

function cartUpdateBadge() {
  var n = cartCount();
  document.querySelectorAll('#navCartBadge').forEach(function(badge) {
    badge.textContent = n;
    badge.classList.toggle('visible', n > 0);
  });
}

function cartOpenDrawer() {
  var drawer  = document.getElementById('cartDrawer');
  var overlay = document.getElementById('cartOverlay');
  if (drawer)  drawer.classList.add('open');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  cartRender();
}

function cartCloseDrawer() {
  var drawer  = document.getElementById('cartDrawer');
  var overlay = document.getElementById('cartOverlay');
  if (drawer)  drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function cartUpdateCheckout() {
  var btn = document.getElementById('cartCheckoutBtn');
  if (!btn) return;
  var empty = cartItems.length === 0;
  btn.disabled       = empty;
  btn.style.opacity  = empty ? '0.4' : '1';
  btn.style.cursor   = empty ? 'not-allowed' : 'pointer';
}

function cartRender() {
  var list    = document.getElementById('cartItemsList');
  var empty   = document.getElementById('cartEmpty');
  var totalEl = document.getElementById('cartTotalAmount');
  if (!list) return;

  if (cartItems.length === 0) {
    list.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
  } else {
    if (empty) empty.classList.add('hidden');
    list.innerHTML = cartItems.map(function(item) {
      var emoji = EMOJIS[item.id] || '📦';
      var imgHtml = item.img
        ? '<img src="' + item.img + '" alt="' + item.name + '" class="cart-item-img" onerror="this.outerHTML=\'<div class=&quot;cart-item-img-placeholder&quot;>' + emoji + '</div>\'">'
        : '<div class="cart-item-img-placeholder">' + emoji + '</div>';
      return '<div class="cart-item" data-id="' + item.id + '">' +
        imgHtml +
        '<div class="cart-item-details">' +
          '<div class="cart-item-name">' + item.name + '</div>' +
          '<div class="cart-item-price">$' + (item.price * item.qty).toFixed(2) + '</div>' +
        '</div>' +
        '<div class="cart-item-controls">' +
          '<div class="cart-qty-row">' +
            '<button class="cart-qty-btn" onclick="cartUpdateQty(\'' + item.id + '\',-1)">−</button>' +
            '<span class="cart-qty-num">' + item.qty + '</span>' +
            '<button class="cart-qty-btn" onclick="cartUpdateQty(\'' + item.id + '\',1)">+</button>' +
          '</div>' +
          '<button class="cart-item-remove" onclick="cartRemoveItem(\'' + item.id + '\')">Remove</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }
  if (totalEl) totalEl.textContent = '$' + cartTotal().toFixed(2);
  cartUpdateCheckout();
}

function cartAddItem(id, name, price, img) {
  var existing = cartItems.find(function(i) { return i.id === id; });
  if (existing) existing.qty += 1;
  else cartItems.push({ id: id, name: name, price: parseFloat(price), img: img, qty: 1 });
  cartSave(); cartRender(); cartUpdateBadge();
  showToast((EMOJIS[id] || '✨') + ' ' + name + ' added to cart');
}

function cartRemoveItem(id) {
  cartItems = cartItems.filter(function(i) { return i.id !== id; });
  cartSave(); cartRender(); cartUpdateBadge();
}

function cartUpdateQty(id, delta) {
  var item = cartItems.find(function(i) { return i.id === id; });
  if (!item) return;
  item.qty = Math.max(0, item.qty + delta);
  if (item.qty === 0) cartRemoveItem(id);
  else { cartSave(); cartRender(); cartUpdateBadge(); }
}

function showToast(msg) {
  var toast = document.getElementById('cartToast');
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
  toastTimer = setTimeout(function() { toast.classList.remove('show'); }, 2800);
}

/* expose for inline onclick */
window.cartRemoveItem = cartRemoveItem;
window.cartUpdateQty  = cartUpdateQty;
window.Cart = { openDrawer: cartOpenDrawer, closeDrawer: cartCloseDrawer };

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', function() {
  cartLoad();
  cartUpdateBadge();
  cartRender();

  /* Cart icon buttons */
  document.querySelectorAll('#navCartBtn, .nav-cart-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      cartOpenDrawer();
    });
  });

  /* Close on overlay click */
  var overlay = document.getElementById('cartOverlay');
  if (overlay) overlay.addEventListener('click', cartCloseDrawer);

  /* Close button */
  var closeBtn = document.getElementById('cartCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', cartCloseDrawer);

  /* Continue shopping */
  var contBtn = document.getElementById('cartContinueBtn');
  if (contBtn) contBtn.addEventListener('click', cartCloseDrawer);

  /* Checkout */
  var checkoutBtn = document.getElementById('cartCheckoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      if (cartItems.length === 0) return;
      showToast('Redirecting to checkout…');
    });
  }

  /* Add to cart buttons */
  document.querySelectorAll('.add-to-cart-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var id    = btn.dataset.id;
      var name  = btn.dataset.name;
      var price = btn.dataset.price;
      var img   = btn.dataset.img;
      if (!id) return;
      cartAddItem(id, name, price, img);
      var orig = btn.innerHTML;
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Added!';
      btn.classList.add('added');
      setTimeout(function() { btn.innerHTML = orig; btn.classList.remove('added'); }, 1600);
    });
  });
});