(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const b = $('.burger'), m = $('#menu');
  b.addEventListener('click', () => { const o = m.classList.toggle('open'); b.setAttribute('aria-expanded', o); });
  $$('#menu a').forEach(a => a.addEventListener('click', () => { m.classList.remove('open'); b.setAttribute('aria-expanded', false); }));
  // rotating word
  const words = ['Cięcie.', 'Styl.', 'Blask.', 'Zmiana.'], sw = $('#sw'); let i = 0;
  setInterval(() => { sw.classList.add('out'); setTimeout(() => { sw.textContent = words[i = (i + 1) % words.length]; sw.classList.remove('out'); }, 300); }, 2400);
  // hair colour swatches
  $$('.swatches button').forEach(s => s.addEventListener('click', () => { $$('.swatches button').forEach(x => x.classList.remove('on')); s.classList.add('on'); $$('.hair').forEach(h => h.setAttribute('fill', getComputedStyle(s).getPropertyValue('--c').trim())); }));
  // services filter
  $$('.seg button').forEach(t => t.addEventListener('click', () => { $$('.seg button').forEach(x => x.classList.remove('on')); t.classList.add('on'); const f = t.dataset.f;
    $$('.s').forEach(s => s.classList.toggle('dim', f !== 'all' && !s.dataset.f.split(' ').includes(f))); }));
  // before/after
  const r = $('#baR'), after = $('#after'), hd = $('#handle');
  const ba = () => { after.style.clipPath = `inset(0 0 0 ${r.value}%)`; hd.style.left = r.value + '%'; }; r.addEventListener('input', ba); ba();
  // gallery (svg art)
  const styles = [['Bob', '#3a2a2b', 'M-80 60 Q-90 -40 0 -45 Q90 -40 80 60 L80 110 L-80 110Z'], ['Długie fale', '#b0603a', 'M-85 60 Q-95 -45 0 -45 Q95 -45 85 60 Q100 160 70 220 L-70 220 Q-100 160 -85 60Z'], ['Pixie', '#d9b46a', 'M-72 40 Q-80 -50 0 -50 Q85 -50 72 40 Q40 -10 -72 40Z'], ['Kok', '#2a1f20', 'M-70 30 Q-80 -40 0 -45 Q80 -40 70 30 Q40 -20 -70 30Z M-30 -55 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0'], ['Fade męski', '#3a2a2b', 'M-72 20 Q-70 -50 0 -52 Q70 -50 72 20 Q40 -30 -72 20Z'], ['Kolor fantazyjny', '#8a6ad8', 'M-82 60 Q-92 -45 0 -45 Q92 -45 82 60 L85 150 L-85 150Z'], ['Grzywka', '#5a3a2a', 'M-82 60 Q-92 -45 0 -45 Q92 -45 82 60 L82 130 L-82 130Z M-70 10 Q0 -30 70 10 L70 -5 Q0 -50 -70 -5Z'], ['Balayage', '#c48a4a', 'M-85 60 Q-95 -45 0 -45 Q95 -45 85 60 Q95 150 75 200 L-75 200 Q-95 150 -85 60Z']];
  const bgs = ['#2a2426', '#3a2c2a', '#e9b8a8', '#d8b26e33', '#1f1b1c', '#e9d8f2', '#f3e2d6', '#30262a'];
  $('#gal').innerHTML = styles.map(([n, c, d], k) => `<div class="gi"><svg viewBox="-150 -110 300 400"><rect x="-150" y="-110" width="300" height="400" fill="${bgs[k]}"/><path d="${d}" fill="${c}"/><ellipse cx="0" cy="40" rx="55" ry="70" fill="#f1cdb8"/><path d="${d.split('Z')[0]}Z" fill="${c}" opacity="${k === 4 ? 1 : 0}"/><rect x="-20" y="100" width="40" height="40" fill="#f1cdb8"/><path d="M-110 290 Q0 200 110 290Z" fill="#161314" opacity=".5"/></svg><span>${n}</span></div>`).join('');
  // booking
  const svcs = $$('.s').map(s => ({ n: s.querySelector('h3').textContent, p: s.querySelector('b').textContent }));
  const st = { s: null, d: null, t: null };
  $('#bSvc').innerHTML = svcs.map((s, k) => `<button type="button" data-k="${k}">${s.n}</button>`).join('');
  const dn = ['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'], days = []; const now = new Date();
  for (let k = 1; days.length < 7; k++) { const d = new Date(now.getTime() + k * 864e5); if (d.getDay() !== 0) days.push(d); }
  $('#bDay').innerHTML = days.map((d, k) => `<button type="button" data-k="${k}"><small>${dn[d.getDay()]}</small><b>${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}</b></button>`).join('');
  const slots = () => { const d = days[st.d], end = d.getDay() === 6 ? 15 : 19; let h = '';
    for (let t = 9; t < end; t++) for (const mm of ['00', '30']) { const busy = ((d.getDate() * 7 + t * 3 + (mm === '30' ? 5 : 0)) % 5) === 0; h += `<button type="button" ${busy ? 'disabled title="zajęte"' : ''}>${t}:${mm}</button>`; }
    $('#bSlot').innerHTML = h; st.t = null; bindSlots(); };
  const pick = (box, cb) => box.addEventListener('click', e => { const bt = e.target.closest('button'); if (!bt || bt.disabled) return; [...box.children].forEach(x => x.classList.remove('on')); bt.classList.add('on'); cb(bt); summary(); });
  pick($('#bSvc'), bt => st.s = +bt.dataset.k);
  pick($('#bDay'), bt => { st.d = +bt.dataset.k; slots(); });
  function bindSlots() {} pick($('#bSlot'), bt => st.t = bt.textContent);
  $('#bSlot').innerHTML = '<p class="hint" style="color:#9a8f8c">Najpierw wybierz dzień</p>';
  function summary() { $('#sS').textContent = st.s != null ? svcs[st.s].n : '–'; $('#sP').textContent = st.s != null ? svcs[st.s].p + ' (przykład)' : '–';
    $('#sT').textContent = st.d != null ? days[st.d].toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' }) + (st.t ? ', ' + st.t : '') : '–'; }
  $('#bForm').addEventListener('submit', e => { e.preventDefault(); const f = e.target; let ok = true;
    [f.n, f.t].forEach(i => { const bad = !i.value.trim(); i.classList.toggle('err', bad); if (bad) ok = false; });
    if (st.s == null || st.d == null || !st.t) { $('#bHint').textContent = 'Wybierz usługę, dzień i godzinę.'; return; }
    if (!ok) return; $('#bDoneT').textContent = `${f.n.value}, ${svcs[st.s].n.toLowerCase()} · ${$('#sT').textContent}.`; f.hidden = true; $('#bDone').hidden = false; });
  // reveal
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1 });
  $$('h2,.svc,.ba,.gal,.book,.hours,.map').forEach(el => { el.classList.add('rv'); io.observe(el); });
})();
