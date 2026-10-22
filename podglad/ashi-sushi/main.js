(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ORDER = 'https://www.ashisushi.pl/restauracja/ashi-sushi-lomza';
const M = window.ASHI_MENU || [];
const zl = n => n.toFixed(2).replace('.', ',') + ' zł';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
$('#yr').textContent = new Date().getFullYear();

/* ---------- hours & open now (Europe/Warsaw) ---------- */
const H = { 0: [12, 21], 1: [12, 21], 2: [12, 21], 3: [12, 21], 4: [12, 21], 5: [12, 22], 6: [12, 22] };
const DV = { 0: '12:00–20:45', 1: '12:00–20:45', 2: '12:00–20:45', 3: '12:00–20:45', 4: '12:00–20:45', 5: '12:00–21:45', 6: '12:00–21:45' };
const DN = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
const now = () => { const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Warsaw', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map(x => [x.type, x.value]));
  return { d: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), m: +p.hour * 60 + +p.minute }; };
const status = () => { const { d, m } = now(), [o, c] = H[d]; let txt, st;
  if (m >= o * 60 && m < c * 60) { const left = c * 60 - m; st = left <= 45 ? 'soon' : 'open'; txt = left <= 45 ? `Otwarte jeszcze ${left} min` : `Otwarte do ${c}:00`; }
  else if (m < o * 60) { st = 'closed'; txt = `Otwieramy dziś o ${o}:00`; }
  else { st = 'closed'; txt = `Zamknięte · jutro od ${H[(d + 1) % 7][0]}:00`; }
  $$('[data-status]').forEach(e => { e.dataset.s = st; $('b', e).textContent = txt; });
  const dt = $('[data-dtoday]'); if (dt) dt.textContent = DV[d];
  const lt = $('[data-lunch]'); if (lt) { const on = d >= 1 && d <= 5 && m >= 720 && m < 960; lt.textContent = on ? 'Trwa teraz · do 16:00' : 'Pon–pt 12:00–16:00'; lt.classList.toggle('live', on); }
  return d; };
const today = status(); setInterval(status, 60000);
$('#hours tbody').innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => `<tr${d === today ? ' class="today" aria-current="date"' : ''}><th scope="row">${DN[d]}${d === today ? ' <em>dziś</em>' : ''}</th><td>${H[d][0]}:00–${H[d][1]}:00</td><td>${DV[d]}</td></tr>`).join('');

/* ---------- menu ---------- */
const FL = { wege: '🌿 Wege', ostre: '🌶 Ostre', surowe: '🐟 Surowa ryba', chrupiace: '✦ Tempura' };
const all = []; M.forEach(c => c.items.forEach((it, k) => all.push({ ...it, cat: c.id, cn: c.name, k, id: c.id + '-' + k })));
const byId = Object.fromEntries(all.map(i => [i.id, i]));
const st = { q: '', f: new Set(), sort: '', cat: '' };
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');
$('#cats').innerHTML = `<button type="button" class="chip on" data-c="">Wszystko</button>` + M.map(c => `<button type="button" class="chip" data-c="${c.id}">${esc(c.name)}</button>`).join('');
const card = i => `<article class="dish${i.x ? ' off' : ''}${i.img ? '' : ' noimg'}" data-id="${i.id}">
  ${i.img ? `<button type="button" class="d-img" data-open="${i.id}" aria-label="Szczegóły: ${esc(i.n)}"><img src="${i.img}" alt="${esc(i.n)}" loading="lazy" width="400" height="300"></button>` : ''}
  <div class="d-b"><h4>${esc(i.n)}</h4>${i.d ? `<p>${esc(i.d)}</p>` : ''}
  <div class="d-tags">${i.x ? '<span class="t off">Chwilowo niedostępne</span>' : ''}${i.f.map(f => `<span class="t ${f}">${FL[f]}</span>`).join('')}${i.pcs && i.p ? `<span class="t pc">${zl(i.p / i.pcs)}/szt.</span>` : ''}</div>
  <div class="d-f"><b>${zl(i.p)}</b>${i.x ? '' : `<button type="button" class="add" data-add="${i.id}" aria-label="Dodaj do notatnika: ${esc(i.n)}">+</button>`}</div></div></article>`;
