/* ========================
   pages.js - Inner Pages Logic
   ======================== */

// ── SHARED: CURSOR & NAV ──
function initShared() {
  // Mobile menu
  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  // Scroll reveal
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
  }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 0.08}s`;
      revealObserver.observe(el);
    });
  }, 50);
}

// ── FILM CARD HTML ──
function filmCardHTML(film, isSoon = false) {
  const clickAttr = (!isSoon && film.id) ? `onclick="window.location='film-detail.html?id=${film.id}'" style="cursor:pointer;"` : '';
  const overlayBtn = !isSoon && film.id ? `<div class="film-overlay"><button class="film-play-btn" onclick="event.stopPropagation(); window.location='film-detail.html?id=${film.id}'">▶</button></div>` : '';
  return `
    <article class="film-card reveal" data-genres="${film.genre.join(',')}" data-type="${isSoon ? 'soon' : 'now'}" ${clickAttr}>
      <div class="film-poster">
        <div class="film-poster-placeholder" style="background:linear-gradient(160deg,${film.color || '#1a1a1a'} 0%,#1a1a1a 100%)">
          <span style="font-size:3.5rem">${film.emoji || '🎬'}</span>
          <span class="genre-tag">${film.genre[0]}</span>
        </div>
        ${overlayBtn}
        <span class="film-badge ${film.badge === 'HOT' ? 'hot' : isSoon ? 'soon' : ''}">${film.badge || (isSoon ? 'SEGERA' : '')}</span>
      </div>
      <div class="film-info">
        <h3 class="film-title">${film.title}</h3>
        <div class="film-meta">
          ${film.rating ? `<span class="rating">★ ${film.rating}</span><span class="dot">·</span>` : ''}
          ${film.duration ? `<span>${film.duration} min</span><span class="dot">·</span>` : ''}
          ${film.ageRating ? `<span>${film.ageRating}</span>` : ''}
          ${film.releaseDate ? `<span>🗓 ${film.releaseDate}</span>` : ''}
        </div>
        <div class="film-genres">${film.genre.map(g => `<span>${g}</span>`).join('')}</div>
      </div>
    </article>`;
}

// ── FILMS PAGE ──
function renderFilmsPage() {
  initShared();
  const nowGrid = document.getElementById('nowGrid');
  const soonGrid = document.getElementById('soonGrid');
  if (nowGrid) NSC_DATA.nowShowing.forEach(f => nowGrid.insertAdjacentHTML('beforeend', filmCardHTML(f, false)));
  if (soonGrid) NSC_DATA.comingSoon.forEach(f => soonGrid.insertAdjacentHTML('beforeend', filmCardHTML(f, true)));

  // Filters
  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const nowSection = document.getElementById('nowSection');
      const soonSection = document.getElementById('soonSection');
      document.querySelectorAll('.film-card').forEach(card => {
        const genres = card.dataset.genres || '';
        const type = card.dataset.type || '';
        let show = true;
        if (filter === 'now') show = type === 'now';
        else if (filter === 'soon') show = type === 'soon';
        else if (filter !== 'all') show = genres.includes(filter);
        card.style.display = show ? '' : 'none';
      });
      if (filter === 'soon') { nowSection && (nowSection.style.display = 'none'); soonSection && (soonSection.style.display = ''); }
      else if (filter === 'now') { nowSection && (nowSection.style.display = ''); soonSection && (soonSection.style.display = 'none'); }
      else { nowSection && (nowSection.style.display = ''); soonSection && (soonSection.style.display = ''); }
    });
  });

  // Search
  const searchInput = document.getElementById('filmSearch');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      document.querySelectorAll('.film-card').forEach(card => {
        const title = card.querySelector('.film-title')?.textContent.toLowerCase() || '';
        const genres = card.dataset.genres?.toLowerCase() || '';
        card.style.display = (title.includes(q) || genres.includes(q)) ? '' : 'none';
      });
    });
  }

  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 5) * 0.07}s`;
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
      }, { threshold: 0.05 });
      obs.observe(el);
    });
  }, 100);
}

