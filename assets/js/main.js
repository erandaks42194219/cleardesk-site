/* ClearDesk — cleardesk.co.nz
   Vanilla JS. No libraries. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Rotating announcement bar ---------- */
  var noticeMessages = [
  {
    "market": "NZ",
    "text": "5 October 2026: employer deductions for 16–30 September are due for large employers. Payday filing is separate.",
    "url": "https://www.ird.govt.nz/employing-staff/payday-filing/paying-deductions-to-inland-revenue"
  },
  {
    "market": "NZ",
    "text": "28 September 2026: GST return and payment due if your taxable period ended 31 August 2026, including nil returns.",
    "url": "https://www.ird.govt.nz/gst/filing-and-paying-gst-and-refunds"
  },
  {
    "market": "NZ",
    "text": "Payroll reminder: file electronic employment information within two working days of each payday; special filing cases differ.",
    "url": "https://www.ird.govt.nz/employing-staff/payday-filing"
  },
  {
    "market": "NZ",
    "text": "17 September 2026: NZ GDP rose 0.2% in the June quarter; construction activity rose 2.7%. Use current trading data when reviewing forecasts.",
    "url": "https://www.stats.govt.nz/news/gdp-increases-0-2-percent-in-the-june-2026-quarter/"
  },
  {
    "market": "UAE",
    "text": "30 September 2026: Corporate Tax filing and payment generally due for taxable persons whose tax period ended 31 December 2025.",
    "url": "https://tax.gov.ae/en/media.centre/news/federal.tax.authority.urges.submission.of.corporate.tax.returns.and.settlement.of.corporate.tax.liabilities.within.nine.months.from.the.end.of.the.tax.period.aspx"
  },
  {
    "market": "UAE",
    "text": "28 September 2026: VAT return and payment due if your assigned tax period ended 31 August 2026. Check EmaraTax.",
    "url": "https://tax.gov.ae/en/taxes/Vat/vat.topics/filing.vat.returns.and.making.payments.aspx"
  },
  {
    "market": "UAE",
    "text": "In-scope businesses below AED 50m revenue: appoint an e-invoicing ASP by 31 March 2027; implement from 1 July 2027. Exclusions apply.",
    "url": "https://mof.gov.ae/en/news/ministry-of-finance-announces-the-issuance-of-two-ministerial-decisions-on-the-scope-of-obligations-and-the-timelines-for-implementing-the-electronic-invoicing-system-2/"
  },
  {
    "market": "UAE",
    "text": "Small Business Relief: eligible tax periods must end by 31 December 2026. Revenue and other conditions apply; relief requires an election.",
    "url": "https://mof.gov.ae/en/news/ministry-of-finance-issues-decision-on-small-business-relief-for-corporate-tax-purposes/"
  },
  {
    "market": "UAE",
    "text": "In-scope businesses above AED 50m revenue: ASP appointment extended to 30 October 2026; e-invoicing implementation remains 1 January 2027.",
    "url": "https://mof.gov.ae/en/news/ministry-of-finance-announces-targeted-amendments-to-einvoicing-system-decisions/"
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
})();
