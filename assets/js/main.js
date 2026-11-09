/* ClearDesk — cleardesk.co.nz
   Vanilla JS. No libraries. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Rotating announcement bar ---------- */
  var noticeMessages = [
  {
    "market": "NZ",
    "text": "5 December 2026: deductions for wages and salaries paid from 16–30 November are due for large employers.",
    "url": "https://www.ird.govt.nz/employing-staff/payday-filing/paying-deductions-to-inland-revenue"
  },
  {
    "market": "NZ",
    "text": "30 November 2026: GST return and payment are due for registered businesses with a taxable period ending 31 October.",
    "url": "https://www.ird.govt.nz/gst/filing-and-paying-gst-and-refunds"
  },
  {
    "market": "NZ",
    "text": "30 November 2026: AIM instalments are due for monthly GST filers with a March balance date.",
    "url": "https://www.ird.govt.nz/income-tax/provisional-tax/paying-your-provisional-tax/payment-dates-for-provisional-tax"
  },
  {
    "market": "NZ",
    "text": "3 November 2026: MBIE launched a trial of the NZBN Business Passport, a mobile digital credential for verifying business identity and authority. The initial trial is limited to selected Westpac business customers.",
    "url": "https://www.mbie.govt.nz/about/news/new-digital-credential-cuts-paperwork-for-kiwi-businesses"
  },
  {
    "market": "NZ",
    "text": "20 November 2026: October deductions are due for small-to-medium employers, and 1–15 November deductions are due for large employers.",
    "url": "https://www.ird.govt.nz/employing-staff/payday-filing/paying-deductions-to-inland-revenue"
  },
  {
    "market": "UAE",
    "text": "In-scope businesses below AED 50m revenue: appoint an e-invoicing ASP by 31 March 2027; implement from 1 July 2027. Exclusions apply.",
    "url": "https://mof.gov.ae/en/news/ministry-of-finance-announces-the-issuance-of-two-ministerial-decisions-on-the-scope-of-obligations-and-the-timelines-for-implementing-the-electronic-invoicing-system-2/"
  },
  {
    "market": "UAE",
    "text": "Small Business Relief: eligible resident persons with revenue up to AED 3m may elect for qualifying tax periods ending by 31 December 2029. Exclusions and conditions apply.",
    "url": "https://mof.gov.ae/en/news/ministry-of-finance-announces-extension-of-small-business-relief-for-corporate-tax-purposes-until-31-december-2029/"
  },
  {
    "market": "UAE",
    "text": "From 1 January 2027: transactions between members of the same Tax Group are temporarily excluded from e-invoicing for 24 months. UAE-local data storage is no longer required, but retention and FTA access duties remain.",
    "url": "https://mof.gov.ae/en/news/ministry-of-finance-amends-electronic-invoicing-regulations-to-ease-the-burden-on-businesses/"
  },
  {
    "market": "UAE",
    "text": "30 October 2026: UAE e-invoicing implementation penalties were revised to AED 5,000 initially, then AED 5,000 per month, capped at AED 50,000 over 12 consecutive months. The system-failure notification penalty was removed.",
    "url": "https://mof.gov.ae/en/news/mof-announces-updated-administrative-penalties-related-to-the-uae-einvoicing-system-to-enhance-clarity-and-support-business-compliance/"
  },
  {
    "market": "UAE",
    "text": "30 November 2026: the FTA lists the next VAT-return deadline for affected registrants. Confirm your assigned tax period in EmaraTax; any VAT payment is generally due with the return.",
    "url": "https://www.tax.gov.ae/en/content/final.deadline.for.filling.vat.returns.aspx"
  }
];
  var pageMarket = document.body && document.body.getAttribute('data-market');
  var noticePath = window.location.pathname;
  if (/(^|\/)uae(\/|$)/.test(noticePath)) pageMarket = 'uae';
  else if (/(^|\/)nz(\/|$)/.test(noticePath) || noticePath === '/' || noticePath === '/index.html') pageMarket = 'nz';
  if (pageMarket === 'nz' || pageMarket === 'uae') {
    noticeMessages = noticeMessages.filter(function (message) {
      return message.market.toLowerCase() === pageMarket;
    });
  }

  /* Keep the complete NZ service range discoverable across older and newer page headers. */
  if (pageMarket === 'nz') {
    var mobileServices = document.querySelector('.mobile-nav-body h4 + ul');
    var nzServiceLinks = [
      ['/nz/accounting-firms/', 'Support for accounting firms', 'Confidential capacity behind your practice'],
      ['/nz/website-development/', 'Website development', 'Practical, mobile-friendly business websites'],
      ['/nz/social-media-marketing/', 'Social media marketing', 'Useful content and a consistent presence'],
      ['/nz/ai-integration/', 'AI integration advice', 'Safer, practical help for everyday admin']
    ];
    if (mobileServices) {
      nzServiceLinks.forEach(function (service) {
        if (!mobileServices.querySelector('a[href="' + service[0] + '"]')) {
          var item = document.createElement('li');
          item.innerHTML = '<a href="' + service[0] + '">' + service[1] + '</a>';
          mobileServices.appendChild(item);
        }
      });
    }
    var desktopServices = document.querySelector('.site-header .dropdown');
    if (desktopServices) {
      nzServiceLinks.forEach(function (service) {
        if (!desktopServices.querySelector('a[href="' + service[0] + '"]')) {
          var desktopItem = document.createElement('li');
          desktopItem.innerHTML = '<a href="' + service[0] + '"><b>' + service[1] + '</b><span>' + service[2] + '</span></a>';
          desktopServices.appendChild(desktopItem);
        }
      });
    }
  }
  var firstHeader = document.querySelector('.site-header');
  if (firstHeader && !document.querySelector('.announcement-rotator')) {
    var notice = document.createElement('div');
    notice.className = 'announcement-rotator';
    notice.setAttribute('role', 'region');
    notice.setAttribute('aria-label', 'ClearDesk updates');
    notice.innerHTML = '<div class="container announcement-inner">' +
      '<span class="announcement-kicker">Business Updates</span>' +
      '<span class="announcement-copy">' +
        '<span class="announcement-market"></span>' +
        '<a class="announcement-text"></a>' +
      '</span>' +
      '<button class="announcement-next announcement-toggle" type="button" aria-label="Next business update">Next</button>' +
      '<button class="announcement-toggle" type="button" aria-label="Pause rotating updates">Pause</button>' +
      '<small class="announcement-disclaimer">General information; check your circumstances and official guidance.</small>' +
      '</div>';
    firstHeader.parentNode.insertBefore(notice, firstHeader);

    var noticeCopy = notice.querySelector('.announcement-copy');
    var noticeMarket = notice.querySelector('.announcement-market');
    var noticeText = notice.querySelector('.announcement-text');
    var noticeToggle = notice.querySelector('.announcement-toggle:not(.announcement-next)');
    var noticeIndex = 0;
    var noticeTimer;
    var noticePaused = reduced;

    function showNotice(index, immediate) {
      noticeIndex = (index + noticeMessages.length) % noticeMessages.length;
      var message = noticeMessages[noticeIndex];
      var updateMessage = function () {
        noticeMarket.textContent = message.market;
        noticeMarket.className = 'announcement-market market-' + message.market.toLowerCase();
        noticeText.textContent = message.text;
        noticeText.href = message.url;
        noticeText.setAttribute('aria-label', message.market + ': ' + message.text + ' Read official guidance.');
      };
      if (immediate || reduced) {
        updateMessage();
        noticeCopy.classList.add('is-visible');
        return;
      }
      noticeCopy.classList.remove('is-visible');
      window.setTimeout(function () {
        updateMessage();
        noticeCopy.classList.add('is-visible');
      }, 220);
    }

    function startNotices() {
      window.clearInterval(noticeTimer);
      notice.classList.remove('is-running');
      void notice.offsetWidth;
      if (noticePaused || notice.contains(document.activeElement) || notice.matches(':hover')) return;
      notice.classList.add('is-running');
      noticeTimer = window.setInterval(function () {
        showNotice(noticeIndex + 1, false);
      }, 8000);
    }

    showNotice(0, true);
    startNotices();
    function syncNoticeControl() {
      notice.classList.toggle('is-paused', noticePaused);
      noticeToggle.textContent = noticePaused ? 'Resume' : 'Pause';
      noticeToggle.setAttribute('aria-label', noticePaused ? 'Resume rotating updates' : 'Pause rotating updates');
    }
    syncNoticeControl();
    noticeToggle.addEventListener('click', function () {
      noticePaused = !noticePaused;
      syncNoticeControl();
      startNotices();
    });
    notice.querySelector('.announcement-next').addEventListener('click', function () {
      showNotice(noticeIndex + 1, true);
      startNotices();
    });
    notice.addEventListener('focusin', startNotices);
    notice.addEventListener('focusout', function () { window.setTimeout(startNotices, 0); });
    notice.addEventListener('mouseenter', startNotices);
    notice.addEventListener('mouseleave', startNotices);
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
  var burger = document.getElementById('burger') || document.querySelector('.burger');
  var drawerClose = document.getElementById('mobileNavClose') || document.querySelector('.nav-close');
  var lastFocus = null;

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-open');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    var first = drawer.querySelector('button, a');
    if (first) first.focus();
    document.addEventListener('keydown', trapFocus);
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
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
    if (prose.hasAttribute('data-full-text') || prose.textContent.trim().length < 680 || prose.classList.contains('mobile-readable')) return;
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
    if (document.body.getAttribute('data-market') === 'uae') {
      var launcher = document.createElement('a');
      launcher.className = 'quick-botim';
      launcher.href = 'https://botim.me/download/';
      launcher.setAttribute('data-botim', '');
      launcher.setAttribute('data-botim-number', '+642040101914');
      launcher.setAttribute('aria-label', 'Open BOTIM to contact ClearDesk on +64 20 4010 1914');
      launcher.innerHTML = '<span>Open BOTIM</span>';
      document.body.appendChild(launcher);

    }

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

  /* ---------- Careers: choose a pathway ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    var careerForm = document.getElementById('careerForm');
    var roleField = document.getElementById('careerRole');
    Array.prototype.forEach.call(document.querySelectorAll('[data-role-choice]'), function (button) {
      button.addEventListener('click', function () {
        if (roleField) roleField.value = button.getAttribute('data-role-choice') || '';
        var apply = document.getElementById('apply');
        if (apply) apply.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        window.setTimeout(function () { if (roleField) roleField.focus(); }, reduced ? 0 : 500);
      });
    });
  });


  /* ---------- Homepage featured-services carousel ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-launch-carousel]'), function (carousel) {
    var slides = carousel.querySelectorAll('[data-launch-slide]');
    var dots = carousel.querySelectorAll('[data-launch-dot]');
    var toggle = carousel.querySelector('[data-launch-toggle]');
    var currentLabel = carousel.querySelector('[data-launch-current]');
    var current = 0;
    var timer;
    var paused = reduced;
    if (slides.length < 2) return;
    function showLaunchSlide(index) {
      current = (index + slides.length) % slides.length;
      Array.prototype.forEach.call(slides, function (slide, i) {
        var active = i === current;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      Array.prototype.forEach.call(dots, function (dot, i) {
        var active = i === current;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });
      if (currentLabel) currentLabel.textContent = String(current + 1).padStart(2, '0');
    }
    function syncLaunchToggle() {
      if (!toggle) return;
      toggle.textContent = paused ? 'Play' : 'Pause';
      toggle.setAttribute('aria-label', paused ? 'Play rotating featured services' : 'Pause rotating featured services');
    }
    function startLaunchCarousel() {
      window.clearInterval(timer);
      if (paused || reduced || carousel.matches(':hover') || carousel.contains(document.activeElement)) return;
      timer = window.setInterval(function () { showLaunchSlide(current + 1); }, 2000);
    }
    Array.prototype.forEach.call(dots, function (dot, i) {
      dot.addEventListener('click', function () { showLaunchSlide(i); startLaunchCarousel(); });
    });
    if (toggle) toggle.addEventListener('click', function () { paused = !paused; syncLaunchToggle(); startLaunchCarousel(); });
    carousel.addEventListener('mouseenter', startLaunchCarousel);
    carousel.addEventListener('mouseleave', startLaunchCarousel);
    carousel.addEventListener('focusin', startLaunchCarousel);
    carousel.addEventListener('focusout', function () { window.setTimeout(startLaunchCarousel, 0); });
    showLaunchSlide(0); syncLaunchToggle(); startLaunchCarousel();
  });

})();
/* Launch Desk: no client data is submitted, stored or added to URLs. */
(function () {
  'use strict';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-startup-carousel]').forEach(function (carousel) {
    const slides = Array.from(carousel.querySelectorAll('[data-startup-slide]'));
    const pause = carousel.querySelector('[data-startup-pause]');
    let current = 0, paused = motion.matches, timer;
    function render() {
      slides.forEach((slide, i) => { slide.hidden = i !== current; });
      carousel.querySelector('[data-startup-position]').textContent = '0' + (current + 1) + ' / 03';
      pause.textContent = paused ? 'Resume' : 'Pause';
      pause.setAttribute('aria-label', paused ? 'Resume startup carousel' : 'Pause startup carousel');
    }
    function schedule() {
      clearInterval(timer);
      if (!paused && !document.hidden && !carousel.matches(':hover') && !carousel.contains(document.activeElement)) {
        timer = setInterval(() => { current = (current + 1) % slides.length; render(); }, 8000);
      }
    }
    function move(step) { current = (current + step + slides.length) % slides.length; paused = true; render(); schedule(); }
    carousel.querySelector('[data-startup-prev]').addEventListener('click', () => move(-1));
    carousel.querySelector('[data-startup-next]').addEventListener('click', () => move(1));
    pause.addEventListener('click', () => { paused = !paused; render(); schedule(); });
    carousel.addEventListener('mouseenter', schedule);
    carousel.addEventListener('mouseleave', schedule);
    carousel.addEventListener('focusin', schedule);
    carousel.addEventListener('focusout', () => setTimeout(schedule, 0));
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', () => { if (motion.matches) paused = true; render(); schedule(); });
    render(); schedule();
  });
  const builder = document.querySelector('[data-startup-builder]');
  if (!builder) return;
  const tasks = Array.from(builder.querySelectorAll('[data-startup-task]'));
  const field = id => document.getElementById('startup-' + id);
  const money = cents => new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' }).format(cents / 100);
  const discountType = field('discount-type'), discountValue = field('discount-value');
  const download = builder.querySelector('[data-startup-pdf]');
  const status = builder.querySelector('[data-startup-download-status]');
  let downloading = false;
  function calculate() {
    const chosen = tasks.filter(task => task.checked);
    const subtotal = chosen.reduce((sum, task) => sum + Number(task.dataset.price), 0);
    const raw = Number(discountValue.value);
    const max = discountType.value === 'percent' ? 100 : subtotal / 100;
    const invalid = discountValue.validity.badInput || !Number.isFinite(raw) || raw < 0 || raw > max;
    const safe = Number.isFinite(raw) ? Math.min(max, Math.max(0, raw)) : 0;
    const discount = Math.min(subtotal, Math.round(discountType.value === 'percent' ? subtotal * safe / 100 : safe * 100));
    const net = subtotal - discount;
    const gst = Math.round(net * 15 / 100);
    const official = [];
    if (field('fees').checked) {
      if (chosen.some(t => t.id === 'task-reserve')) official.push({ title: 'Company name reservation', amount: 1150 });
      if (chosen.some(t => t.id === 'task-company')) official.push({ title: 'Company incorporation', amount: 13655 });
    }
    const fees = official.reduce((sum, fee) => sum + fee.amount, 0);
    return { chosen, subtotal, discount, net, gst, fees, serviceTotal: net + gst, total: net + gst + fees, official, invalid, max };
  }
  function update() {
    const quote = calculate();
    builder.querySelectorAll('[data-total]').forEach(el => {
      el.textContent = (el.dataset.total === 'discount' ? '−' : '') + money(quote[el.dataset.total]);
    });
    builder.querySelector('[data-startup-count]').textContent = quote.chosen.length;
    const list = builder.querySelector('[data-startup-selected]');
    list.replaceChildren();
    if (!quote.chosen.length) { const li = document.createElement('li'); li.textContent = 'No tasks selected yet.'; list.append(li); }
    quote.chosen.forEach(task => {
      const li = document.createElement('li'), name = document.createElement('span'), price = document.createElement('b');
      name.textContent = task.dataset.title; price.textContent = money(Number(task.dataset.price));
      li.append(name, price); list.append(li);
    });
    builder.querySelector('[data-startup-fee-note]').textContent = quote.official.length ? quote.official.map(f => f.title + ': ' + money(f.amount)).join(' · ') + '. Paid separately to the Companies Office; GST already included.' : (field('fees').checked ? 'No government fees apply to the selected tasks.' : 'Government fees are excluded from this budget and may still be payable separately.');
    discountValue.max = quote.max;
    discountValue.setAttribute('aria-invalid', String(quote.invalid));
    discountValue.setAttribute('aria-describedby', 'startup-discount-error');
    const error = field('discount-error');
    error.hidden = !quote.invalid;
    error.textContent = 'Enter a discount between 0 and ' + (discountType.value === 'percent' ? '100%.' : money(quote.subtotal) + '.') + ' The displayed discount is capped; correct the value before downloading.';
    download.disabled = downloading || !quote.chosen.length || quote.invalid;
    builder.querySelectorAll('[data-startup-group]').forEach(button => {
      const groupTasks = Array.from(button.closest('fieldset').querySelectorAll('[data-startup-task]'));
      button.textContent = groupTasks.every(t => t.checked) ? 'Clear this group' : 'Select this group';
    });
  }
  builder.addEventListener('change', update);
  discountValue.addEventListener('input', update);
  discountType.addEventListener('change', () => { discountValue.value = '0'; update(); });
  builder.querySelector('[data-startup-all]').addEventListener('click', () => { tasks.forEach(t => { t.checked = true; }); update(); });
  builder.querySelector('[data-startup-clear]').addEventListener('click', () => { tasks.forEach(t => { t.checked = false; }); discountValue.value = '0'; update(); });
  builder.querySelectorAll('[data-startup-group]').forEach(button => button.addEventListener('click', () => {
    const groupTasks = Array.from(button.closest('fieldset').querySelectorAll('[data-startup-task]'));
    const checked = !groupTasks.every(t => t.checked);
    groupTasks.forEach(t => { t.checked = checked; }); update();
  }));
  builder.querySelector('[data-startup-reset]').addEventListener('click', () => {
    if (!window.confirm('Clear all selected tasks, client details, notes and discounts for a new client? Download any quote you need first.')) return;
    tasks.forEach(t => { t.checked = false; });
    ['client', 'business', 'notes'].forEach(id => { field(id).value = ''; });
    discountType.value = 'amount'; discountValue.value = '0'; field('fees').checked = true;
    status.textContent = ''; update();
    builder.querySelector('.startup-client-details').open = true;
    field('client').focus();
  });
  // Draw each PDF page locally. Canvas preserves Unicode client names without an
  // external PDF dependency or uploading personal information to a PDF service.
  async function quotePdf(quote) {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const W = 1240, H = 1754, left = 85, right = 1155, bottom = 1580;
    const pages = []; let canvas, ctx, y;
    const date = new Date();
    const dateLabel = new Intl.DateTimeFormat('en-NZ', { timeZone: 'Pacific/Auckland', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    const dateParts = new Intl.DateTimeFormat('en-NZ', { timeZone: 'Pacific/Auckland', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
    const part = type => dateParts.find(p => p.type === type).value;
    const ref = 'CD-' + part('year') + part('month') + part('day') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    function startPage() {
      canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H; ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#0A1628'; ctx.fillRect(0, 0, W, 215);
      ctx.fillStyle = '#E8A020'; ctx.fillRect(left, 60, 40, 6);
      ctx.fillStyle = '#fff'; ctx.font = '700 37px Inter, sans-serif'; ctx.fillText('ClearDesk Launch Desk', left, 118);
      ctx.fillStyle = '#c5d3e4'; ctx.font = '20px Inter, sans-serif'; ctx.fillText('New Zealand business startup | Itemised draft quote', left, 163);
      y = 265;
    }
    function finishPage() {
      ctx.strokeStyle = '#E2E8F0'; ctx.beginPath(); ctx.moveTo(left, 1630); ctx.lineTo(right, 1630); ctx.stroke();
      ctx.fillStyle = '#64748B'; ctx.font = '17px Inter, sans-serif';
      ctx.fillText('ClearDesk Business Services · info@cleardesk.co.nz · 020 4010 1914', left, 1668);
      ctx.fillText(ref + ' · Draft — ClearDesk confirmation required', left, 1700);
      ctx.textAlign = 'right'; ctx.fillText('Page ' + (pages.length + 1), right, 1700); ctx.textAlign = 'left';
      pages.push(canvas.toDataURL('image/jpeg', 0.92));
    }
    function ensure(height) { if (y + height > bottom) { finishPage(); startPage(); } }
    function lines(text, width, font) {
      ctx.font = font;
      const result = [];
      String(text).split('\n').forEach(paragraph => {
        let line = '';
        // Character-level fallback safely wraps long unbroken names and URLs.
        paragraph.split(/\s+/).forEach(word => {
          if (ctx.measureText(line + (line ? ' ' : '') + word).width <= width) { line += (line ? ' ' : '') + word; return; }
          if (line) { result.push(line); line = ''; }
          for (const char of word) {
            if (line && ctx.measureText(line + char).width > width) { result.push(line); line = ''; }
            line += char;
          }
        });
        result.push(line);
      });
      return result;
    }
    function paragraph(text, size = 22, color = '#526276', bold = false, width = right - left) {
      const font = (bold ? '700 ' : '') + size + 'px Inter, sans-serif';
      const wrapped = lines(text, width, font), lineHeight = Math.ceil(size * 1.5);
      if (wrapped.length * lineHeight < bottom - 265) ensure(wrapped.length * lineHeight);
      wrapped.forEach(line => { ensure(lineHeight); ctx.font = font; ctx.fillStyle = color; ctx.fillText(line, left, y); y += lineHeight; });
      y += 10;
    }
    function totalRow(label, amount, strong = false) {
      ensure(48); ctx.fillStyle = strong ? '#1B5EAE' : '#2C3A4B'; ctx.font = (strong ? '700 ' : '') + '24px Inter, sans-serif';
      ctx.fillText(label, left, y); ctx.textAlign = 'right'; ctx.fillText(amount, right, y); ctx.textAlign = 'left'; y += 45;
    }
    startPage();
    paragraph('DRAFT QUOTE — CLEARDESK APPROVAL REQUIRED', 19, '#1B5EAE', true);
    paragraph('Reference: ' + ref + '   |   Prepared: ' + dateLabel, 20);
    paragraph('Client: ' + (field('client').value.trim() || 'Not provided'), 22, '#0A1628', true);
    paragraph('Business: ' + (field('business').value.trim() || 'To be confirmed'), 22);
    paragraph('One-off startup setup. All service line prices are NZD excluding GST. This is not an invoice, tax document or accepted engagement.', 20);
    let group = '';
    quote.chosen.forEach(task => {
      const description = lines(task.dataset.description, right - left - 15, '20px Inter, sans-serif');
      const titleLines = lines(task.dataset.title, right - left - 160, '700 23px Inter, sans-serif');
      ensure(40 + titleLines.length * 32 + description.length * 29 + (group !== task.dataset.group ? 60 : 0));
      if (group !== task.dataset.group) { group = task.dataset.group; y += 10; paragraph(group.toUpperCase(), 19, '#1B5EAE', true); }
      ctx.font = '700 23px Inter, sans-serif'; ctx.fillStyle = '#0A1628';
      titleLines.forEach((line, i) => ctx.fillText(line, left, y + i * 32));
      ctx.textAlign = 'right'; ctx.fillText(money(Number(task.dataset.price)), right, y); ctx.textAlign = 'left';
      y += titleLines.length * 32 + 6; ctx.font = '20px Inter, sans-serif'; ctx.fillStyle = '#526276';
      description.forEach(line => { ctx.fillText(line, left, y); y += 29; });
      y += 15; ctx.strokeStyle = '#E2E8F0'; ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke(); y += 28;
    });
    ensure(400); y += 15;
    paragraph('YOUR STARTUP BUDGET', 23, '#0A1628', true);
    totalRow('Service subtotal (excluding GST)', money(quote.subtotal));
    totalRow('Proposed discount' + (discountType.value === 'percent' ? ' (' + discountValue.value + '%)' : ''), '−' + money(quote.discount));
    totalRow('Services after discount', money(quote.net));
    totalRow('GST on services (15%)', money(quote.gst));
    totalRow('ClearDesk total (including GST)', money(quote.serviceTotal), true);
    totalRow('Government fees (GST already included)', money(quote.fees));
    totalRow('Total startup budget (NZD)', money(quote.total), true);
    paragraph(quote.official.length ? 'Paid separately by the client: ' + quote.official.map(f => f.title + ' ' + money(f.amount)).join('; ') + '.' : 'No government fees included. Where applicable, they are payable separately.', 19);
    if (field('notes').value.trim()) { paragraph('SCOPE NOTES', 21, '#0A1628', true); paragraph(field('notes').value.trim(), 20); }
    paragraph('BEFORE WE BEGIN', 21, '#0A1628', true);
    [
      'ClearDesk must confirm scope, eligibility, dependencies, prices, proposed discounts, GST treatment, third-party charges, delivery timing and payment terms in writing before work starts. No service is booked and no payment is taken by this calculator.',
      'Standard scope: one straightforward NZ startup, up to two individual directors/shareholders. Company formation support requires eligibility, authority and AML/CFT compliance review before acceptance. Registration and bank approval are not guaranteed. You complete identity checks and choose providers.',
      'You own the domain, website and provider accounts. A suitable existing brand, site or accounting file may be required if related setup tasks are not selected. Google Business Profiles are for eligible in-person/service-area businesses, not online-only businesses; Google controls verification.',
      'Excluded unless separately agreed: ongoing subscriptions, hosting, renewals, bookkeeping, payroll, tax returns, licences, legal documents, trademark work, advertising, photography, e-commerce, booking systems, custom integrations and extra revisions. Third-party renewals are not part of this one-off total.',
      'Government fees checked 10 November 2026: name reservation NZ$11.50 and incorporation NZ$136.55 including GST. Confirm current charges before filing: companies-register.companiesoffice.govt.nz/help-centre/managing-your-online-account/schedule-of-fees/',
      'General information only, not personalised tax, legal or financial advice. Terms: cleardesk.co.nz/legal/terms/ | Privacy: cleardesk.co.nz/legal/privacy/. ClearDesk Business Services is operated by Yasara Solutions Limited. Contact info@cleardesk.co.nz to confirm this draft.'
    ].forEach(text => paragraph(text, 19));
    finishPage();
    // Minimal PDF 1.4 writer. JPEG pages support every script rendered by the browser.
    const encoder = new TextEncoder(), chunks = [], offsets = [0]; let length = 0;
    const add = data => { const bytes = typeof data === 'string' ? encoder.encode(data) : data; chunks.push(bytes); length += bytes.length; };
    const obj = (id, content) => { offsets[id] = length; add(id + ' 0 obj\n' + content + '\nendobj\n'); };
    add('%PDF-1.4\n');
    obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
    obj(2, '<< /Type /Pages /Count ' + pages.length + ' /Kids [' + pages.map((_, i) => (3 + i * 3) + ' 0 R').join(' ') + '] >>');
    pages.forEach((data, i) => {
      const id = 3 + i * 3, imageId = id + 1, contentId = id + 2;
      obj(id, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 ' + imageId + ' 0 R >> >> /Contents ' + contentId + ' 0 R >>');
      const binary = atob(data.split(',')[1]), bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
      offsets[imageId] = length; add(imageId + ' 0 obj\n<< /Type /XObject /Subtype /Image /Width ' + W + ' /Height ' + H + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + bytes.length + ' >>\nstream\n'); add(bytes); add('\nendstream\nendobj\n');
      const stream = 'q\n595.28 0 0 841.89 0 0 cm\n/Im0 Do\nQ';
      obj(contentId, '<< /Length ' + encoder.encode(stream).length + ' >>\nstream\n' + stream + '\nendstream');
    });
    const xref = length, size = 3 + pages.length * 3;
    add('xref\n0 ' + size + '\n0000000000 65535 f \n');
    for (let i = 1; i < size; i++) add(String(offsets[i]).padStart(10, '0') + ' 00000 n \n');
    add('trailer\n<< /Size ' + size + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF');
    return { blob: new Blob(chunks, { type: 'application/pdf' }), filename: 'ClearDesk-Launch-Desk-' + ref + '.pdf' };
  }
  download.addEventListener('click', async () => {
    const quote = calculate(); if (!quote.chosen.length || quote.invalid || downloading) return;
    downloading = true; update(); status.textContent = 'Preparing your itemised PDF…';
    try {
      const pdf = await quotePdf(quote);
      const url = URL.createObjectURL(pdf.blob), link = document.createElement('a');
      link.href = url; link.download = pdf.filename; document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      status.textContent = 'Your PDF is ready. Check your downloads, or save it from the PDF preview. Clear the client details when finished.';
    } catch (error) {
      status.textContent = 'The PDF could not be created in this browser. Your selection is still here. Please try again in an up-to-date browser or contact ClearDesk.';
      console.error('Quote PDF generation failed', error);
    } finally { downloading = false; update(); }
  });
  update();
})();