const render = () => {
  const q = norm(st.q.trim());
  let list = all.filter(i => (!st.cat || i.cat === st.cat) && (!q || norm(i.n + ' ' + i.d + ' ' + i.cn).includes(q)) && [...st.f].every(f => f === 'dost' ? !i.x : i.f.includes(f)));
  const n = list.length;
  if (st.sort) { list = [...list].sort((a, b) => st.sort === 'asc' ? a.p - b.p : st.sort === 'desc' ? b.p - a.p : ((a.pcs ? a.p / a.pcs : 1e9) - (b.pcs ? b.p / b.pcs : 1e9))); $('#mlist').innerHTML = `<div class="dgrid">${list.map(card).join('')}</div>`; }
  else $('#mlist').innerHTML = M.map(c => { const its = list.filter(i => i.cat === c.id); return its.length ? `<section class="mcat" id="m-${c.id}" aria-label="${esc(c.name)}"><header><h3>${esc(c.name)}</h3>${c.note ? `<p>${esc(c.note)}</p>` : ''}<span>${its.length}</span></header><div class="dgrid">${its.map(card).join('')}</div></section>` : ''; }).join('');
  if (!n) $('#mlist').innerHTML = `<div class="empty"><p>Nic nie pasuje do wyszukiwania.</p><button type="button" class="btn line" id="reset">Wyczyść filtry</button></div>`;
  $('#mcount').textContent = `${n} ${n === 1 ? 'pozycja' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'pozycje' : 'pozycji'}`;
};
let qt; $('#q').addEventListener('input', e => { clearTimeout(qt); qt = setTimeout(() => { st.q = e.target.value; render(); }, 120); });
$$('.f').forEach(b => b.addEventListener('click', () => { const f = b.dataset.f, on = !st.f.has(f); on ? st.f.add(f) : st.f.delete(f); b.setAttribute('aria-pressed', on); render(); }));
$('#sort').addEventListener('change', e => { st.sort = e.target.value; render(); });
const setCat = c => { st.cat = c; $$('#cats .chip').forEach(b => { b.classList.toggle('on', b.dataset.c === c); b.setAttribute('aria-pressed', b.dataset.c === c); }); render();
  const a = $(`#cats [data-c="${c}"]`); a && a.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); };
$('#cats').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; setCat(b.dataset.c); $('#menu').scrollIntoView({ behavior: 'smooth' }); });
$$('[data-cat]').forEach(a => a.addEventListener('click', () => setTimeout(() => setCat(a.dataset.cat), 50)));
$('#mlist').addEventListener('click', e => {
  if (e.target.closest('#reset')) { st.q = ''; $('#q').value = ''; st.f.clear(); $$('.f').forEach(b => b.setAttribute('aria-pressed', 'false')); setCat(''); return; }
  const a = e.target.closest('[data-add]'); if (a) { add(a.dataset.add); a.classList.add('pop'); setTimeout(() => a.classList.remove('pop'), 400); return; }
  const o = e.target.closest('[data-open]'); if (o) openDish(o.dataset.open);
});
const openDish = id => { const i = byId[id]; const m = document.createElement('div'); m.className = 'dmodal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', i.n);
  m.innerHTML = `<div class="dm-in"><button type="button" class="dm-x" aria-label="Zamknij">×</button><img src="${i.img}" alt="${esc(i.n)}"><div class="dm-b"><p class="eyebrow">${esc(i.cn)}</p><h3>${esc(i.n)}</h3><p>${esc(i.d)}</p><div class="d-tags">${i.f.map(f => `<span class="t ${f}">${FL[f]}</span>`).join('')}</div><p class="dm-p">${zl(i.p)}</p><div class="hero-cta">${i.x ? '<span class="t off">Chwilowo niedostępne</span>' : `<button type="button" class="btn line" data-madd>Do notatnika</button><a class="btn gold" href="${ORDER}#menu-${i.cat}" rel="noopener">Zamów online →</a>`}</div></div></div>`;
  const prev = document.activeElement; document.body.appendChild(m); document.body.classList.add('noscroll'); requestAnimationFrame(() => m.classList.add('on')); $('.dm-x', m).focus();
  const close = () => { m.classList.remove('on'); document.body.classList.remove('noscroll'); setTimeout(() => m.remove(), 300); prev && prev.focus(); document.removeEventListener('keydown', kd); };
  const kd = e => e.key === 'Escape' && close(); document.addEventListener('keydown', kd);
  m.addEventListener('click', e => { if (e.target === m || e.target.closest('.dm-x')) close(); if (e.target.closest('[data-madd]')) { add(id); close(); } }); };
render();