// ── CINEMAS PAGE ──
function renderCinemasPage() {
  initShared();
  const grid = document.getElementById('cinemasGrid');
  if (!grid) return;

  const renderCinemas = (filter = 'all', search = '') => {
    grid.innerHTML = '';
    NSC_DATA.cinemas
      .filter(c => {
        const matchArea = filter === 'all' || c.area === filter || c.area.includes(filter);
        const matchSearch = !search || c.name.toLowerCase().includes(search) || c.city.toLowerCase().includes(search);
        return matchArea && matchSearch;
      })
      .forEach(c => {
        grid.insertAdjacentHTML('beforeend', `
          <div class="cinema-card reveal">
            <div class="cinema-card-img">${c.emoji}</div>
            <div class="cinema-card-body">
              <div class="location">${c.city} · ${c.area}</div>
              <h3>${c.name}</h3>
              <p>${c.address}</p>
              <div class="cinema-features">${c.features.map(f => `<span>${f}</span>`).join('')}</div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-top:0.75rem;">
                <span style="font-size:0.8rem; color:var(--gray)">${c.studios} Studio</span>
                <a href="schedule.html" class="btn-primary" style="padding:0.5rem 1rem; font-size:0.75rem;">Lihat Jadwal</a>
              </div>
            </div>
          </div>
        `);
      });
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        const obs = new IntersectionObserver(entries => {
          entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
        }, { threshold: 0.05 });
        obs.observe(el);
      });
    }, 50);
  };

  let currentArea = 'all', currentSearch = '';
  renderCinemas();

  document.querySelectorAll('.filter-btn[data-area]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-area]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentArea = btn.dataset.area;
      renderCinemas(currentArea, currentSearch);
    });
  });
  const cinSearch = document.getElementById('cinemaSearch');
  if (cinSearch) {
    cinSearch.addEventListener('input', () => {
      currentSearch = cinSearch.value.toLowerCase();
      renderCinemas(currentArea, currentSearch);
    });
  }
}

// ── SCHEDULE PAGE ──
function renderSchedulePage() {
  initShared();
  const cinemaSelect = document.getElementById('cinemaSelect');
  const dateTabs = document.getElementById('dateTabs');
  const showtimesContainer = document.getElementById('showtimesContainer');

  if (cinemaSelect) {
    NSC_DATA.cinemas.forEach(c => {
      cinemaSelect.insertAdjacentHTML('beforeend', `<option value="${c.id}">${c.name} – ${c.city}</option>`);
    });
  }

  if (dateTabs) {
    NSC_DATA.scheduleData.dates.forEach((d, i) => {
      const btn = document.createElement('button');
      btn.className = 'date-tab' + (i === 0 ? ' active' : '');
      btn.innerHTML = `<span class="day">${d.day}</span><span class="num">${d.num}</span>`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.date-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderShowtimes();
      });
      dateTabs.appendChild(btn);
    });
  }

  function renderShowtimes() {
    if (!showtimesContainer) return;
    showtimesContainer.innerHTML = '';
    NSC_DATA.scheduleData.showtimes.forEach(show => {
      const group = document.createElement('div');
      group.className = 'showtimes-group';
      const film = NSC_DATA.nowShowing.find(f => f.id === show.filmId);
      group.innerHTML = `
        <div class="showtime-film-name">
          ${film ? `<span style="font-size:1.5rem">${film.emoji}</span>` : ''}
          ${show.film}
          ${film ? `<span style="font-size:0.65rem; letter-spacing:0.1em; color:var(--gold); background:rgba(201,168,76,0.1); border:1px solid rgba(201,168,76,0.2); padding:0.2rem 0.5rem; border-radius:2px;">${film.ageRating}</span>` : ''}
        </div>
        <div class="showtime-slots">
          ${show.slots.map(slot => `
            <button class="slot-btn ${!slot.available ? 'sold-out' : ''}" ${!slot.available ? 'disabled' : ''} onclick="window.location='booking.html'">
              <span class="time">${slot.time}</span>
              <span class="type">${slot.type}</span>
            </button>
          `).join('')}
        </div>
      `;
      showtimesContainer.appendChild(group);
    });
  }

  renderShowtimes();
  if (cinemaSelect) cinemaSelect.addEventListener('change', renderShowtimes);
}

