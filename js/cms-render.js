/**
 * CMS Render Script
 * 페이지 콘텐츠를 API에서 불러와 동적으로 렌더링합니다.
 */

(function() {
  'use strict';

  // 언어 감지
  function detectLanguage() {
    var path = window.location.pathname;
    if (path.startsWith('/ja/')) return 'ja';
    if (path.startsWith('/zh-cn/')) return 'zh-cn';
    if (path.startsWith('/zh-tw/')) return 'zh-tw';
    return 'ko';
  }

  // 현재 페이지 감지
  function detectPage() {
    var path = window.location.pathname;
    // 언어 prefix 제거
    path = path.replace(/^\/(ja|zh-cn|zh-tw)\//, '/');

    if (path === '/' || path === '/index.html') return 'home';
    if (path.includes('about')) return 'about';
    if (path.includes('results')) return 'results';
    if (path.includes('location')) return 'location';
    if (path.includes('reservation')) return 'reservation';
    return null;
  }

  var LANG = detectLanguage();
  var PAGE = detectPage();

  // API에서 페이지 콘텐츠 가져오기
  async function fetchPageContent(page, lang) {
    try {
      var res = await fetch('/api/page-content/' + page + '?lang=' + lang);
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (e) {
      console.warn('CMS: Failed to load content', e);
      return [];
    }
  }

  // 섹션 렌더링
  function renderSection(section) {
    if (!section.is_visible) return;

    var content = section.content;
    if (!content) return;

    var type = section.section_type;
    var key = section.section_key;

    // 각 섹션 타입별 렌더링
    switch (type) {
      case 'hero':
        renderHero(content, key);
        break;
      case 'about':
        renderAbout(content, key);
        break;
      case 'treatments':
        renderTreatments(content, key);
        break;
      case 'trust':
        renderTrust(content, key);
        break;
      case 'results':
        renderResults(content, key);
        break;
      case 'column':
        renderColumn(content, key);
        break;
      case 'promo':
        renderPromo(content, key);
        break;
      case 'location':
        renderLocation(content, key);
        break;
      case 'cta':
        renderCTA(content, key);
        break;
    }
  }

  // ─── HERO 섹션 렌더링 ───────────────────────────────────────
  function renderHero(content, key) {
    var heroEl = document.querySelector('.hero');
    if (!heroEl) return;

    var subtitle = heroEl.querySelector('.hero__subtitle');
    var titleEn = heroEl.querySelector('.hero__title-en');
    var titleKr = heroEl.querySelector('.hero__title-kr');
    var desc = heroEl.querySelector('.hero__desc');

    if (subtitle && content.label) subtitle.textContent = content.label;
    if (titleEn && content.title_en) titleEn.textContent = content.title_en;
    if (titleKr && content.title_kr) titleKr.textContent = content.title_kr;
    if (desc && content.description) desc.innerHTML = content.description;
  }

  // ─── ABOUT 섹션 렌더링 ──────────────────────────────────────
  function renderAbout(content, key) {
    var aboutEl = document.querySelector('.about');
    if (!aboutEl) return;

    var label = aboutEl.querySelector('.section-label');
    var title = aboutEl.querySelector('.section-title');
    var descs = aboutEl.querySelectorAll('.about__desc');
    var points = aboutEl.querySelectorAll('.about__point');
    var btn = aboutEl.querySelector('.btn');

    if (label && content.label) label.textContent = content.label;
    if (title && content.title) title.innerHTML = content.title;

    if (content.description && Array.isArray(content.description)) {
      descs.forEach(function(el, i) {
        if (content.description[i]) el.textContent = content.description[i];
      });
    }

    if (content.points && Array.isArray(content.points)) {
      points.forEach(function(point, i) {
        if (content.points[i]) {
          var p = content.points[i];
          var num = point.querySelector('.about__point-num');
          var strong = point.querySelector('strong');
          var desc = point.querySelector('p');
          if (num && p.num) num.textContent = p.num;
          if (strong && p.title) strong.textContent = p.title;
          if (desc && p.desc) desc.textContent = p.desc;
        }
      });
    }

    if (btn && content.button_text) {
      btn.textContent = content.button_text;
      if (content.button_link) btn.href = content.button_link;
    }
  }

  // ─── TREATMENTS 섹션 렌더링 ─────────────────────────────────
  function renderTreatments(content, key) {
    var treatmentsEl = document.querySelector('.treatments');
    if (!treatmentsEl) return;

    var label = treatmentsEl.querySelector('.section-label');
    var title = treatmentsEl.querySelector('.section-title');
    var subtitle = treatmentsEl.querySelector('.treatments__subtitle');
    var cards = treatmentsEl.querySelectorAll('.treatment-card');

    if (label && content.label) label.textContent = content.label;
    if (title && content.title) title.innerHTML = content.title;
    if (subtitle && content.subtitle) subtitle.innerHTML = content.subtitle;

    if (content.items && Array.isArray(content.items)) {
      cards.forEach(function(card, i) {
        if (content.items[i]) {
          var item = content.items[i];
          var num = card.querySelector('.treatment-card__num');
          var cardTitle = card.querySelector('.treatment-card__title');
          var en = card.querySelector('.treatment-card__en');
          var desc = card.querySelector('.treatment-card__desc');

          if (num && item.num) num.textContent = item.num;
          if (cardTitle && item.title) cardTitle.textContent = item.title;
          if (en && item.en) en.textContent = item.en;
          if (desc && item.desc) desc.textContent = item.desc;
          if (item.link) card.href = item.link;
        }
      });
    }
  }

  // ─── TRUST 섹션 렌더링 ──────────────────────────────────────
  function renderTrust(content, key) {
    var trustEl = document.querySelector('.trust');
    if (!trustEl) return;

    var label = trustEl.querySelector('.section-label');
    var title = trustEl.querySelector('.section-title');
    var items = trustEl.querySelectorAll('.trust__item');

    if (label && content.label) label.textContent = content.label;
    if (title && content.title) title.innerHTML = content.title;

    if (content.items && Array.isArray(content.items)) {
      items.forEach(function(item, i) {
        if (content.items[i]) {
          var data = content.items[i];
          var number = item.querySelector('.trust__number');
          var label = item.querySelector('.trust__label');
          var desc = item.querySelector('.trust__desc');

          if (number) {
            number.innerHTML = data.number + (data.unit ? '<small>' + data.unit + '</small>' : '');
          }
          if (label && data.label) label.textContent = data.label;
          if (desc && data.desc) desc.textContent = data.desc;
        }
      });
    }
  }

  // ─── RESULTS 섹션 렌더링 ────────────────────────────────────
  function renderResults(content, key) {
    var resultsEl = document.querySelector('.results');
    if (!resultsEl) return;

    var label = resultsEl.querySelector('.section-label');
    var title = resultsEl.querySelector('.section-title');
    var note = resultsEl.querySelector('.results__note');
    var btn = resultsEl.querySelector('.results__more .btn');

    if (label && content.label) label.textContent = content.label;
    if (title && content.title) title.innerHTML = content.title;
    if (note && content.note) note.innerHTML = content.note;
    if (btn && content.button_text) btn.textContent = content.button_text;
  }

  // ─── COLUMN 섹션 렌더링 ─────────────────────────────────────
  function renderColumn(content, key) {
    var columnEl = document.querySelector('.column');
    if (!columnEl) return;

    var label = columnEl.querySelector('.section-label');
    var title = columnEl.querySelector('.section-title');
    var btn = columnEl.querySelector('.column__more .btn');

    if (label && content.label) label.textContent = content.label;
    if (title && content.title) title.innerHTML = content.title;
    if (btn && content.button_text) btn.textContent = content.button_text;
  }

  // ─── PROMO 섹션 렌더링 ──────────────────────────────────────
  function renderPromo(content, key) {
    var promoEl = document.querySelector('.promo');
    if (!promoEl) return;

    var label = promoEl.querySelector('.section-label');
    var title = promoEl.querySelector('.section-title');
    var cards = promoEl.querySelectorAll('.promo-card');

    if (label && content.label) label.textContent = content.label;
    if (title && content.title) title.innerHTML = content.title;

    if (content.items && Array.isArray(content.items)) {
      cards.forEach(function(card, i) {
        if (content.items[i]) {
          var item = content.items[i];
          var badge = card.querySelector('.promo-card__badge');
          var category = card.querySelector('.promo-card__category');
          var cardTitle = card.querySelector('.promo-card__title');
          var desc = card.querySelector('.promo-card__desc');
          var cta = card.querySelector('.promo-card__cta');

          if (badge) {
            if (item.badge) {
              badge.textContent = item.badge;
              badge.style.display = '';
            } else {
              badge.style.display = 'none';
            }
          }
          if (category && item.category) category.textContent = item.category;
          if (cardTitle && item.title) cardTitle.innerHTML = item.title;
          if (desc && item.desc) desc.textContent = item.desc;
          if (cta && item.cta) cta.innerHTML = item.cta + ' &rarr;';
          if (item.link) card.href = item.link;
        }
      });
    }
  }

  // ─── LOCATION 섹션 렌더링 ───────────────────────────────────
  function renderLocation(content, key) {
    var locationEl = document.querySelector('.location');
    if (!locationEl) return;

    var label = locationEl.querySelector('.section-label');
    var title = locationEl.querySelector('.section-title');
    var items = locationEl.querySelectorAll('.location__item');
    var notice = locationEl.querySelector('.location__notice');
    var btn = locationEl.querySelector('.btn--primary');

    if (label && content.label) label.textContent = content.label;
    if (title && content.title) title.textContent = content.title;
    if (notice && content.notice) notice.textContent = content.notice;
    if (btn && content.button_text) btn.textContent = content.button_text;

    // 주소
    if (items[0] && content.address) {
      var addrP = items[0].querySelector('p');
      var subwayP = items[0].querySelector('.location__sub');
      if (addrP) addrP.textContent = content.address;
      if (subwayP && content.subway) subwayP.textContent = content.subway;
    }

    // 전화
    if (items[1] && content.phone) {
      var phoneP = items[1].querySelector('p');
      var phoneA = items[1].querySelector('a');
      if (phoneP && !phoneA) phoneP.textContent = content.phone;
      if (phoneA) {
        phoneA.textContent = content.phone;
        phoneA.href = 'tel:' + content.phone;
      }
    }

    // 운영시간
    if (items[2] && content.hours && Array.isArray(content.hours)) {
      var hoursDiv = items[2].querySelector('.location__hours');
      if (hoursDiv) {
        hoursDiv.innerHTML = content.hours.map(function(h) {
          var badge = h.badge ? ' <em class="location__badge">' + h.badge + '</em>' : '';
          return '<p>' + h.day + ' <span>' + h.time + '</span>' + badge + '</p>';
        }).join('');
      }
    }
  }

  // ─── CTA 섹션 렌더링 ────────────────────────────────────────
  function renderCTA(content, key) {
    var ctaEl = document.querySelector('.cta, .floating-cta');
    if (!ctaEl) return;

    var title = ctaEl.querySelector('.cta__title, h2, h3');
    var desc = ctaEl.querySelector('.cta__desc, p');
    var btn = ctaEl.querySelector('.btn, a');

    if (title && content.title) title.innerHTML = content.title;
    if (desc && content.description) desc.innerHTML = content.description;
    if (btn && content.button_text) {
      btn.textContent = content.button_text;
      if (content.button_link) btn.href = content.button_link;
    }
  }

  // ─── 초기화 ────────────────────────────────────────────────
  async function init() {
    if (!PAGE) {
      console.log('CMS: Unknown page, skipping dynamic content');
      return;
    }

    var sections = await fetchPageContent(PAGE, LANG);

    if (sections.length === 0) {
      console.log('CMS: No content found, using static HTML');
      return;
    }

    sections.forEach(function(section) {
      renderSection(section);
    });

    console.log('CMS: Rendered ' + sections.length + ' sections for ' + PAGE + ' (' + LANG + ')');
  }

  // DOMContentLoaded 후 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 글로벌 CMS 객체 노출 (디버깅용)
  window.CMS = {
    lang: LANG,
    page: PAGE,
    reload: init
  };
})();
