/* ========================
   main.js - Homepage Logic
   ======================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── PAGE LOAD ANIMATION ──
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });

  // ── NAV SCROLL ──
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    window.scrollY > 60 ? nav.classList.add('scrolled') : nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── MOBILE MENU ──
  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      const spans = toggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }));
  }

  // ── FILM STRIP BACKGROUND ──
  const filmStrip = document.getElementById('filmStrip');
  if (filmStrip) {
    const cols = Math.ceil(window.innerWidth / 84) + 2;
    for (let c = 0; c < cols; c++) {
      const col = document.createElement('div');
      col.className = 'film-strip-col';
      col.style.animationDuration = `${18 + c * 2.5}s`;
      for (let i = 0; i < 60; i++) {
        const cell = document.createElement('div');
        cell.className = 'film-strip-cell';
        cell.style.height = (50 + Math.floor(Math.random() * 80)) + 'px';
        col.appendChild(cell);
      }
      filmStrip.appendChild(col);
    }
  }

  // ── RENDER NOW SHOWING ──
  const filmsGrid = document.getElementById('filmsGrid');
  if (filmsGrid && typeof NSC_DATA !== 'undefined') {
    NSC_DATA.nowShowing.forEach(film => {
      const article = document.createElement('article');
      article.className = 'film-card reveal';
      article.style.cursor = 'pointer';
      article.innerHTML = `
        <div class="film-poster">
          <div class="film-poster-placeholder" style="background:linear-gradient(160deg,${film.color} 0%,#1a1a1a 100%)">
            <span style="font-size:3.5rem">${film.emoji}</span>
            <span class="genre-tag">${film.genre[0]}</span>
          </div>
          <div class="film-overlay">
            <button class="film-play-btn" aria-label="Lihat detail">▶</button>
          </div>
          <span class="film-badge ${film.badge === 'HOT' ? 'hot' : ''}">${film.badge}</span>
        </div>
        <div class="film-info">
          <h3 class="film-title">${film.title}</h3>
          <div class="film-meta">
            <span class="rating">★ ${film.rating}</span>
            <span class="dot">·</span>
            <span>${film.duration} min</span>
            <span class="dot">·</span>
            <span>${film.ageRating}</span>
          </div>
          <div class="film-genres">${film.genre.map(g => `<span>${g}</span>`).join('')}</div>
        </div>
      `;
      article.addEventListener('click', () => { window.location.href = `pages/film-detail.html?id=${film.id}`; });
      filmsGrid.appendChild(article);
    });
  }

  // ── RENDER COMING SOON ──
  const comingGrid = document.getElementById('comingGrid');
  if (comingGrid && typeof NSC_DATA !== 'undefined') {
    NSC_DATA.comingSoon.forEach(film => {
      const article = document.createElement('article');
      article.className = 'film-card reveal';
      article.innerHTML = `
        <div class="film-poster">
          <div class="film-poster-placeholder" style="background:linear-gradient(160deg,${film.color} 0%,#1a1a1a 100%)">
            <span style="font-size:3.5rem">${film.emoji}</span>
            <span class="genre-tag">${film.genre[0]}</span>
          </div>
          <span class="film-badge soon">${film.badge}</span>
        </div>
        <div class="film-info">
          <h3 class="film-title">${film.title}</h3>
          <div class="film-meta"><span>🗓 ${film.releaseDate}</span></div>
          <div class="film-genres">${film.genre.map(g => `<span>${g}</span>`).join('')}</div>
        </div>
      `;
      comingGrid.appendChild(article);
    });
  }

  // ── COUNTER ANIMATION ──
  const countUp = (el) => {
    const target = +el.dataset.count;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + target / 60, target);
      el.textContent = Math.floor(current);
      if (current >= target) { el.textContent = target; clearInterval(timer); }
    }, 20);
  };
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); statsObserver.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num[data-count]').forEach(c => statsObserver.observe(c));

  // ── SCROLL REVEAL ──
  const initReveals = () => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal:not(.visible)').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 0.07}s`;
      obs.observe(el);
    });
  };

  // Stagger exp cards
  document.querySelectorAll('.exp-card').forEach((card, i) => { card.style.transitionDelay = `${i * 0.08}s`; card.classList.add('reveal'); });
  document.querySelectorAll('.island-group').forEach((card, i) => { card.style.transitionDelay = `${i * 0.1}s`; card.classList.add('reveal'); });

  setTimeout(initReveals, 200);

  // ── HERO PARALLAX ──
  window.addEventListener('scroll', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && window.scrollY < window.innerHeight) {
      const ratio = window.scrollY / window.innerHeight;
      heroContent.style.transform = `translateY(${window.scrollY * 0.15}px)`;
      heroContent.style.opacity = Math.max(0, 1 - ratio * 1.5);
    }
  }, { passive: true });

});

// Auto-run on load end
window.addEventListener('load', () => {

  // ── BACK TO TOP ──
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Kembali ke atas');
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    window.scrollY > 400 ? btn.classList.add('visible') : btn.classList.remove('visible');
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── TOAST HELPER ──
  window.showToast = (msg, duration = 3000) => {
    let toast = document.querySelector('.nsc-toast');
    if (!toast) { toast = document.createElement('div'); toast.className = 'nsc-toast'; document.body.appendChild(toast); }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  };

  // ── SOCIAL LINK TOAST ──
  document.querySelectorAll('.socials a').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); showToast('🎬 Segera hadir di media sosial kami!'); });
  });

  // ── NEWSLETTER TOAST (footer links) ──
  document.querySelectorAll('.footer-legal a').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); showToast('📄 Halaman ini sedang dalam pengembangan.'); });
  });

});