// ── PROMO PAGE ──
function renderPromoPage() {
  initShared();
  const grid = document.getElementById('promoGrid');
  if (!grid) return;
  NSC_DATA.promos.forEach(p => {
    grid.insertAdjacentHTML('beforeend', `
      <div class="promo-card reveal">
        <div class="promo-card-header">${p.emoji}</div>
        <div class="promo-card-body">
          <span class="promo-badge" style="margin-bottom:0.75rem; display:inline-block;">${p.badge}</span>
          <h3>${p.title}</h3>
          <span class="discount">${p.discount}</span>
          <p>${p.desc}</p>
          <p class="terms">${p.terms}</p>
        </div>
      </div>
    `);
  });
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
      }, { threshold: 0.05 });
      obs.observe(el);
    });
  }, 50);
}

// ── ABOUT PAGE ──
function renderAboutPage() {
  initShared();

  // Timeline
  const timeline = document.getElementById('timeline');
  if (timeline) {
    NSC_DATA.milestones.forEach((m, i) => {
      timeline.insertAdjacentHTML('beforeend', `
        <div style="display:flex; gap:1.5rem; margin-bottom:1.5rem; align-items:flex-start;" class="reveal">
          <div style="flex-shrink:0; width:70px; text-align:right;">
            <span style="font-family:var(--font-display); font-size:1.3rem; color:var(--gold); letter-spacing:0.05em;">${m.year}</span>
          </div>
          <div style="width:1px; background:rgba(201,168,76,0.3); flex-shrink:0; position:relative; margin-top:4px;">
            <div style="width:10px; height:10px; border-radius:50%; background:var(--gold); position:absolute; top:0; left:-4.5px;"></div>
          </div>
          <div style="padding-bottom:1.5rem;">
            <p style="font-size:0.9rem; color:var(--gray-light); line-height:1.6;">${m.event}</p>
          </div>
        </div>
      `);
    });
  }

  // Team
  const teamGrid = document.getElementById('teamGrid');
  if (teamGrid) {
    NSC_DATA.teamMembers.forEach(m => {
      teamGrid.insertAdjacentHTML('beforeend', `
        <div class="team-card reveal">
          <div class="team-avatar">${m.emoji}</div>
          <h4>${m.name}</h4>
          <p>${m.role}</p>
        </div>
      `);
    });
  }

  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
      }, { threshold: 0.05 });
      obs.observe(el);
    });
  }, 50);
}

