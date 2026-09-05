/* ClearDesk — cleardesk.co.nz
   Vanilla JS. No libraries. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Rotating announcement bar ---------- */
  var noticeMessages = [
    'UAE e-invoicing readiness: organise your invoice data, systems and provider pathway early.',
    'Finance automation, bookkeeping, tax preparation and dependable back-office support.',
    'Supporting businesses across New Zealand, the United Arab Emirates and Sri Lanka.'
  ];
  var firstHeader = document.querySelector('.site-header');
  if (firstHeader && !document.querySelector('.announcement-rotator')) {
    var notice = document.createElement('div');
    notice.className = 'announcement-rotator';
    notice.setAttribute('role', 'region');
    notice.setAttribute('aria-label', 'ClearDesk updates');
    notice.innerHTML = '<div class="container announcement-inner">' +
      '<span class="announcement-kicker">ClearDesk update</span>' +
      '<span class="announcement-text" aria-live="polite"></span>' +
      '<button class="announcement-toggle" type="button" aria-label="Pause rotating updates">Pause</button>' +
      '</div>';
    firstHeader.parentNode.insertBefore(notice, firstHeader);

    var noticeText = notice.querySelector('.announcement-text');
    var noticeToggle = notice.querySelector('.announcement-toggle');
    var noticeIndex = 0;
    var noticeTimer;
    var noticePaused = reduced;

    function showNotice(index, immediate) {
      noticeIndex = (index + noticeMessages.length) % noticeMessages.length;
      if (immediate || reduced) {
        noticeText.textContent = noticeMessages[noticeIndex];
        noticeText.classList.add('is-visible');
        return;
      }
      noticeText.classList.remove('is-visible');
      window.setTimeout(function () {
        noticeText.textContent = noticeMessages[noticeIndex];
        noticeText.classList.add('is-visible');
      }, 220);
    }

    function startNotices() {
      window.clearInterval(noticeTimer);
      if (noticePaused || reduced) return;
      noticeTimer = window.setInterval(function () {
        showNotice(noticeIndex + 1, false);
      }, 5200);
    }

    showNotice(0, true);
    startNotices();
    if (reduced) {
      noticeToggle.hidden = true;
      notice.classList.add('is-paused');
    } else {
      noticeToggle.addEventListener('click', function () {
        noticePaused = !noticePaused;
        notice.classList.toggle('is-paused', noticePaused);
        noticeToggle.textContent = noticePaused ? 'Play' : 'Pause';
        noticeToggle.setAttribute('aria-label', noticePaused ? 'Play rotating updates' : 'Pause rotating updates');
        startNotices();
      });
    }
  }

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
    var dropdown = item.querySelector('.dropdown');
    /* Normal navigation anchors must keep their native click behaviour. */
    if (!btn || !dropdown || btn.tagName.toLowerCase() !== 'button') return;
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

  /* Mark the current page without changing normal link behaviour. */
  Array.prototype.forEach.call(document.querySelectorAll('.nav-page-link'), function (link) {
    try {
      if (new URL(link.href, window.location.href).pathname === window.location.pathname) {
        link.classList.add('current');
        link.setAttribute('aria-current', 'page');
      }
    } catch (error) {}
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

  /* ---------- Mobile quick-reading experience ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.section .prose'), function (prose, index) {
    if (prose.textContent.trim().length < 680 || prose.classList.contains('mobile-readable')) return;
    prose.classList.add('mobile-readable', 'is-collapsed');
    if (!prose.id) prose.id = 'mobile-details-' + (index + 1);
    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'mobile-read-toggle';
    toggle.textContent = 'Show full details';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', prose.id);
    toggle.addEventListener('click', function () {
      var collapsed = prose.classList.toggle('is-collapsed');
      toggle.textContent = collapsed ? 'Show full details' : 'Show less';
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      if (collapsed) prose.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
    prose.appendChild(toggle);
  });

  Array.prototype.forEach.call(document.querySelectorAll('.section .grid.g3, .section .grid.g4'), function (grid) {
    var cards = Array.prototype.filter.call(grid.children, function (child) {
      return child.classList.contains('card');
    });
    if (cards.length < 3) return;
    grid.classList.add('mobile-card-rail');
    var hint = document.createElement('p');
    hint.className = 'mobile-swipe-hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.textContent = 'Swipe to explore  →';
    grid.parentNode.insertBefore(hint, grid);
  });

  Array.prototype.forEach.call(document.querySelectorAll('.site-footer .footer-grid h4 + ul'), function (list, index) {
    var heading = list.previousElementSibling;
    var label = heading.textContent.trim();
    var listId = 'footer-links-' + (index + 1);
    list.id = listId;
    list.classList.add('footer-fold-body');
    heading.textContent = '';
    var footerToggle = document.createElement('button');
    footerToggle.type = 'button';
    footerToggle.className = 'footer-fold-toggle';
    footerToggle.textContent = label;
    footerToggle.setAttribute('aria-expanded', 'false');
    footerToggle.setAttribute('aria-controls', listId);
    footerToggle.addEventListener('click', function () {
      var open = footerToggle.getAttribute('aria-expanded') === 'true';
      footerToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      list.classList.toggle('open', !open);
    });
    heading.appendChild(footerToggle);
  });

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
      var progress = carousel.querySelector('.assurance-progress span');
      if (progress && !reduced) {
        progress.style.animation = 'none';
        void progress.offsetWidth;
        progress.style.animation = 'assuranceProgress 5s linear forwards';
      }
    }
    function restart() {
      if (reduced) return;
      window.clearInterval(timer);
      timer = window.setInterval(function () { show(current + 1); }, 5000);
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
    carousel.addEventListener('mouseenter', function () {
      window.clearInterval(timer);
      carousel.classList.add('is-paused');
    });
    carousel.addEventListener('mouseleave', function () {
      carousel.classList.remove('is-paused');
      show(current);
      restart();
    });
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