/* ---------- notatnik (kalkulator) ---------- */
let note = {}; try { note = JSON.parse(localStorage.getItem('ashi-note')) || {}; } catch (e) {}
const saveN = () => { try { localStorage.setItem('ashi-note', JSON.stringify(note)); } catch (e) {} drawN(); };
const add = id => { note[id] = (note[id] || 0) + 1; saveN(); window.Kit && Kit.toast && Kit.toast(`Dodano: ${byId[id].n}`); };
const drawN = () => { const ids = Object.keys(note).filter(id => byId[id] && note[id] > 0); let sub = 0, cnt = 0;
  $('#nlist').innerHTML = ids.length ? ids.map(id => { const i = byId[id], q = note[id]; sub += i.p * q; cnt += q; return `<li><span>${esc(i.n)}<small>${zl(i.p)}</small></span><div class="qty"><button type="button" data-q="${id}" data-d="-1" aria-label="Mniej">−</button><b>${q}</b><button type="button" data-q="${id}" data-d="1" aria-label="Więcej">+</button></div></li>`; }).join('') : '<li class="muted">Dodaj dania przyciskiem + w menu.</li>';
  $('#ncount').textContent = cnt; $('#nsub').textContent = zl(sub); $('#ntot').textContent = zl(sub ? sub + 4 : 0);
  $('#minbar').style.width = Math.min(100, sub / 50 * 100) + '%';
  $('#nmin').textContent = sub >= 50 ? 'Minimum do dowozu osiągnięte ✓' : `Do minimum dowozu (50 zł) brakuje ${zl(50 - sub)}`; };
$('#nlist').addEventListener('click', e => { const b = e.target.closest('[data-q]'); if (!b) return; note[b.dataset.q] += +b.dataset.d; if (note[b.dataset.q] <= 0) delete note[b.dataset.q]; saveN(); });
$('#nclear').onclick = () => { note = {}; saveN(); };
const nt = $('#note'), nb = $('#notebtn');
const showN = o => { nt.hidden = !o; nb.setAttribute('aria-expanded', o); if (o) $('.note-x', nt).focus(); };
nb.onclick = () => showN(nt.hidden); $('.note-x', nt).onclick = () => { showN(false); nb.focus(); };
drawN();

/* ---------- zestawy ---------- */
const sets = (M.find(c => c.id === 'zestawy') || { items: [] }).items.map((it, k) => ({ ...it, id: 'zestawy-' + k }));
$('#setgrid').innerHTML = sets.map(s => `<article class="set" data-n="${esc(s.n)}"><div class="set-img">${s.img ? `<img src="${s.img}" alt="${esc(s.n)}" loading="lazy" width="400" height="300">` : ''}<span class="pcs">${s.pcs || '?'}<small>szt.</small></span></div><div class="d-b"><h4>${esc(s.n)}</h4><p>${esc(s.d)}</p><div class="d-f"><b>${zl(s.p)}</b><span class="muted small">${s.pcs ? zl(s.p / s.pcs) + '/szt.' : ''}</span><button type="button" class="add" data-sadd="${s.id}" aria-label="Dodaj do notatnika: ${esc(s.n)}">+</button></div></div></article>`).join('');
$('#setgrid').addEventListener('click', e => { const b = e.target.closest('[data-sadd]'); b && add(b.dataset.sadd); });
let hun = 14;
const rec = () => { const p = +$('#ppl').value, need = p * hun; $('#pplo').textContent = p;
  const ok = sets.filter(s => s.pcs && !s.x); let best = null;
  ok.forEach(a => { [[a], ...ok.map(b => [a, b])].forEach(c => { const pc = c.reduce((x, y) => x + y.pcs, 0), pr = c.reduce((x, y) => x + y.p, 0); if (pc >= need && (!best || pr < best.pr || (pr === best.pr && pc < best.pc))) best = { c, pc, pr }; }); });
  $$('.set').forEach(e => e.classList.toggle('pick', !!best && best.c.some(s => s.n === e.dataset.n)));
  $('#setout').innerHTML = best ? `<p class="eyebrow">Proponujemy</p><h3>${best.c.map(s => esc(s.n)).join(' + ')}</h3><p>${best.pc} kawałków · ${zl(best.pr)} · ok. ${zl(best.pr / p)} na osobę</p>${best.c.some(s => /Samuraj|Party|King/.test(s.n)) ? '<p class="gift">🎁 Do tego zestawu rolka gratis w promocji</p>' : ''}<button type="button" class="btn gold" id="recadd">Dodaj do notatnika</button>`
    : `<p class="eyebrow">Duża grupa</p><h3>Zadzwoń, doradzimy</h3><p>${need} kawałków to już spore zamówienie.</p><a class="btn gold" href="tel:+48789373417">789 373 417</a>`;
  const ra = $('#recadd'); if (ra) ra.onclick = () => best.c.forEach(s => add(s.id)); };
