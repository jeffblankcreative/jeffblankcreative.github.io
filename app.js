(() => {
  const S = window.__SITE__ || {};
  const qs = new URLSearchParams(location.search);
  if (qs.get('theme')) document.documentElement.dataset.theme = qs.get('theme');
  if (S.showRanPost || qs.get('ranpost') === '1') document.getElementById('ranpost').hidden = false;

  const grids = [...document.querySelectorAll('.grid[data-grid]:not([data-grid="ranpost"])')];
  const tabs = [...document.querySelectorAll('[data-tab-link]')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(id) {
    if (!grids.some(g => g.dataset.grid === id)) id = S.defaultTab || 'unscripted';
    grids.forEach(g => g.hidden = g.dataset.grid !== id);
    tabs.forEach(t => t.classList.contains('tab') && t.setAttribute('aria-current', t.dataset.tabLink === id ? 'page' : 'false'));
    fillLast();
    document.title = 'Jeff Blank — ' + (id === 'scripted' ? 'Scripted' : 'Unscripted');
  }
  function route() {
    const h = location.hash.slice(1);
    if (h === 'contact') return;
    show(h);
  }
  // 2-column (mobile) grids: if the tiles leave one empty cell at the end, let the last tile span both columns
  function fillLast() {
    for (const g of grids) {
      const tiles = [...g.children];
      tiles.forEach(t => t.classList.remove('fill-last'));
      if (g.hidden || !tiles.length) continue;
      const cols = getComputedStyle(g).gridTemplateColumns.split(' ').length;
      const cells = tiles.reduce((n, t) => n + (t.classList.contains('tall') ? 2 : 1), 0);
      const last = tiles[tiles.length - 1];
      if (cols === 2 && cells % 2 && !last.classList.contains('tall')) last.classList.add('fill-last');
    }
  }
  addEventListener('resize', fillLast);
  addEventListener('hashchange', () => { route(); if (location.hash !== '#contact') scrollTo({ top: 0 }); });
  route();

  // lazy-load + play only what is near the viewport
  const load = v => {
    if (v.dataset.loaded) return;
    v.dataset.loaded = '1';
    for (const s of v.querySelectorAll('source[data-src]')) s.src = s.dataset.src;
    v.load();
  };
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      const v = e.target;
      if (e.isIntersecting) { load(v); if (!reduce) v.play().catch(() => {}); }
      else if (v.dataset.loaded) v.pause();
    }
  }, { rootMargin: '300px 0px' });
  document.querySelectorAll('.tile video').forEach(v => io.observe(v));

  // lightbox for Wix-only files
  const lb = document.getElementById('lightbox');
  const lbv = lb.querySelector('video');
  document.addEventListener('click', e => {
    const t = e.target.closest('.tile[data-full]');
    if (!t) return;
    e.preventDefault();
    lbv.src = t.dataset.full;
    lb.querySelector('.lb-title').textContent = t.dataset.title || '';
    lb.showModal();
    lbv.play().catch(() => {});
  });
  const close = () => { lbv.pause(); lbv.removeAttribute('src'); lbv.load(); lb.close(); };
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  lb.addEventListener('cancel', e => { e.preventDefault(); close(); });
})();
