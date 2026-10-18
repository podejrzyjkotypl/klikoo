(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  $('#yr').textContent = new Date().getFullYear();
  const burger = $('.burger'), menu = $('#menu');
  burger.addEventListener('click', () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
  $$('#menu a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  // draggable stickers (pointer events, works with touch)
  const play = $('.play');
  $$('.sticker').forEach(s => { let ox, oy;
    s.addEventListener('pointerdown', e => { s.setPointerCapture(e.pointerId); s.classList.add('drag'); const r = s.getBoundingClientRect(); ox = e.clientX - r.left; oy = e.clientY - r.top; });
    s.addEventListener('pointermove', e => { if (!s.classList.contains('drag')) return; const pr = play.getBoundingClientRect();
      const x = Math.max(0, Math.min(pr.width - s.offsetWidth, e.clientX - pr.left - ox)), y = Math.max(0, Math.min(pr.height - s.offsetHeight, e.clientY - pr.top - oy));
      s.style.left = x + 'px'; s.style.top = y + 'px'; });
    const end = () => { s.classList.remove('drag'); s.style.setProperty('--r', (Math.random() * 16 - 8).toFixed(1) + 'deg'); };
    s.addEventListener('pointerup', end); s.addEventListener('pointercancel', end); });
  // reveal
  $$('.tile,.sec>h2,.proj').forEach(el => el.classList.add('pop-in'));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1 });
  $$('.pop-in').forEach(el => io.observe(el));
  // stepper tabs w/ autoplay
  const tabs = $$('.tabs button'), panes = $$('.pane'), bar = $('#autoBar'); let cur = 0, t0 = performance.now(), paused = false; const DUR = 4000;
  const go = i => { cur = i; tabs.forEach((t, k) => { t.classList.toggle('on', k === i); t.setAttribute('aria-selected', k === i); }); panes.forEach((p, k) => p.classList.toggle('on', k === i)); t0 = performance.now(); };
  tabs.forEach(t => t.addEventListener('click', () => { go(+t.dataset.i); }));
  $('.stepper').addEventListener('mouseenter', () => paused = true); $('.stepper').addEventListener('mouseleave', () => { paused = false; t0 = performance.now(); });
  (function tick(n) { if (paused) t0 = n - (parseFloat(bar.style.width) || 0) / 100 * DUR; const p = (n - t0) / DUR; bar.style.width = Math.min(100, p * 100) + '%'; if (p >= 1) go((cur + 1) % 4); requestAnimationFrame(tick); })(t0);
  // carousel: arrows + drag
  const car = $('#car'), step = () => car.firstElementChild.offsetWidth + 16;
  $('#prev').addEventListener('click', () => car.scrollBy({ left: -step() })); $('#next').addEventListener('click', () => car.scrollBy({ left: step() }));
  let down = false, sx, sl;
  car.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = car.scrollLeft; moved = false; car.classList.add('dragging'); });
  let moved = false;
  addEventListener('pointermove', e => { if (down) { car.scrollLeft = sl - (e.clientX - sx); if (Math.abs(e.clientX - sx) > 6) moved = true; } });
  car.addEventListener('click', e => { if (moved) { e.preventDefault(); moved = false; } }, true);
  addEventListener('pointerup', () => { if (down) { down = false; car.classList.remove('dragging'); } });
  // drag & drop builder
  const blocks = $('#blocks'), drop = $('#drop'), sumEl = $('#sum'); let shown = 0;
  const update = () => { const items = $$('.blk', drop); $('.empty', drop) || null; const em = $('.empty', drop); if (em) em.style.display = items.length ? 'none' : '';
    const v = items.reduce((a, b) => a + +b.dataset.p, 0); const from = shown, s0 = performance.now();
    (function f(n) { const p = Math.min(1, (n - s0) / 450); shown = Math.round(from + (v - from) * p); sumEl.textContent = shown.toLocaleString('pl-PL') + ' zł'; if (p < 1) requestAnimationFrame(f); })(s0);
    sumEl.classList.remove('pulse'); void sumEl.offsetWidth; sumEl.classList.add('pulse'); };
  const move = b => { (b.parentElement === drop ? blocks : drop).appendChild(b); update(); };
  let dragged = null;
  $$('.blk').forEach(b => { b.addEventListener('click', () => move(b));
    b.addEventListener('dragstart', e => { dragged = b; b.classList.add('ghost'); e.dataTransfer.setData('text/plain', b.dataset.n); });
    b.addEventListener('dragend', () => b.classList.remove('ghost')); });
  [drop, blocks].forEach(z => { z.addEventListener('dragover', e => { e.preventDefault(); if (z === drop) drop.classList.add('over'); });
    z.addEventListener('dragleave', () => drop.classList.remove('over'));
    z.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('over'); if (dragged && dragged.parentElement !== z) { z.appendChild(dragged); update(); } dragged = null; }); });
  // chat FAQ
  const log = $('#log');
  $$('.qs button').forEach(b => b.addEventListener('click', () => { b.classList.add('used');
    const me = document.createElement('div'); me.className = 'msg me'; me.textContent = b.textContent; log.appendChild(me);
    const ty = document.createElement('div'); ty.className = 'msg them typing'; ty.innerHTML = '<i></i><i></i><i></i>'; log.appendChild(ty); log.scrollTop = log.scrollHeight;
    setTimeout(() => { ty.className = 'msg them'; ty.textContent = b.dataset.a; log.scrollTop = log.scrollHeight; }, 800); }));
  // moods
  $$('.moods button').forEach(b => b.addEventListener('click', () => { $$('.moods button').forEach(x => x.classList.remove('on')); b.classList.add('on'); }));
  // form + confetti
  $('#form').addEventListener('submit', e => { e.preventDefault(); let ok = true;
    $$('input,textarea', e.target).forEach(i => { const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.classList.toggle('err', bad); if (bad) ok = false; });
    if (ok) { e.target.hidden = true; $('#thanks').hidden = false; confetti(); } });
  function confetti() { const c = $('#confetti'), x = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
    const cols = ['#7c5cff', '#ffb59a', '#8fe0bf', '#ffd95e', '#c9b6ff'];
    const ps = Array.from({ length: 140 }, () => ({ x: innerWidth / 2, y: innerHeight * .6, vx: (Math.random() - .5) * 14, vy: -Math.random() * 16 - 4, s: Math.random() * 8 + 4, c: cols[Math.random() * 5 | 0], r: Math.random() * 6 }));
    let f = 0; (function d() { x.clearRect(0, 0, c.width, c.height); ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .45; p.r += .1; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore(); });
      if (++f < 160) requestAnimationFrame(d); else x.clearRect(0, 0, c.width, c.height); })(); }
})();
