(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const b = $('.burger'), m = $('#menu');
  b.addEventListener('click', () => { const o = m.classList.toggle('open'); b.setAttribute('aria-expanded', o); });
  $$('#menu a').forEach(a => a.addEventListener('click', () => { m.classList.remove('open'); b.setAttribute('aria-expanded', false); }));
  // opening hours & live status
  const H = { 0: [9, 20], 1: null, 2: [11, 21], 3: [11, 21], 4: [11, 21], 5: [11, 23], 6: [9, 23] };
  const now = new Date(), d = now.getDay(), h = now.getHours() + now.getMinutes() / 60, st = $('#status');
  $(`#hours tr[data-d="${d}"]`).classList.add('today');
  const open = H[d] && h >= H[d][0] && h < H[d][1];
  st.classList.add(open ? 'open' : 'closed');
  st.querySelector('span').textContent = open ? `Otwarte teraz · do ${H[d][1]}:00` : 'Teraz zamknięte · zajrzyj w godziny otwarcia';
  // plate parallax
  const plate = $('#plate');
  addEventListener('mousemove', e => { const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5; plate.style.transform = `translate(${x * 20}px,${y * 20}px)`; });
  // menu tabs
  const show = c => $$('#menuList li').forEach(li => { const hide = li.dataset.c !== c; li.classList.toggle('hide', hide); if (!hide) { li.style.animation = 'none'; li.offsetWidth; li.style.animation = ''; } });
  $$('.tabs button').forEach(t => t.addEventListener('click', () => { $$('.tabs button').forEach(x => x.classList.remove('on')); t.classList.add('on'); show(t.dataset.c); }));
  show('sniadania');
  // lightbox
  const lb = $('#lb');
  $$('.g').forEach(g => g.addEventListener('click', () => { $('#lbImg').innerHTML = g.innerHTML; $('#lbT').textContent = g.dataset.t; lb.hidden = false; }));
  lb.addEventListener('click', e => { if (e.target === lb || e.target.tagName === 'BUTTON') lb.hidden = true; });
  addEventListener('keydown', e => { if (e.key === 'Escape') lb.hidden = true; });
  // reservation
  const date = $('#date'), hour = $('#hour'); const iso = x => x.toISOString().slice(0, 10);
  date.min = iso(now); let nd = new Date(now.getTime() + 864e5); if (nd.getDay() === 1) nd = new Date(nd.getTime() + 864e5); date.value = iso(nd);
  const fillHours = () => { const dd = new Date(date.value + 'T12:00').getDay(), r = H[dd]; hour.innerHTML = '';
    if (!r) { hour.innerHTML = '<option value="">W poniedziałki nieczynne</option>'; return; }
    for (let t = r[0]; t < r[1] - .5; t += .5) { const o = document.createElement('option'); o.textContent = `${Math.floor(t)}:${t % 1 ? '30' : '00'}`; hour.appendChild(o); } };
  date.addEventListener('change', fillHours); fillHours();
  let ppl = 2; const out = $('#ppl'), tbl = $('#tbl');
  const upd = () => { out.textContent = ppl; tbl.textContent = '🪑'.repeat(Math.min(ppl, 8)) + (ppl > 8 ? '+' : ''); };
  $('#minus').onclick = () => { ppl = Math.max(1, ppl - 1); upd(); }; $('#plus').onclick = () => { ppl = Math.min(12, ppl + 1); upd(); }; upd();
  $('#res').addEventListener('submit', e => { e.preventDefault(); let ok = true;
    $$('#res [required]').forEach(i => { const bad = !i.value.trim(); i.classList.toggle('err', bad); if (bad) ok = false; });
    if (!ok) return; const f = e.target;
    $('#doneTxt').textContent = `${f.n.value}, rezerwacja dla ${ppl} os. na ${new Date(date.value).toLocaleDateString('pl-PL')} o ${hour.value}.`;
    f.hidden = true; $('#done').hidden = false; });
  // reveal
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1 });
  $$('h2,.menu,.gal,.card,.hours,.map').forEach(el => { el.classList.add('rv'); io.observe(el); });
})();