$('#ppl').addEventListener('input', rec);
$$('#hun button').forEach(b => b.onclick = () => { hun = +b.dataset.v; $$('#hun button').forEach(x => x.setAttribute('aria-checked', x === b)); rec(); });
rec();
$$('[data-set]').forEach(a => a.addEventListener('click', () => setTimeout(() => { const e = $(`.set[data-n="${a.dataset.set}"]`); if (e) { e.classList.add('flash'); setTimeout(() => e.classList.remove('flash'), 2200); } }, 600)));

/* ---------- galeria ---------- */
const G = [[10, 'food', 'Rolki Ashi Sushi'], [2, 'place', 'Wnętrze z kwitnącą wiśnią'], [8, 'food', 'Sushi z kuchni Ashi'], [12, 'food', 'Zestaw sushi'], [6, 'place', 'Wnętrze lokalu wieczorem'], [7, 'food', 'Rolki na talerzu'], [9, 'food', 'Napoje'], [13, 'food', 'Danie z menu'], [11, 'place', 'Sala z dekoracją sakury'], [1, 'food', 'Sushi'], [3, 'food', 'Sushi'], [5, 'food', 'Sushi'], [14, 'food', 'Sushi']];
const pad = n => String(n).padStart(2, '0');
$('#gal').innerHTML = G.map(([n, t, c]) => `<a class="gi" data-g="${t}" href="img/gallery-${pad(n)}.webp" data-lightbox="gal" data-full="img/gallery-${pad(n)}.webp" data-caption="${c}"><img src="img/gallery-${pad(n)}-480.webp" alt="${c}" loading="lazy"></a>`).join('');
$$('#gf button').forEach(b => b.onclick = () => { $$('#gf button').forEach(x => x.setAttribute('aria-pressed', x === b)); $$('#gal .gi').forEach(g => g.hidden = b.dataset.g !== 'all' && g.dataset.g !== b.dataset.g); });

/* ---------- opinie (prawdziwe, z systemu zamówień) ---------- */
const R = [['Magdalena S.', 'Najlepsze sushi w mieście', '03.2026'], ['Sandra D.', 'Najlepsze Sushi! Polecam z całego serca! Dostawa zawsze na czas, dostawcy zawsze bardzo mili ❤️', '12.2025'], ['Iwona P.', 'Lokal jest fajny, lubimy tam zajrzeć wieczorami. Sushi pyszne. Polecam.', '10.2026'], ['Anna C.', 'Wszystko pyszne, obsługa bardzo miła!!', '07.2026'], ['Mateusz K.', 'Bardzo dobre lunch wege', '01.2026'], ['Michał Z.', 'Najlepsze sushi w Łomży, polecam', '11.2024'], ['Agnieszka K.', 'Wszystko pyszne i świeże', '08.2025'], ['Ewelina K.', 'Smacznie i na czas!', '08.2025']];
$('#rvt').innerHTML = R.map(([a, t, d]) => `<figure class="rv"><span class="stars" aria-label="Ocena 5 na 5">★★★★★</span><blockquote>„${esc(t)}”</blockquote><figcaption>${a} · ${d}</figcaption></figure>`).join('');
// Iwona P. gave 4 stars:
$$('#rvt .rv')[2].querySelector('.stars').outerHTML = '<span class="stars" aria-label="Ocena 4 na 5">★★★★<span class="dim">★</span></span>';

/* ---------- mapa po zgodzie ---------- */
const MAPSRC = 'https://www.google.com/maps?q=Ashi+Sushi,+Farna+4,+18-400+%C5%81om%C5%BCa&output=embed';
const loadMap = () => { if ($('#map iframe')) return; $('#map').innerHTML = `<iframe title="Mapa: Ashi Sushi, ul. Farna 4, Łomża" src="${MAPSRC}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`; };
const chk = () => { const c = window.KlikooConsent && KlikooConsent.get(); if (c && c.functional) loadMap(); };
document.addEventListener('consentchange', chk); addEventListener('load', chk);
$('#mapgo').onclick = loadMap;

/* header shadow */
const nav = $('.nav'); const sc = () => nav.classList.toggle('scrolled', scrollY > 30); addEventListener('scroll', sc, { passive: true }); sc();
})();