// ── BOOKING PAGE ──
function renderBookingPage() {
  initShared();

  const PRICE_REGULAR = 45000;
  const PRICE_PREMIUM = 75000;
  let selectedSeats = [];
  let selectedFilm = null;
  let selectedTime = null;
  let selectedCinema = null;

  // Populate selects
  const filmSelect = document.getElementById('filmSelect');
  const cinemaSelect = document.getElementById('cinemaSelectBook');
  if (filmSelect) NSC_DATA.nowShowing.forEach(f => filmSelect.insertAdjacentHTML('beforeend', `<option value="${f.id}">${f.title}</option>`));
  if (cinemaSelect) NSC_DATA.cinemas.slice(0, 6).forEach(c => cinemaSelect.insertAdjacentHTML('beforeend', `<option value="${c.id}">${c.name}</option>`));

  // Date tabs
  const dateTabs = document.getElementById('bookDateTabs');
  if (dateTabs) {
    NSC_DATA.scheduleData.dates.forEach((d, i) => {
      const btn = document.createElement('button');
      btn.className = 'date-tab' + (i === 0 ? ' active' : '');
      btn.innerHTML = `<span class="day">${d.day}</span><span class="num">${d.num}</span>`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('#bookDateTabs .date-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderBookShowtimes();
      });
      dateTabs.appendChild(btn);
    });
  }

  function renderBookShowtimes() {
    const container = document.getElementById('bookShowtimes');
    if (!container) return;
    container.innerHTML = '';
    const filmId = filmSelect ? parseInt(filmSelect.value) : null;
    const shows = filmId ? NSC_DATA.scheduleData.showtimes.filter(s => s.filmId === filmId) : NSC_DATA.scheduleData.showtimes;
    shows.forEach(show => {
      container.insertAdjacentHTML('beforeend', `
        <div class="showtimes-group">
          <div class="showtime-film-name" style="font-size:1rem;">${show.film}</div>
          <div class="showtime-slots">
            ${show.slots.map(slot => `
              <button class="slot-btn ${!slot.available ? 'sold-out' : ''}" ${!slot.available ? 'disabled' : ''}
                data-time="${slot.time}" data-type="${slot.type}" data-film="${show.film}"
                onclick="selectSlot(this)">
                <span class="time">${slot.time}</span>
                <span class="type">${slot.type}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `);
    });
  }

  window.selectSlot = function(btn) {
    document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedTime = btn.dataset.time;
    selectedFilm = btn.dataset.film;
    const goBtn = document.getElementById('goToSeats');
    if (goBtn) { goBtn.disabled = false; goBtn.style.opacity = '1'; goBtn.style.cursor = 'pointer'; }
  };

  if (filmSelect) filmSelect.addEventListener('change', renderBookShowtimes);
  renderBookShowtimes();

  // Go to seats
  document.getElementById('goToSeats')?.addEventListener('click', () => {
    document.getElementById('bookStep1').style.display = 'none';
    document.getElementById('bookStep2').style.display = '';
    document.getElementById('step1').classList.remove('active'); document.getElementById('step1').classList.add('done');
    document.getElementById('step2').classList.add('active');
    renderSeatMap();
  });

  // Seat map
  function renderSeatMap() {
    const seatMap = document.getElementById('seatMap');
    if (!seatMap) return;
    selectedSeats = [];

    const rows = ['A','B','C','D','E','F','G','H'];
    const seatsPerRow = 10;
    const takenSeats = ['A3','A4','B7','C2','C5','D8','E1','F6','G3','G4'];
    const premiumRows = ['G','H'];

    seatMap.innerHTML = `
      <div class="screen-indicator">LAYAR</div>
      <div class="seat-grid" id="seatGrid"></div>
      <div class="seat-legend">
        <div class="legend-item"><div class="legend-swatch" style="background:var(--dark3); border:1px solid rgba(255,255,255,0.12);"></div> Tersedia</div>
        <div class="legend-item"><div class="legend-swatch" style="background:var(--gold);"></div> Dipilih</div>
        <div class="legend-item"><div class="legend-swatch" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.04);"></div> Terisi</div>
        <div class="legend-item"><div class="legend-swatch" style="border:1px solid rgba(201,168,76,0.3); background:var(--dark3);"></div> Premium</div>
      </div>
    `;

    const grid = document.getElementById('seatGrid');
    rows.forEach(row => {
      const rowEl = document.createElement('div');
      rowEl.className = 'seat-row';
      rowEl.innerHTML = `<div class="seat-row-label">${row}</div>`;
      for (let i = 1; i <= seatsPerRow; i++) {
        if (i === 5) { const gap = document.createElement('div'); gap.className = 'seat gap'; rowEl.appendChild(gap); }
        const seatId = `${row}${i}`;
        const seat = document.createElement('div');
        seat.className = 'seat' + (takenSeats.includes(seatId) ? ' taken' : '') + (premiumRows.includes(row) ? ' premium' : '');
        seat.dataset.id = seatId;
        seat.dataset.price = premiumRows.includes(row) ? PRICE_PREMIUM : PRICE_REGULAR;
        if (!takenSeats.includes(seatId)) {
          seat.addEventListener('click', () => toggleSeat(seat));
        }
        rowEl.appendChild(seat);
      }
      rowEl.insertAdjacentHTML('beforeend', `<div class="seat-row-label">${row}</div>`);
      grid.appendChild(rowEl);
    });
    updateSummary();
  }

  function toggleSeat(seat) {
    const id = seat.dataset.id;
    if (seat.classList.contains('selected')) {
      seat.classList.remove('selected');
      selectedSeats = selectedSeats.filter(s => s !== id);
    } else {
      if (selectedSeats.length >= 6) { alert('Maksimal 6 kursi per transaksi.'); return; }
      seat.classList.add('selected');
      selectedSeats.push(id);
    }
    const payBtn = document.getElementById('goToPayment');
    if (payBtn) {
      payBtn.disabled = selectedSeats.length === 0;
      payBtn.style.opacity = selectedSeats.length > 0 ? '1' : '0.4';
      payBtn.style.cursor = selectedSeats.length > 0 ? 'pointer' : 'not-allowed';
    }
    updateSummary();
  }

  function updateSummary() {
    const summaryContent = document.getElementById('summaryContent');
    if (!summaryContent) return;
    if (selectedSeats.length === 0) {
      summaryContent.innerHTML = '<p style="color:var(--gray); font-size:0.875rem;">Pilih kursi untuk melihat detail.</p>';
      return;
    }
    const total = selectedSeats.reduce((sum, id) => {
      const seat = document.querySelector(`.seat[data-id="${id}"]`);
      return sum + (seat ? parseInt(seat.dataset.price) : PRICE_REGULAR);
    }, 0);
    summaryContent.innerHTML = `
      <div class="summary-row"><span class="key">Film</span><span class="val">${selectedFilm || 'Film'}</span></div>
      <div class="summary-row"><span class="key">Waktu</span><span class="val">${selectedTime || '-'}</span></div>
      <div class="summary-row"><span class="key">Kursi</span><span class="val">${selectedSeats.join(', ')}</span></div>
      <div class="summary-row"><span class="key">Jumlah</span><span class="val">${selectedSeats.length} tiket</span></div>
      <div class="summary-total">
        <span class="key">TOTAL</span>
        <span class="val">Rp ${total.toLocaleString('id-ID')}</span>
      </div>
      <button class="btn-primary" style="width:100%; margin-top:1rem;" id="goToPaymentBtn">Lanjut →</button>
    `;
    document.getElementById('goToPaymentBtn')?.addEventListener('click', goToPayment);
  }

  function goToPayment() {
    document.getElementById('bookStep2').style.display = 'none';
    document.getElementById('bookStep3').style.display = '';
    document.getElementById('step2').classList.remove('active'); document.getElementById('step2').classList.add('done');
    document.getElementById('step3').classList.add('active');
    renderPaymentStep();
  }

  document.getElementById('goToPayment')?.addEventListener('click', goToPayment);
  document.getElementById('backToStep1')?.addEventListener('click', () => {
    document.getElementById('bookStep2').style.display = 'none';
    document.getElementById('bookStep1').style.display = '';
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1').classList.remove('done'); document.getElementById('step1').classList.add('active');
  });

  function renderPaymentStep() {
    const methods = document.getElementById('paymentMethods');
    const summary2 = document.getElementById('ticketSummary2');
    const payments = [
      { name: 'Kartu Kredit', emoji: '💳' },
      { name: 'Transfer Bank', emoji: '🏦' },
      { name: 'GoPay', emoji: '📱' },
      { name: 'OVO', emoji: '💜' },
      { name: 'QRIS', emoji: '📷' },
      { name: 'NSC Pay', emoji: '⭐' },
    ];
    if (methods) {
      methods.innerHTML = '';
      payments.forEach(p => {
        const btn = document.createElement('button');
        btn.style.cssText = 'background:var(--dark3); border:1px solid rgba(255,255,255,0.1); color:var(--white); padding:0.75rem; border-radius:var(--radius); font-family:var(--font-body); font-size:0.75rem; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:0.35rem; transition:all 0.2s;';
        btn.innerHTML = `<span style="font-size:1.3rem">${p.emoji}</span>${p.name}`;
        btn.addEventListener('click', () => {
          methods.querySelectorAll('button').forEach(b => { b.style.borderColor = 'rgba(255,255,255,0.1)'; b.style.background = 'var(--dark3)'; });
          btn.style.borderColor = 'var(--gold)';
          btn.style.background = 'rgba(201,168,76,0.08)';
        });
        methods.appendChild(btn);
      });
    }
    if (summary2) {
      const total = selectedSeats.reduce((sum, id) => {
        const seat = document.querySelector(`.seat[data-id="${id}"]`);
        return sum + (seat ? parseInt(seat.dataset.price) : PRICE_REGULAR);
      }, 0);
      summary2.innerHTML = `
        <h3>Ringkasan Pesanan</h3>
        <div class="summary-row"><span class="key">Film</span><span class="val">${selectedFilm}</span></div>
        <div class="summary-row"><span class="key">Waktu</span><span class="val">${selectedTime}</span></div>
        <div class="summary-row"><span class="key">Kursi</span><span class="val">${selectedSeats.join(', ')}</span></div>
        <div class="summary-row"><span class="key">Subtotal</span><span class="val">Rp ${total.toLocaleString('id-ID')}</span></div>
        <div class="summary-row"><span class="key">Biaya Layanan</span><span class="val">Rp ${(2500 * selectedSeats.length).toLocaleString('id-ID')}</span></div>
        <div class="summary-total">
          <span class="key">TOTAL</span>
          <span class="val">Rp ${(total + 2500 * selectedSeats.length).toLocaleString('id-ID')}</span>
        </div>
      `;
    }
  }

  document.getElementById('backToStep2')?.addEventListener('click', () => {
    document.getElementById('bookStep3').style.display = 'none';
    document.getElementById('bookStep2').style.display = '';
    document.getElementById('step3').classList.remove('active');
    document.getElementById('step2').classList.remove('done'); document.getElementById('step2').classList.add('active');
  });

  document.getElementById('confirmOrder')?.addEventListener('click', () => {
    document.getElementById('bookStep3').style.display = 'none';
    document.getElementById('bookStep4').style.display = '';
    document.getElementById('step3').classList.remove('active'); document.getElementById('step3').classList.add('done');
    document.getElementById('step4').classList.add('active');
    const total = selectedSeats.reduce((sum, id) => {
      const seat = document.querySelector(`.seat[data-id="${id}"]`);
      return sum + (seat ? parseInt(seat.dataset.price) : PRICE_REGULAR);
    }, 0);
    const bookingCode = 'NSC' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const confirmTicket = document.getElementById('confirmTicket');
    if (confirmTicket) {
      confirmTicket.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <div style="font-family:var(--font-display); font-size:1.5rem; color:var(--gold); letter-spacing:0.05em;">★ NEW STAR CINEPLEX</div>
          <div style="border-top:1px solid rgba(255,255,255,0.07); padding-top:0.75rem; display:flex; flex-direction:column; gap:0.5rem;">
            <div style="display:flex; justify-content:space-between;"><span style="color:var(--gray); font-size:0.8rem;">Film</span><span style="font-size:0.85rem;">${selectedFilm}</span></div>
            <div style="display:flex; justify-content:space-between;"><span style="color:var(--gray); font-size:0.8rem;">Kursi</span><span style="font-size:0.85rem;">${selectedSeats.join(', ')}</span></div>
            <div style="display:flex; justify-content:space-between;"><span style="color:var(--gray); font-size:0.8rem;">Jam</span><span style="font-size:0.85rem;">${selectedTime}</span></div>
            <div style="display:flex; justify-content:space-between;"><span style="color:var(--gray); font-size:0.8rem;">Kode Booking</span><span style="font-family:monospace; font-size:0.9rem; color:var(--gold);">${bookingCode}</span></div>
          </div>
        </div>
      `;
    }
  });
}

// ── GLOBAL: BACK TO TOP for all pages ──
window.addEventListener('load', () => {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Kembali ke atas');
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    window.scrollY > 300 ? btn.classList.add('visible') : btn.classList.remove('visible');
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Toast helper
  window.showToast = (msg, dur = 3000) => {
    let t = document.querySelector('.nsc-toast');
    if (!t) { t = document.createElement('div'); t.className = 'nsc-toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), dur);
  };

  // Contact form on about page
  const contactBtn = document.querySelector('#contact .btn-primary');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => showToast('✅ Pesan Anda telah terkirim! Kami akan menghubungi Anda segera.'));
  }
});
