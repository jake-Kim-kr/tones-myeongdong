/* ============================================================
   DA DERMATOLOGY MYEONGDONG - MAIN JAVASCRIPT
   Version 2.0 — Plan-based rebuild
   ============================================================ */

(function () {
  'use strict';

  /* ---------- DOM REFERENCES ---------- */
  var header = document.getElementById('header');
  var hamburger = document.getElementById('hamburger');
  var drawer = document.getElementById('drawer');
  var drawerOverlay = document.getElementById('drawerOverlay');
  var drawerClose = document.getElementById('drawerClose');
  var floating = document.getElementById('floating');
  var scrollTopBtn = document.getElementById('scrollTop');
  var resultTabs = document.querySelectorAll('.results__tab');
  var resultCards = document.querySelectorAll('.result-card');
  var navLinks = document.querySelectorAll('.header__link');
  var drawerLinks = document.querySelectorAll('.drawer__link');

  /* ---------- UTILITY ---------- */
  function debounce(fn, ms) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    };
  }

  /* ==========================================================
     1. SCROLL REVEAL (IntersectionObserver)
     ========================================================== */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  /* ==========================================================
     2. HEADER SCROLL STATE
     ========================================================== */
  function handleHeaderScroll() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollY > 80) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  /* ==========================================================
     3. FLOATING SIDEBAR
     ========================================================== */
  function handleFloating() {
    if (!floating) return;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollY > 300) {
      floating.classList.add('visible');
    } else {
      floating.classList.remove('visible');
    }

    if (scrollTopBtn) {
      if (scrollY > 600) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  }

  /* ==========================================================
     4. MOBILE DRAWER
     ========================================================== */
  function openDrawer() {
    if (drawer) {
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (drawer) {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', openDrawer);
  }
  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeDrawer();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  /* ==========================================================
     5. SCROLL TO TOP
     ========================================================== */
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================
     6. SMOOTH SCROLL FOR ANCHOR LINKS
     ========================================================== */
  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        var headerHeight = header ? header.offsetHeight : 0;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        if (drawer && drawer.classList.contains('active')) {
          closeDrawer();
        }
      });
    });
  }

  /* ==========================================================
     7. ACTIVE NAV TRACKING (homepage only)
     ========================================================== */
  function updateActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    if (!sections.length || !navLinks.length) return;

    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var headerHeight = header ? header.offsetHeight : 0;

    sections.forEach(function (section) {
      var top = section.offsetTop - headerHeight - 100;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* ==========================================================
     8. BEFORE/AFTER TAB FILTER
     ========================================================== */
  function initTabFilter() {
    if (!resultTabs.length) return;

    resultTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var category = this.getAttribute('data-tab');

        resultTabs.forEach(function (t) {
          t.classList.remove('active');
        });
        this.classList.add('active');

        resultCards.forEach(function (card) {
          var cardCategory = card.getAttribute('data-category');

          if (category === 'all' || cardCategory === category) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            setTimeout(function () {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================================
     9. HEADER DROPDOWN
     ========================================================== */
  function initDropdowns() {
    var dropdownParents = document.querySelectorAll('.header__has-dropdown');

    // Close all dropdowns
    function closeAllDropdowns() {
      dropdownParents.forEach(function(p) {
        var dd = p.querySelector('.header__dropdown');
        if (dd) {
          dd.style.opacity = '';
          dd.style.visibility = '';
        }
      });
    }

    dropdownParents.forEach(function (parent) {
      // Desktop: mouseenter to show, mouseleave to hide
      parent.addEventListener('mouseenter', function() {
        if (window.innerWidth <= 1023) return;
        closeAllDropdowns();
      });

      // Click handling for touch devices
      parent.addEventListener('click', function (e) {
        if (window.innerWidth <= 1023) return;

        var dropdown = this.querySelector('.header__dropdown');
        if (!dropdown) return;

        if (e.target.classList.contains('header__link')) {
          e.preventDefault();
          var isOpen = dropdown.style.opacity === '1';
          closeAllDropdowns();
          if (!isOpen) {
            dropdown.style.opacity = '1';
            dropdown.style.visibility = 'visible';
          }
        }
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.header__has-dropdown')) {
        closeAllDropdowns();
      }
    });
  }

  /* ==========================================================
     10. PARALLAX EFFECT (Hero)
     ========================================================== */
  function handleParallax() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var hero = document.querySelector('.hero__content');

    if (hero && scrollY < window.innerHeight) {
      var opacity = 1 - scrollY / (window.innerHeight * 0.7);
      var translateY = scrollY * 0.3;
      hero.style.opacity = Math.max(0, opacity);
      hero.style.transform = 'translateY(' + translateY + 'px)';
    }
  }

  /* ==========================================================
     11. STAGGERED REVEAL FOR GRIDS
     ========================================================== */
  function initStaggeredReveal() {
    var grids = document.querySelectorAll(
      '.treatments__grid, .results__grid, .column__grid, .feature-grid, .category-grid, .equipment-grid, .facility-grid'
    );

    if ('IntersectionObserver' in window) {
      var gridObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var children = entry.target.children;
              Array.prototype.forEach.call(children, function (child, index) {
                setTimeout(function () {
                  child.style.opacity = '1';
                  child.style.transform = 'translateY(0)';
                }, index * 100);
              });
              gridObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      grids.forEach(function (grid) {
        Array.prototype.forEach.call(grid.children, function (child) {
          child.style.opacity = '0';
          child.style.transform = 'translateY(24px)';
          child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        gridObserver.observe(grid);
      });
    }
  }

  /* ==========================================================
     12. FAQ ACCORDION
     ========================================================== */
  function initFaqAccordion() {
    var faqQuestions = document.querySelectorAll('.faq-question');
    if (!faqQuestions.length) return;

    faqQuestions.forEach(function (question) {
      question.addEventListener('click', function () {
        var faqItem = this.parentElement;
        var isActive = faqItem.classList.contains('active');

        /* Close all other items */
        var allItems = document.querySelectorAll('.faq-item');
        allItems.forEach(function (item) {
          item.classList.remove('active');
        });

        /* Toggle current item */
        if (!isActive) {
          faqItem.classList.add('active');
        }
      });
    });
  }

  /* ==========================================================
     13. RESERVATION FORM (if present)
     ========================================================== */
  function initReservationForm() {
    var form = document.getElementById('reservationForm');
    if (!form) return;

    var categorySelect = form.querySelector('[name="category"]');
    var detailSelect = form.querySelector('[name="detail"]');

    if (categorySelect && detailSelect) {
      var treatments = {
        lifting: ['울쎄라', '써마지', 'HIFU', '소프트웨이브'],
        skincare: ['BBL', '레이저토닝', '스킨부스터'],
        injection: ['보톡스', '필러', '물광주사'],
        body: ['바디리프팅', '체형보정']
      };

      categorySelect.addEventListener('change', function () {
        var selected = this.value;
        detailSelect.innerHTML = '<option value="">세부 시술을 선택하세요</option>';

        if (treatments[selected]) {
          treatments[selected].forEach(function (t) {
            var option = document.createElement('option');
            option.value = t;
            option.textContent = t;
            detailSelect.appendChild(option);
          });
        }
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Basic validation */
      var name = form.querySelector('[name="name"]');
      var phone = form.querySelector('[name="phone"]');
      var privacy = form.querySelector('[name="privacy"]');

      if (!name || !name.value.trim()) {
        alert('이름을 입력해 주세요.');
        return;
      }
      if (!phone || !phone.value.trim()) {
        alert('연락처를 입력해 주세요.');
        return;
      }
      if (privacy && !privacy.checked) {
        alert('개인정보 수집/이용에 동의해 주세요.');
        return;
      }

      alert('예약 신청이 완료되었습니다. 확정 전화를 드리겠습니다.');
      form.reset();
    });
  }

  /* ==========================================================
     SCROLL EVENT
     ========================================================== */
  function onScroll() {
    if (header) handleHeaderScroll();
    handleFloating();
    updateActiveNav();
    handleParallax();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ==========================================================
     RESIZE EVENT
     ========================================================== */
  window.addEventListener(
    'resize',
    debounce(function () {
      if (window.innerWidth > 1023 && drawer && drawer.classList.contains('active')) {
        closeDrawer();
      }
    }, 200)
  );

  /* ==========================================================
     INIT ON DOM READY
     ========================================================== */
  function init() {
    initReveal();
    initSmoothScroll();
    initTabFilter();
    initDropdowns();
    initStaggeredReveal();
    initFaqAccordion();
    initReservationForm();

    onScroll();
  }

  /* ---------- DYNAMIC SITE IMAGES (from API) ---------- */
  function loadSiteImages() {
    fetch('/api/site-images')
      .then(function(res) { return res.json(); })
      .then(function(images) {
        var mapping = {
          'hero-bg': '.hero__bg',
          'about-clinic': '.about__image-placeholder',
          'treatment-lifting': '.treatment-card:nth-child(1) .treatment-card__placeholder',
          'treatment-skincare': '.treatment-card:nth-child(2) .treatment-card__placeholder',
          'treatment-injection': '.treatment-card:nth-child(3) .treatment-card__placeholder',
          'treatment-body': '.treatment-card:nth-child(4) .treatment-card__placeholder',
          'column-editorial': '.column-card .column-card__placeholder',
          'page-hero-bg': '.page-hero__bg',
          'clinic-interior': '.facility-item:nth-child(2)'
        };

        images.forEach(function(img) {
          if (!img.image_url || !mapping[img.slot]) return;
          var els = document.querySelectorAll(mapping[img.slot]);
          els.forEach(function(el) {
            if (img.media_type === 'video') {
              // Insert video element into the bg container
              el.style.setProperty('background', 'transparent', 'important');
              el.style.setProperty('background-image', 'none', 'important');
              var video = document.createElement('video');
              video.src = img.image_url;
              video.autoplay = true;
              video.loop = true;
              video.muted = true;
              video.playsInline = true;
              video.setAttribute('playsinline', '');
              video.setAttribute('webkit-playsinline', '');
              video.setAttribute('autoplay', '');
              video.setAttribute('muted', '');
              video.setAttribute('loop', '');
              video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;';
              // Insert before overlay if exists
              var overlay = el.querySelector('.hero__overlay, .page-hero__overlay');
              if (overlay) {
                el.insertBefore(video, overlay);
              } else {
                el.insertBefore(video, el.firstChild);
              }
              video.play().catch(function(){});
            } else {
              el.style.backgroundImage = "url('" + img.image_url + "')";
              el.style.backgroundSize = 'cover';
              el.style.backgroundPosition = 'center';
            }
          });
        });
      })
      .catch(function() { /* silently fail, use default CSS images */ });
  }

  /* ---------- DYNAMIC THEME COLOR (from API) ---------- */
  function loadThemeColor() {
    fetch('/api/settings')
      .then(function(res) { return res.json(); })
      .then(function(settings) {
        if (!settings || !settings.theme_primary) return;
        var root = document.documentElement;

        // Parse hex to RGB
        function hexRgb(hex) {
          hex = hex.replace('#', '');
          return parseInt(hex.substring(0,2),16) + ', ' + parseInt(hex.substring(2,4),16) + ', ' + parseInt(hex.substring(4,6),16);
        }

        var primary = settings.theme_primary;
        var light = settings.theme_primary_light || primary;
        var dark = settings.theme_primary_dark || primary;

        // Set all CSS variables
        root.style.setProperty('--green', primary);
        root.style.setProperty('--green-rgb', hexRgb(primary));
        root.style.setProperty('--green-light', light);
        root.style.setProperty('--green-dark', dark);
        root.style.setProperty('--green-dark-rgb', hexRgb(dark));
        root.style.setProperty('--shadow-lg', '0 8px 24px rgba(' + hexRgb(primary) + ',0.18)');
      })
      .catch(function() { /* silently fail */ });
  }

  /* ---------- LANGUAGE DROPDOWN ---------- */
  function initLangDropdown() {
    var langBtn = document.querySelector('.header__lang');
    if (!langBtn) return;

    langBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      langBtn.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
      langBtn.classList.remove('active');
    });

    // Prevent dropdown clicks from closing
    var dropdown = langBtn.querySelector('.header__lang-dropdown');
    if (dropdown) {
      dropdown.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { init(); loadThemeColor(); loadSiteImages(); initLangDropdown(); });
  } else {
    init();
    loadThemeColor();
    loadSiteImages();
    initLangDropdown();
  }
})();
