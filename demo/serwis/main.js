(() => {
  const { $, $$, store } = Kit;
  const zl = n => Math.round(n).toLocaleString('pl-PL') + ' zł';
  $('#yr').textContent = new Date().getFullYear();
  /* ---------- data ---------- */
  const B = {
    'iPhone': { m: ['iPhone 15 Pro', 'iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone SE (3. gen.)'], k: [1.45, 1.25, 1.1, 0.95, 0.85, 0.7] },
    'Samsung': { m: ['Galaxy S24 Ultra', 'Galaxy S24', 'Galaxy S23', 'Galaxy A55', 'Galaxy A35', 'Galaxy A15'], k: [1.5, 1.2, 1.05, 0.75, 0.65, 0.5] },
    'Xiaomi': { m: ['Xiaomi 14', 'Redmi Note 13 Pro', 'Redmi Note 13', 'Redmi 13C'], k: [1.05, 0.7, 0.6, 0.45] },
    'Google': { m: ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7a'], k: [1.3, 1.1, 0.8] } };
  const ico = { scr: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M9 6l6 6M10 13l4-4"/>', bat: '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10v4M7 10v4M11 10v4"/>', port: '<path d="M8 4h8v6a4 4 0 01-8 0zM12 14v6"/>', cam: '<circle cx="12" cy="13" r="4"/><path d="M4 7h4l2-3h4l2 3h4v13H4z"/>', back: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M6 14l12-6"/>', spk: '<path d="M4 9h4l5-4v14l-5-4H4zM17 9a4 4 0 010 6"/>', btn: '<path d="M4 8h3M4 13h3M17 10h3"/><rect x="7" y="3" width="10" height="18" rx="2"/>', water: '<path d="M12 3s6 7 6 11a6 6 0 01-12 0c0-4 6-11 6-11z"/>' };
  const F = [
    { id: 'scr', n: 'Wymiana ekranu', base: 420, t: 45, inc: ['wyświetlacz z dotykiem', 'nowa uszczelka', 'test kalibracji True Tone*'], sym: 'Pęknięta szyba, plamy, brak dotyku lub migający obraz.' },
    { id: 'bat', n: 'Wymiana baterii', base: 190, t: 30, inc: ['nowa bateria 0 cykli', 'kalibracja', 'test pojemności'], sym: 'Szybkie rozładowanie, wyłączanie przy 20%, puchnięcie obudowy.' },
    { id: 'port', n: 'Port ładowania', base: 160, t: 40, inc: ['nowe gniazdo USB-C / Lightning', 'czyszczenie styków', 'test ładowania'], sym: 'Ładuje tylko pod kątem, nie wykrywa kabla, luźna wtyczka.' },
    { id: 'cam', n: 'Aparat tylny', base: 280, t: 50, inc: ['moduł aparatu', 'szkiełko obiektywu', 'test ostrości'], sym: 'Rozmyte zdjęcia, drgający obraz, pęknięte szkiełko.' },
    { id: 'back', n: 'Szkło tylne / plecki', base: 240, t: 90, inc: ['nowe plecki', 'laserowe usunięcie resztek', 'nowa taśma klejąca'], sym: 'Pęknięte szkło z tyłu, odpryski przy aparacie.' },
    { id: 'spk', n: 'Głośnik / mikrofon', base: 140, t: 35, inc: ['moduł głośnika', 'czyszczenie siatek', 'test audio'], sym: 'Ciche lub trzeszczące rozmowy, rozmówca Cię nie słyszy.' },
    { id: 'btn', n: 'Przyciski', base: 150, t: 45, inc: ['taśma przycisków', 'test wszystkich klawiszy'], sym: 'Nie działa zasilanie, głośność lub przełącznik wyciszenia.' },
    { id: 'water', n: 'Po zalaniu', base: 120, t: 120, inc: ['demontaż i czyszczenie ultradźwiękowe', 'diagnoza płyty', 'raport'], sym: 'Telefon wpadł do wody, nie włącza się lub ma usterki.' }];
  const st = { brand: 'iPhone', model: 0, fault: 'scr' };
  /* ---------- estimator ---------- */
  const opt = (label, on, extra = '') => `<button type="button" class="opt" role="radio" aria-checked="${on}" ${extra}>${label}</button>`;
  const est = () => { const b = B[st.brand], k = b.k[st.model], f = F.find(x => x.id === st.fault); const p = Math.round(f.base * k / 10) * 10 - 1; return { p, t: Math.round(f.t * (k > 1.2 ? 1.2 : 1)), f }; };
  const renderEst = () => {
    $('#brands').innerHTML = Object.keys(B).map(b => opt(b, b === st.brand, `data-b="${b}"`)).join('');
    $('#models').innerHTML = B[st.brand].m.map((m, i) => opt(m, i === st.model, `data-m="${i}"`)).join('');
    $('#faults').innerHTML = F.map(f => opt(`<svg viewBox="0 0 24 24">${ico[f.id]}</svg>${f.n}`, f.id === st.fault, `data-f="${f.id}"`)).join('');
    const r = est(); $('#estTitle').textContent = `${r.f.n} · ${B[st.brand].m[st.model]}`;
    $('#estPrice').textContent = r.f.id === 'water' ? 'od ' + zl(r.p) : zl(r.p); $('#estTime').textContent = r.t >= 60 ? `${Math.floor(r.t / 60)} h ${r.t % 60 ? r.t % 60 + ' min' : ''}` : r.t + ' min';
    $$('#estPrice,#estTime').forEach(x => { x.classList.remove('flash'); void x.offsetWidth; x.classList.add('flash'); });
    $('#estInc').innerHTML = [...r.f.inc, 'gwarancja 12 mies.*'].map(x => `<li>${x}</li>`).join('');
    $('#bkSel').textContent = `> urządzenie: ${B[st.brand].m[st.model]} · usterka: ${r.f.n} · ~${zl(r.p)}*`;
    updDiag(); };
  $('.est').addEventListener('click', e => { const b = e.target.closest('.opt'); if (!b) return; if (b.dataset.b) { st.brand = b.dataset.b; st.model = 0; } if (b.dataset.m) st.model = +b.dataset.m; if (b.dataset.f) st.fault = b.dataset.f; renderEst(); });
  /* ---------- 3D phone ---------- */
  const phone = $('#phone'), stage = $('.stage'); let ry = -22, sel = null;
  const HS = [ // [faultId, side, x%, y% within phone box, label]
    ['scr', 'f', 50, 45, 'ekran'], ['cam', 'f', 50, 6, 'aparat przedni'], ['spk', 'f', 28, 97, 'głośnik'], ['btn', 'f', 101, 30, 'przyciski'], ['port', 'f', 64, 100.5, 'port'],
    ['bat', 'b', 50, 55, 'bateria'], ['cam', 'b', 78, 14, 'aparat tylny'], ['back', 'b', 40, 85, 'plecki']];
  $('#hotspots').innerHTML = HS.map((h, i) => `<button class="hs" type="button" data-i="${i}" aria-label="${h[4]}"><span>${h[4]}</span></button>`).join('');
  const place = () => { const pr = phone.getBoundingClientRect(), sr = stage.getBoundingClientRect(); const front = Math.cos(ry * Math.PI / 180) > 0;
    $$('.hs').forEach(el => { const h = HS[+el.dataset.i]; const vis = (h[1] === 'f') === front; el.classList.toggle('hid', !vis);
      let x = h[2]; if (!front) x = 100 - x; // mirrored back
      el.style.left = (pr.left - sr.left + pr.width * x / 100) + 'px'; el.style.top = (pr.top - sr.top + pr.height * h[3] / 100) + 'px'; }); };
  const setRy = (v, anim = true) => { ry = v; phone.classList.toggle('drag', !anim); phone.style.setProperty('--ry', ry + 'deg'); setTimeout(place, anim ? 900 : 0); };
  let dx = null, r0 = 0;
  phone.addEventListener('pointerdown', e => { dx = e.clientX; r0 = ry; phone.setPointerCapture(e.pointerId); $$('.hs').forEach(h => h.classList.add('hid')); });
  phone.addEventListener('pointermove', e => { if (dx === null) return; setRy(r0 + (e.clientX - dx) * .6, false); });
  const end = () => { if (dx === null) return; dx = null; const snap = Math.round(ry / 180) * 180 + (Math.cos(ry * Math.PI / 180) > 0 ? -22 : 22); setRy(snap); };
  phone.addEventListener('pointerup', end); phone.addEventListener('pointercancel', end);
  phone.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') setRy(ry - 180); if (e.key === 'ArrowRight') setRy(ry + 180); });
  $$('[data-rot]').forEach(b => b.onclick = () => { const back = +b.dataset.rot === 180; const k = Math.round(ry / 360) * 360; setRy(back ? k + 180 + 22 : k - 22); });
  $('[data-spin]').onclick = () => setRy(ry + 360);
  function updDiag() { if (sel === null) return; const h = HS[sel], f = F.find(x => x.id === h[0]); const k = B[st.brand].k[st.model]; const p = Math.round(f.base * k / 10) * 10 - 1;
    $('#diagPanel').innerHTML = `<p class="mono">// punkt: ${h[4]}</p><h3>${f.n}</h3><p class="muted">${f.sym}</p><div class="pr"><span>${B[st.brand].m[st.model]}</span><span>~${zl(p)}*</span><span>${f.t} min</span></div><button class="btn" type="button" id="diagUse">Użyj w wycenie →</button>`;
    $('#diagUse').onclick = () => { st.fault = f.id; renderEst(); document.getElementById('wycena').scrollIntoView({ behavior: 'smooth' }); }; }
  $('#hotspots').addEventListener('click', e => { const b = e.target.closest('.hs'); if (!b) return; sel = +b.dataset.i; $$('.hs').forEach(x => x.classList.toggle('on', x === b)); updDiag(); });
  addEventListener('resize', place); new IntersectionObserver(es => es[0].isIntersecting && setTimeout(place, 900)).observe(stage);
  /* ---------- before/after ---------- */
  const ba = $('#ba'); $('input', ba).addEventListener('input', e => ba.style.setProperty('--p', e.target.value + '%'));
  /* ---------- status tracker ---------- */
  const STEPS = ['Przyjęto zlecenie', 'Diagnoza', 'Czekamy na część', 'Naprawa w toku', 'Testy jakości', 'Gotowe do odbioru'];
  const ORD = { 'NF-2041': { dev: 'iPhone 13 · wymiana ekranu', s: 3, eta: 'dziś ok. 16:30' }, 'NF-1987': { dev: 'Galaxy S23 · bateria', s: 5, eta: 'gotowe – zapraszamy' }, 'NF-2105': { dev: 'Pixel 8 · port ładowania', s: 1, eta: 'jutro do 12:00' } };
  const track = id => { id = id.trim().toUpperCase().replace(/^NF(\d)/, 'NF-$1'); const o = ORD[id];
    if (!o) { $('#tl').innerHTML = `<p class="mono" style="color:#ff4d6d">// nie znaleziono zlecenia „${id || '—'}”</p><p class="muted small">W wersji demo działają numery: NF-2041, NF-1987, NF-2105.</p>`; return; }
    const now = new Date(); $('#tl').innerHTML = `<div class="tl-h"><b>${id}</b><span class="mono">ETA: ${o.eta}</span></div><p class="muted" style="margin-bottom:14px">${o.dev} (zlecenie przykładowe)</p><ol style="--prog:0%">${STEPS.map((s, i) => `<li class="${i < o.s ? 'done' : i === o.s ? 'now' : ''}" style="--d:${i * 90}ms"><b>${s}</b><small>${i <= o.s ? new Date(now - (o.s - i) * 52 * 6e4).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) : 'oczekuje'}</small></li>`).join('')}</ol>`;
    requestAnimationFrame(() => setTimeout(() => $('#tl ol').style.setProperty('--prog', (o.s / (STEPS.length - 1) * 100) + '%'), 60)); };
  $('#trackForm').addEventListener('submit', e => { e.preventDefault(); track($('#trackIn').value); });
  $$('[data-ord]').forEach(b => b.onclick = () => { $('#trackIn').value = b.dataset.ord; track(b.dataset.ord); });
  $('#mTrack').addEventListener('submit', e => { e.preventDefault(); const v = $('#mTrackIn').value || 'NF-2041'; $('#trackIn').value = v; Kit.setMenu(false); track(v); document.getElementById('status').scrollIntoView({ behavior: 'smooth' }); });
  /* ---------- accessories + cart ---------- */
  const allModels = Object.values(B).flatMap(b => b.m);
  const A = [
    { id: 'c1', n: 'Etui silikonowe MagFit', c: 'Etui', p: 89, img: 'case', for: ['iPhone 15 Pro', 'iPhone 15', 'iPhone 14', 'iPhone 13'] },
    { id: 'c2', n: 'Etui slim Galaxy', c: 'Etui', p: 79, img: 'case', for: ['Galaxy S24 Ultra', 'Galaxy S24', 'Galaxy S23', 'Galaxy A55'] },
    { id: 'g1', n: 'Szkło hartowane 9H + montaż', c: 'Szkło', p: 59, img: 'powerbank', for: 'all' },
    { id: 'l1', n: 'Ładowarka USB-C 30 W', c: 'Ładowanie', p: 99, img: 'charger', for: 'all' },
    { id: 'l2', n: 'Kabel USB-C w oplocie 1,5 m', c: 'Ładowanie', p: 49, img: 'charger', for: 'all' },
    { id: 'l3', n: 'Stojak + ładowarka indukcyjna', c: 'Ładowanie', p: 149, img: 'stand', for: ['iPhone 15 Pro', 'iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'Galaxy S24 Ultra', 'Galaxy S24', 'Galaxy S23', 'Pixel 8 Pro', 'Pixel 8'] },
    { id: 'a1', n: 'Słuchawki bezprzewodowe ANC', c: 'Audio', p: 249, img: 'earbuds', for: 'all' },
    { id: 'p1', n: 'Powerbank 10 000 mAh', c: 'Zasilanie', p: 129, img: 'powerbank', for: 'all' }];
  $('#accModel').innerHTML = '<option value="">Wszystkie modele</option>' + Object.entries(B).map(([b, v]) => `<optgroup label="${b}">${v.m.map(m => `<option>${m}</option>`).join('')}</optgroup>`).join('');
  const ACATS = ['Wszystko', 'Etui', 'Szkło', 'Ładowanie', 'Audio', 'Zasilanie']; let acat = 'Wszystko';
  $('#accCats').innerHTML = ACATS.map((c, i) => `<button class="chip" type="button" role="radio" aria-checked="${i === 0}">${c}</button>`).join('');
  let cart = {}; try { cart = JSON.parse(store.get('nf-cart') || '{}'); } catch (e) {}
  const renderAcc = () => { const m = $('#accModel').value; const L = A.filter(a => (acat === 'Wszystko' || a.c === acat) && (!m || a.for === 'all' || a.for.includes(m)));
    $('#acc').innerHTML = L.map((a, i) => `<li class="ac" style="--d:${i * 50}ms"><figure><img src="img/${a.img}-480.webp" srcset="img/${a.img}-480.webp 480w, img/${a.img}.webp 1024w" sizes="(max-width:860px) 50vw, 280px" alt="${a.n}" loading="lazy" width="480" height="270"></figure><div class="b"><h3>${a.n}</h3><div class="cmp">${a.for === 'all' ? '<span>uniwersalne</span>' : a.for.slice(0, 3).map(x => `<span>${x}</span>`).join('') + (a.for.length > 3 ? `<span>+${a.for.length - 3}</span>` : '')}</div><div class="row"><span class="pr">${zl(a.p)}</span><button class="add${cart[a.id] ? ' in' : ''}" type="button" data-add="${a.id}">${cart[a.id] ? '✓ w koszyku' : '+ do koszyka'}</button></div></div></li>`).join('') || '<li class="empty">Brak akcesoriów dla tego filtra.</li>'; };
  $('#accCats').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; acat = b.textContent; $$('#accCats button').forEach(x => x.setAttribute('aria-checked', x === b)); renderAcc(); });
  $('#accModel').addEventListener('change', renderAcc);
  const save = () => store.set('nf-cart', JSON.stringify(cart));
  const renderCart = () => { const ids = Object.keys(cart), n = Object.values(cart).reduce((a, b) => a + b, 0), s = ids.reduce((t, id) => t + A.find(a => a.id === id).p * cart[id], 0);
    $$('[data-count]').forEach(c => { c.textContent = n; c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); });
    $('#cartList').innerHTML = ids.map(id => { const a = A.find(x => x.id === id); return `<li><img src="img/${a.img}-480.webp" alt=""><div><h3>${a.n}</h3><span class="mono">${zl(a.p)}</span></div><div class="q"><button type="button" data-q="${id}" data-d="-1" aria-label="Mniej">−</button>${cart[id]}<button type="button" data-q="${id}" data-d="1" aria-label="Więcej">+</button></div></li>`; }).join('') || '<li class="cart-empty" style="display:block">// koszyk jest pusty</li>';
    $('#cartTot').textContent = zl(s); };
  document.addEventListener('click', e => { const a = e.target.closest('[data-add]'), q = e.target.closest('[data-q]');
    if (a) { const id = a.dataset.add; cart[id] = (cart[id] || 0) + 1; save(); renderAcc(); renderCart(); Kit.toast(`> dodano: ${A.find(x => x.id === id).n}`); }
    if (q) { const id = q.dataset.q; cart[id] = (cart[id] || 0) + +q.dataset.d; if (cart[id] <= 0) delete cart[id]; save(); renderAcc(); renderCart(); }
    if (e.target.closest('[data-cart-open]')) openCart(true); if (e.target.closest('[data-cart-close]')) openCart(false); });
  const cartEl = $('#cart'); cartEl.inert = true; let lf;
  const openCart = o => { document.body.classList.toggle('cart-open', o); cartEl.inert = !o; cartEl.setAttribute('aria-hidden', !o); if (o) { lf = document.activeElement; setTimeout(() => $('.cart-h .ic').focus(), 60); } else lf && lf.focus && lf.focus(); };
  addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('cart-open')) openCart(false); });
  $('#checkout').onclick = () => { if (!Object.keys(cart).length) return Kit.toast('> koszyk jest pusty'); openCart(false); Kit.modal(`<p class="mono">✓ zamówienie_demo</p><h3>Odbierz w serwisie</h3><p class="muted">Rezerwacja akcesoriów na 48 h (demo). Nic nie zostało zamówione ani opłacone.</p><p style="margin-top:12px">Suma: <b>${$('#cartTot').textContent}</b>*</p>`); cart = {}; save(); renderAcc(); renderCart(); };
  /* ---------- trade-in ---------- */
  const TV = { 'iPhone 15 Pro': 3200, 'iPhone 15': 2500, 'iPhone 14': 1900, 'iPhone 13': 1500, 'iPhone 12': 1050, 'iPhone SE (3. gen.)': 700, 'Galaxy S24 Ultra': 3000, 'Galaxy S24': 2100, 'Galaxy S23': 1500, 'Galaxy A55': 900, 'Galaxy A35': 650, 'Galaxy A15': 280, 'Xiaomi 14': 1500, 'Redmi Note 13 Pro': 650, 'Redmi Note 13': 450, 'Redmi 13C': 200, 'Pixel 8 Pro': 2200, 'Pixel 8': 1600, 'Pixel 7a': 800 };
  $('#trModel').innerHTML = $('#accModel').innerHTML.replace('<option value="">Wszystkie modele</option>', ''); $('#trModel').value = 'iPhone 13';
  const MEM = ['128 GB', '256 GB', '512 GB']; let mem = 0;
  $('#trMem').innerHTML = MEM.map((m, i) => opt(m, i === 0, `data-mem="${i}"`)).join('');
  $('#trMem').addEventListener('click', e => { const b = e.target.closest('.opt'); if (!b) return; mem = +b.dataset.mem; $$('#trMem .opt').forEach(x => x.setAttribute('aria-checked', x === b)); trade(); });
  const CL = ['', 'zniszczony', 'mocno używany', 'ślady użycia', 'bardzo dobry', 'jak nowy'];
  const trade = () => { const v = TV[$('#trModel').value] || 500, c = +$('#trCond').value, bt = +$('#trBat').value;
    let o = v * [0, .35, .55, .72, .86, 1][c] * (1 + mem * .12) * (0.75 + (bt - 70) / 120) * ($('#trBox').checked ? 1.03 : 1) * ($('#trCrack').checked ? .65 : 1);
    o = Math.round(o / 10) * 10; $('#trCondL').textContent = CL[c]; $('#trBatL').textContent = bt + '%';
    $('#trOffer').textContent = zl(o); $('#trBonus').textContent = `lub ${zl(o * 1.15)} przy zakupie telefonu w serwisie (+15%, przykład)`;
    const g = $('#gArc'), L = g.getTotalLength ? g.getTotalLength() : 251.3; g.style.strokeDasharray = L; g.style.strokeDashoffset = L * (1 - Math.min(1, o / 3400)); };
  $$('#trModel,#trCond,#trBat,#trBox,#trCrack').forEach(i => i.addEventListener('input', trade)); trade();
  $('#trBtn').onclick = () => Kit.toast('> wycena zapisana (demo) – kurier mógłby odebrać telefon');
  /* ---------- booking ---------- */
  const H = { 0: null, 1: [9, 19], 2: [9, 19], 3: [9, 19], 4: [9, 19], 5: [9, 19], 6: [10, 15] };
  const bmode = () => $('[name=bm]:checked').value;
  $$('[name=bm]').forEach(i => i.addEventListener('change', () => { $('#addrF').style.display = bmode() === 'k' ? '' : 'none'; $('[name=a]').required = bmode() === 'k'; bk.st.time = null; bk.st.date && bk.slots(); }));
  const bk = Kit.booking($('#bk'), {
    hours: dt => H[dt.getDay()], step: 30, duration: () => bmode() === 'k' ? 120 : 60,
    busy: (dt, t) => (dt.getDate() * 5 + t / 30 * 3) % 7 === 0,
    onChange: s => { $('#slotHint').textContent = s.date ? `// ${s.date.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })} · ${bmode() === 'k' ? 'okno odbioru 2 h od:' : 'godzina wizyty:'}` : '// wybierz dzień'; },
    check: (s, x) => { if (s === 1 && (!x.date || !x.time)) return '> wybierz dzień i godzinę'; if (s === 2 && !Kit.validate($('#bkForm'))) return '> uzupełnij wymagane pola'; },
    onStep: (s, x) => { if (s === 3) { const f = $('#bkForm'), r = est(); $('#bkSum').innerHTML = `<dt>nr</dt><dd>NF-${2200 + Math.floor(Math.random() * 99)} (demo)</dd><dt>tryb</dt><dd>${bmode() === 'k' ? 'Kurier · odbiór ' + (f.a.value || '') : 'Wizyta w serwisie'}</dd><dt>termin</dt><dd>${x.date.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}, ${x.time}</dd><dt>urządzenie</dt><dd>${B[st.brand].m[st.model]}</dd><dt>usterka</dt><dd>${r.f.n} · ~${zl(r.p)}*</dd><dt>klient</dt><dd>${f.n.value}</dd>`; } } });
  $('#bkAgain').onclick = () => { $('#bkForm').reset(); bk.st.date = null; bk.st.time = null; bk.render(); $('#bk .slots').innerHTML = ''; bk.go(0); };
  /* rail scrollspy */
  const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) $$('.rail a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));
  renderEst(); renderAcc(); renderCart();
})();
