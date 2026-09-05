/* ClearDesk — cleardesk.co.nz
   Vanilla JS. No libraries. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Desktop dropdowns ---------- */
  var items = document.querySelectorAll('.nav-item');
  Array.prototype.forEach.call(items, function (item) {
    var btn = item.querySelector('.nav-link');
    if (!btn) return;
    var closeTimer;

    var open = function () {
      clearTimeout(closeTimer);
      Array.prototype.forEach.call(items, function (o) {
        if (o !== item) {
          o.classList.remove('open');
          var b = o.querySelector('.nav-link');
          if (b) b.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    };
    var close = function () {
      item.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    };

    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', function () {
      closeTimer = setTimeout(close, 140);
    });
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (item.classList.contains('open')) close(); else open();
    });
    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) close();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    Array.prototype.forEach.call(items, function (o) {
      o.classList.remove('open');
      var b = o.querySelector('.nav-link');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
    if (drawer && drawer.classList.contains('open')) closeDrawer();
  });

  /* ---------- Mobile drawer ---------- */
  var drawer = document.getElementById('mobileNav');
  var burger = document.getElementById('burger');
  var drawerClose = document.getElementById('mobileNavClose');
  var lastFocus = null;

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    document.body.classList.add('nav-open');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    var first = drawer.querySelector('button, a');
    if (first) first.focus();
    document.addEventListener('keydown', trapFocus);
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    document.body.classList.remove('nav-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', trapFocus);
    if (lastFocus) lastFocus.focus();
  }
  function trapFocus(e) {
    if (e.key !== 'Tab' || !drawer) return;
    var f = drawer.querySelectorAll('a[href], button:not([disabled])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  if (burger) burger.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawer) {
    Array.prototype.forEach.call(drawer.querySelectorAll('a'), function (a) {
      a.addEventListener('click', closeDrawer);
    });
  }

  /* ---------- Subtle reveal on scroll ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.section .card, .animate-in'), function (el, index) {
    el.classList.add('reveal');
    el.style.transitionDelay = Math.min(index % 4, 3) * 70 + 'ms';
  });
  var revealables = document.querySelectorAll('.reveal');
  if (revealables.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(revealables, function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
      Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
    }
  }

  /* ---------- FAQ accordion ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.faq-q'), function (q) {
    q.addEventListener('click', function () {
      var expanded = q.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(q.getAttribute('aria-controls'));
      q.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      if (panel) panel.classList.toggle('open', !expanded);
    });
  });

  /* ---------- Countdown ---------- */
  window.countdownTo = function (elementId, isoDate) {
    var el = document.getElementById(elementId);
    if (!el) return;
    var target = new Date(isoDate + 'T00:00:00Z').getTime();
    var render = function () {
      var days = Math.ceil((target - Date.now()) / 86400000);
      if (days > 1)      el.textContent = days.toLocaleString('en-NZ') + ' days';
      else if (days === 1) el.textContent = '1 day';
      else if (days === 0) el.textContent = 'today';
      else                 el.textContent = 'passed';
    };
    render();
    setInterval(render, 3600000);
  };

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('[data-countdown]'), function (el) {
      if (!el.id) el.id = 'cd-' + Math.random().toString(36).slice(2, 8);
      window.countdownTo(el.id, el.getAttribute('data-countdown'));
    });
  });

  /* ---------- Current year ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Smooth in-page links ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      t.setAttribute('tabindex', '-1');
      t.focus({ preventScroll: true });
      history.replaceState(null, '', id);
    });
  });

  /* ---------- Client assurance carousel ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-carousel]'), function (carousel) {
    var slides = carousel.querySelectorAll('.assurance-slide');
    var dotsWrap = carousel.querySelector('.assurance-dots');
    var current = 0;
    var timer;
    if (!slides.length) return;

    function show(index) {
      current = (index + slides.length) % slides.length;
      Array.prototype.forEach.call(slides, function (slide, i) {
        slide.classList.toggle('active', i === current);
        slide.setAttribute('aria-hidden', i === current ? 'false' : 'true');
      });
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
          dot.classList.toggle('active', i === current);
          dot.setAttribute('aria-current', i === current ? 'true' : 'false');
        });
      }
    }
    function restart() {
      if (reduced) return;
      window.clearInterval(timer);
      timer = window.setInterval(function () { show(current + 1); }, 6500);
    }
    if (dotsWrap) {
      Array.prototype.forEach.call(slides, function (_, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Show assurance ' + (i + 1));
        dot.addEventListener('click', function () { show(i); restart(); });
        dotsWrap.appendChild(dot);
      });
    }
    var prev = carousel.querySelector('[data-carousel-prev]');
    var next = carousel.querySelector('[data-carousel-next]');
    if (prev) prev.addEventListener('click', function () { show(current - 1); restart(); });
    if (next) next.addEventListener('click', function () { show(current + 1); restart(); });
    carousel.addEventListener('mouseenter', function () { window.clearInterval(timer); });
    carousel.addEventListener('mouseleave', restart);
    show(0);
    restart();
  });

  /* ---------- BOTIM app launcher ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    var launcher = document.createElement('a');
    launcher.className = 'quick-botim';
    launcher.href = 'https://botim.me/download/';
    launcher.setAttribute('data-botim', '');
    launcher.setAttribute('data-botim-number', '+642040101914');
    launcher.setAttribute('aria-label', 'Open BOTIM to contact ClearDesk on +64 20 4010 1914');
    launcher.innerHTML = '<span>Open BOTIM</span>';
    document.body.appendChild(launcher);

    var whatsapp = document.createElement('a');
    whatsapp.className = 'quick-whatsapp';
    whatsapp.href = 'https://wa.me/642040101914?text=' + encodeURIComponent('Hello ClearDesk, I would like to discuss your services.');
    whatsapp.setAttribute('aria-label', 'Contact ClearDesk on WhatsApp');
    whatsapp.innerHTML = '<span>WhatsApp</span>';
    document.body.appendChild(whatsapp);

    document.addEventListener('click', function (event) {
      var link = event.target.closest('[data-botim]');
      if (!link) return;
      event.preventDefault();
      var number = link.getAttribute('data-botim-number') || '+642040101914';
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(number).catch(function () {});
      }
      var timer;
      var stopFallback = function () {
        if (document.visibilityState === 'hidden' && timer) window.clearTimeout(timer);
      };
      document.addEventListener('visibilitychange', stopFallback, { once: true });
      window.location.href = 'botim://';
      timer = window.setTimeout(function () {
        if (document.visibilityState === 'visible') window.location.href = 'https://botim.me/download/';
      }, 1200);
    });
  });

  /* ---------- Static contact form: prepare an email ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var lines = [
        'Name: ' + (data.get('name') || ''),
        'Email: ' + (data.get('email') || ''),
        'Phone or BOTIM: ' + (data.get('phone') || ''),
        'Market: ' + (data.get('market') || ''),
        'Service: ' + (data.get('service') || ''),
        '',
        data.get('message') || ''
      ];
      var subject = 'ClearDesk enquiry from ' + (data.get('name') || 'website visitor');
      window.location.href = 'mailto:info@cleardesk.co.nz?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
    });
  });
})();
