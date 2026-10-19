(() => {
  const { $, $$, store } = Kit;
  const zl = n => n.toFixed(2).replace('.', ',') + ' zł';
  $('#yr').textContent = new Date().getFullYear();
  /* ---------- products ---------- */
  const P = [
    { id: 'jab', n: 'Jabłka Ligol', c: 'Owoce', p: 5.49, u: 'kg', img: 'apples', eko: 1, gf: 1, local: 1 },
    { id: 'tru', n: 'Truskawki', c: 'Owoce', p: 12.99, old: 15.99, u: '500 g', img: 'strawberries', gf: 1, local: 1 },
    { id: 'pom', n: 'Pomidory malinowe na gałązce', c: 'Warzywa', p: 11.9, u: 'kg', img: 'tomatoes', eko: 1, gf: 1, local: 1 },
    { id: 'mar', n: 'Marchew z natką', c: 'Warzywa', p: 3.99, u: 'pęczek', img: 'carrots', eko: 1, gf: 1, local: 1 },
    { id: 'sal', n: 'Sałata masłowa + rukola', c: 'Warzywa', p: 4.49, old: 5.49, u: 'szt.', img: 'lettuce', gf: 1, local: 1 },
    { id: 'chl', n: 'Chleb żytni na zakwasie', c: 'Piekarnia', p: 12, u: '600 g', img: 'bread', local: 1 },
    { id: 'jaj', n: 'Jaja z wolnego wybiegu', c: 'Nabiał', p: 13.9, u: '10 szt.', img: 'eggs', eko: 1, gf: 1, local: 1 },
    { id: 'ser', n: 'Ser dojrzewający krowi', c: 'Nabiał', p: 18.9, u: '200 g', img: 'cheese', gf: 1 },
    { id: 'mle', n: 'Mleko świeże 3,2% w butelce', c: 'Nabiał', p: 4.99, u: '1 l', img: 'milk', gf: 1, local: 1 },
    { id: 'mio', n: 'Miód wielokwiatowy', c: 'Spiżarnia', p: 29, u: '400 g', img: 'honey', eko: 1, gf: 1, local: 1 },
    { id: 'kaw', n: 'Kawa ziarnista z lokalnej palarni', c: 'Spiżarnia', p: 34, old: 39, u: '250 g', img: 'coffee', gf: 1 },
    { id: 'cie', n: 'Ciecierzyca sucha', c: 'Spiżarnia', p: 7.49, u: '500 g', img: 'chickpeas', eko: 1, gf: 1 }];
  P.forEach(x => x.promo = !!x.old);
  const byId = id => P.find(x => x.id === id);
  /* ---------- cart state ---------- */
  let cart = {}; try { cart = JSON.parse(store.get('tg-cart') || '{}'); } catch (e) {}
  let slot = null;
  const save = () => store.set('tg-cart', JSON.stringify(cart));
  const sub = () => Object.entries(cart).reduce((s, [id, q]) => s + byId(id).p * q, 0);
  const FREE = 150, FEE = 19;
  const setQty = (id, q, src) => { q = Math.max(0, Math.min(99, q)); if (q) cart[id] = q; else delete cart[id]; save(); render(); renderCart(); bump(); };
  const bump = () => $$('[data-count]').forEach(b => { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); });
  /* ---------- catalog ---------- */
  const cats = ['Wszystko', 'Owoce', 'Warzywa', 'Piekarnia', 'Nabiał', 'Spiżarnia']; let cat = 'Wszystko';
  $('#catChips').innerHTML = cats.map((c, i) => `<button type="button" role="radio" aria-checked="${i === 0}">${c}</button>`).join('');
  const setCat = c => { cat = c; $$('#catChips button').forEach(b => b.setAttribute('aria-checked', b.textContent === c)); render(); };
  $('#catChips').addEventListener('click', e => { const b = e.target.closest('button'); b && setCat(b.textContent); });
  $$('.toggles input, #sort').forEach(i => i.addEventListener('change', render)); $('#q').addEventListener('input', render);
  const card = (x, i) => { const q = cart[x.id] || 0;
    return `<li class="prod" style="--d:${i * 45}ms"><figure><img src="img/${x.img}-480.webp" srcset="img/${x.img}-480.webp 480w, img/${x.img}.webp 1024w" sizes="(max-width:900px) 50vw, 260px" alt="${x.n}" loading="lazy" width="480" height="270"><div class="badges">${x.promo ? `<span class="badge promo">−${Math.round((1 - x.p / x.old) * 100)}%</span>` : ''}${x.eko ? '<span class="badge">EKO</span>' : ''}${x.gf ? '<span class="badge gf">bez glutenu</span>' : ''}</div></figure>
      <div class="b"><h3>${x.n}</h3><span class="u">${x.u}${x.local ? ' · z okolicy' : ''}</span><div class="row"><span class="price${x.promo ? ' p' : ''}">${zl(x.p)}${x.promo ? `<s>${zl(x.old)}</s>` : ''}</span>
      ${q ? `<div class="qty" role="group" aria-label="Ilość: ${x.n}"><button type="button" data-dec="${x.id}" aria-label="Mniej">−</button><span>${q}</span><button type="button" data-inc="${x.id}" aria-label="Więcej">+</button></div>` : `<button class="add" type="button" data-inc="${x.id}" aria-label="Dodaj do koszyka: ${x.n}">+</button>`}</div></div></li>`; };
  function render() { const f = $$('.toggles input:checked').map(i => i.value), q = $('#q').value.toLowerCase().trim(), s = $('#sort').value;
    let L = P.filter(x => (cat === 'Wszystko' || x.c === cat) && f.every(k => x[k]) && (!q || (x.n + ' ' + x.c).toLowerCase().includes(q)));
    if (s === 'asc') L.sort((a, b) => a.p - b.p); if (s === 'desc') L.sort((a, b) => b.p - a.p); if (s === 'az') L.sort((a, b) => a.n.localeCompare(b.n, 'pl'));
    $('#grid').innerHTML = L.map(card).join('') || '<li class="empty"><b>Pusto na półce 🧺</b><br>Zmień filtry albo wyszukiwaną frazę.</li>';
    $('#result').textContent = `${L.length} ${L.length === 1 ? 'produkt' : L.length < 5 && L.length ? 'produkty' : 'produktów'}${cat !== 'Wszystko' ? ' · ' + cat : ''}${q ? ` · „${q}”` : ''}`; }
  document.addEventListener('click', e => { const inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]'), rm = e.target.closest('[data-rm]');
    if (inc) { const id = inc.dataset.inc, had = cart[id]; setQty(id, (cart[id] || 0) + 1); if (!had) Kit.toast(`Dodano: ${byId(id).n}`); }
    if (dec) setQty(dec.dataset.dec, (cart[dec.dataset.dec] || 0) - 1);
    if (rm) setQty(rm.dataset.rm, 0);
    const c = e.target.closest('[data-cat]'); if (c) { setCat(c.dataset.cat); $('#q').value = ''; render(); } });
  const doSearch = (form) => form.addEventListener('submit', e => { e.preventDefault(); const v = $('input', form).value; $('#q').value = v; setCat('Wszystko'); Kit.setMenu(false); document.getElementById('katalog').scrollIntoView({ behavior: 'smooth' }); });
  doSearch($('#topSearch')); doSearch($('#mSearch'));
  /* ---------- cart drawer ---------- */
  const cartEl = $('#cart'); let lastF = null;
  const openCart = o => { document.body.classList.toggle('cart-open', o); cartEl.setAttribute('aria-hidden', !o); cartEl.inert = !o; if (o) { Kit.setMenu(false); lastF = document.activeElement; setTimeout(() => $('.cart-h .ic').focus(), 50); } else lastF && lastF.focus && lastF.focus(); };
  cartEl.inert = true;
  document.addEventListener('click', e => { if (e.target.closest('[data-cart-open]')) openCart(true); if (e.target.closest('[data-cart-close]')) openCart(false); if (e.target.closest('[data-close-menu]')) Kit.setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('cart-open')) openCart(false); });
  function renderCart() { const ids = Object.keys(cart), s = sub(), n = Object.values(cart).reduce((a, b) => a + b, 0);
    $$('[data-count]').forEach(b => b.textContent = n);
    $('#cartList').innerHTML = ids.map(id => { const x = byId(id), q = cart[id]; return `<li><img src="img/${x.img}-480.webp" alt=""><div><h3>${x.n}</h3><small>${zl(x.p)} / ${x.u}</small><br><button class="rm" data-rm="${id}" type="button">usuń</button></div><div class="r"><div class="qty"><button type="button" data-dec="${id}" aria-label="Mniej">−</button><span>${q}</span><button type="button" data-inc="${id}" aria-label="Więcej">+</button></div><b>${zl(x.p * q)}</b></div></li>`; }).join('') || '<li class="cart-empty" style="display:block;border:0"><b>🧺</b>Koszyk jest pusty.<br>Dorzuć coś świeżego!</li>';
    const pickup = slot && slot.mode === 'p'; const ship = !ids.length ? 0 : pickup || s >= FREE ? 0 : FEE;
    $('#sub').textContent = zl(s); $('#ship').textContent = !ids.length ? '—' : ship ? zl(ship) : 'gratis'; $('#tot').textContent = zl(s + ship);
    $$('[data-total]').forEach(t => t.textContent = zl(s + ship));
    $('#freeTxt').textContent = pickup ? 'Odbiór w sklepie: bez kosztów dostawy.' : s >= FREE ? '🎉 Masz darmową dostawę!' : `Brakuje ${zl(FREE - s)} do darmowej dostawy`;
    $('#freeBar').style.width = Math.min(100, s / FREE * 100) + '%';
    $('#cartSlot').innerHTML = slot ? `Termin: <b>${slot.label}</b> · <a href="#dostawa" data-cart-close>zmień</a>` : 'Termin: nie wybrano · <a href="#dostawa" data-cart-close>wybierz</a>'; }
  $('#checkout').onclick = () => { if (!Object.keys(cart).length) return Kit.toast('Koszyk jest pusty.'); if (!slot) { Kit.toast('Najpierw wybierz termin dostawy lub odbioru.'); openCart(false); document.getElementById('dostawa').scrollIntoView({ behavior: 'smooth' }); return; }
    const s = sub(), ship = slot.mode === 'p' || s >= FREE ? 0 : FEE;
    openCart(false); Kit.modal(`<h3>Zamówienie przyjęte! 🎉</h3><p>To wersja demonstracyjna: nic nie zostało zamówione ani pobrane.</p><dl><dt>Nr</dt><dd>TG-${String(Date.now()).slice(-5)} (demo)</dd><dt>Produkty</dt><dd>${Object.values(cart).reduce((a, b) => a + b, 0)} szt.</dd><dt>Termin</dt><dd>${slot.label}</dd><dt>Do zapłaty</dt><dd>${zl(s + ship)}</dd></dl><button class="btn" type="button" id="clearCart">Wyczyść koszyk</button>`);
    $('#clearCart').onclick = () => { cart = {}; save(); render(); renderCart(); $('.modal').classList.remove('open'); document.body.classList.remove('noscroll'); }; };
  /* ---------- leaflet flipbook ---------- */
  const deal = (id) => { const x = byId(id); return `<div class="deal"><img src="img/${x.img}-480.webp" alt=""><div><b>${x.n}</b><small>${x.u}</small><br><span class="pr">${zl(x.p)}</span>${x.old ? `<s>${zl(x.old)}</s>` : ''}</div></div>`; };
  const pages = [
    `<div class="pg cover"><div><b>targowo</b><br><small>Gazetka tygodnia · przykład</small></div><h3>Smaki sezonu −20%</h3><img src="img/strawberries-480.webp" alt="" style="border-radius:14px;aspect-ratio:16/10;object-fit:cover"><small>Ceny przykładowe · sklep fikcyjny</small></div>`,
    `<div class="pg"><h4>Owoce i warzywa <span>🍅</span></h4>${deal('tru')}${deal('sal')}${deal('pom')}<p class="note">Ceny przykładowe, ważne do wyczerpania zapasów (demo).</p></div>`,
    `<div class="pg"><h4>Spiżarnia <span>☕</span></h4>${deal('kaw')}${deal('mio')}${deal('cie')}<p class="note">Kawa −13% w aplikacji z Kartą Sąsiada (przykład).</p></div>`,
    `<div class="pg"><h4>Śniadanie <span>🥚</span></h4>${deal('jaj')}${deal('chl')}${deal('mle')}<p class="note">Ceny przykładowe.</p></div>`,
    `<div class="pg" style="background:var(--tomato);color:#fff"><h4>Przepis z gazetki</h4><img src="img/recipe1-640.webp" alt="" style="border-radius:12px;aspect-ratio:16/10;object-fit:cover;margin-bottom:10px"><b style="font-size:1.4rem;line-height:1">Szakszuka z pomidorów malinowych</b><p style="font-size:.85rem;margin-top:6px">Składniki dodasz do koszyka w sekcji „Przepisy tygodnia”.</p></div>`,
    `<div class="pg cover" style="background:var(--ink);color:var(--lime)"><h3>Do zobaczenia w sklepie!</h3><p>[ul. Przykładowa 12]<br>Pn–Pt 7–21 · Sob 8–20</p><small>Koniec gazetki · demo</small></div>`];
  const book = $('#book'); let lfi = 0, mobile = null, leaves = [];
  const buildBook = () => { const m = matchMedia('(max-width:900px)').matches; if (m === mobile) return; mobile = m; lfi = 0;
    if (m) book.innerHTML = pages.map((p, i) => `<div class="leaf" style="z-index:${pages.length - i}">${p.replace('class="pg', 'class="pg front')}</div>`).join('');
    else { let h = ''; for (let i = 0; i < pages.length; i += 2) h += `<div class="leaf" style="z-index:${pages.length - i}">${pages[i]}${(pages[i + 1] || '<div class="pg"></div>').replace('class="pg', 'class="pg back')}</div>`; book.innerHTML = h; }
    leaves = $$('.leaf', book); leaves.forEach((l, i) => l.addEventListener('click', () => flip(l.classList.contains('flipped') ? -1 : 1))); upd(); };
  const upd = () => { leaves.forEach((l, i) => { l.classList.toggle('flipped', i < lfi); l.style.zIndex = i < lfi ? i + 1 : leaves.length - i + 10; });
    $('#lfPage').textContent = `${mobile ? lfi + 1 : lfi * 2 || 1}${mobile ? '' : lfi && lfi < leaves.length ? '–' + (lfi * 2 + 1) : ''} / ${pages.length}`; $('#lfPrev').disabled = lfi === 0; $('#lfNext').disabled = lfi >= leaves.length - (mobile ? 1 : 0); };
  const flip = d => { lfi = Math.max(0, Math.min(leaves.length - (mobile ? 1 : 0), lfi + d)); upd(); };
  $('#lfPrev').onclick = () => flip(-1); $('#lfNext').onclick = () => flip(1);
  let sx = 0; book.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true }); book.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 40) flip(d < 0 ? 1 : -1); });
  buildBook(); addEventListener('resize', buildBook);
  /* ---------- delivery slots ---------- */
  const DN = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'], DL = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
  const days = []; for (let k = 0, d = new Date(); days.length < 6; k++) { const x = new Date(d); x.setDate(d.getDate() + k); if (x.getDay() !== 0) days.push(x); }
  let day = new Date().getHours() >= 16 || new Date().getDay() === 0 ? 1 : 0;
  const mode = () => $('.mode input:checked').value;
  $('#days').innerHTML = days.map((d, i) => `<button type="button" role="tab" aria-selected="${i === day}"><small>${i === 0 ? 'Dziś' : i === 1 && (days[1] - days[0]) / 864e5 === 1 ? 'Jutro' : DN[d.getDay()]}</small><b>${d.getDate()}</b><small>${d.toLocaleDateString('pl-PL', { month: 'short' })}</small></button>`).join('');
  const renderSlots = () => { const d = days[day], sat = d.getDay() === 6, now = new Date(); const W = mode() === 'd' ? (sat ? [[9, 11], [11, 13], [13, 15], [15, 17]] : [[8, 10], [10, 12], [12, 14], [14, 16], [16, 18], [18, 20]]) : (sat ? [[9, 12], [12, 15], [15, 19]] : [[8, 11], [11, 14], [14, 17], [17, 20]]);
    $('#slots').innerHTML = W.map(([a, b], i) => { const past = day === 0 && now.getHours() >= a - 1; const cap = (d.getDate() * 7 + i * 13 + (mode() === 'd' ? 3 : 5)) % 9; const full = cap === 0 || past;
      const sel = slot && slot.d === +d && slot.a === a && slot.mode === mode();
      return `<button type="button" class="slt" data-a="${a}" data-b="${b}" ${full ? 'disabled' : ''} aria-pressed="${!!sel}"><b>${a}:00–${b}:00</b><small>${full ? (past ? 'minął' : 'brak miejsc') : `wolne: ${cap}/8`}</small><i style="--f:${full ? 100 : (8 - cap) / 8 * 100}%"></i></button>`; }).join(''); };
  $('#days').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; day = [...$('#days').children].indexOf(b); $$('#days button').forEach(x => x.setAttribute('aria-selected', x === b)); renderSlots(); });
  $$('.mode input').forEach(i => i.addEventListener('change', () => { $('#zip').style.display = mode() === 'd' ? '' : 'none'; renderSlots(); }));
  $('#slots').addEventListener('click', e => { const b = e.target.closest('.slt'); if (!b || b.disabled) return; const d = days[day], a = +b.dataset.a;
    slot = { d: +d, a, mode: mode(), label: `${mode() === 'd' ? 'Dostawa' : 'Odbiór'} · ${DL[d.getDay()]} ${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}, ${a}:00–${b.dataset.b}:00` };
    $('#slotSum').innerHTML = `✓ ${slot.label} <a href="#" data-cart-open style="margin-left:8px">Przejdź do koszyka →</a>`; renderSlots(); renderCart(); });
  $('#zip').addEventListener('submit', e => { e.preventDefault(); const v = $('#zipIn').value.trim(), ok = /^\d{2}-?\d{3}$/.test(v); $('#zipMsg').textContent = ok ? '✓ Dowozimy pod ten adres (demo)' : 'Wpisz kod w formacie 00-000'; $('#zipMsg').style.color = ok ? '' : 'var(--tomato)'; });
  renderSlots();
  /* ---------- recipes ---------- */
  const R = [
    { n: 'Szakszuka z pomidorów malinowych', img: 'recipe1', t: '25 min', k: '2 porcje', lvl: 'łatwe', ing: [['pom', 1, 'pomidory malinowe 1 kg'], ['jaj', 1, 'jajka 4 szt.'], ['chl', 1, 'chleb na zakwasie']], extra: ['cebula, czosnek, natka', 'oliwa, sól, pieprz'] },
    { n: 'Sałatka z truskawkami i serem', img: 'recipe2', t: '15 min', k: '2 porcje', lvl: 'bardzo łatwe', ing: [['sal', 1, 'sałata masłowa + rukola'], ['tru', 1, 'truskawki 500 g'], ['ser', 1, 'ser dojrzewający'], ['mio', 1, 'miód do dressingu']], extra: ['oliwa, ocet balsamiczny'] }];
  $('#recipes').innerHTML = R.map((r, i) => { const sum = r.ing.reduce((s, [id, q]) => s + byId(id).p * q, 0);
    return `<article class="rcp" data-reveal style="--d:${i * 120}ms"><figure><img src="img/${r.img}-640.webp" srcset="img/${r.img}-640.webp 640w, img/${r.img}.webp 1024w" sizes="(max-width:900px) 100vw, 25vw" alt="${r.n}" loading="lazy"></figure><div class="b"><div class="meta"><span>⏱ ${r.t}</span><span>${r.k}</span><span>${r.lvl}</span></div><h3>${r.n}</h3><ul class="ing">${r.ing.map(([id, q, l]) => `<li class="inshop"><span>${l}</span><b>${zl(byId(id).p)}</b></li>`).join('')}${r.extra.map(l => `<li><span>${l}</span><small>masz w domu?</small></li>`).join('')}</ul><button class="btn" type="button" data-recipe="${i}">Dodaj składniki · ${zl(sum)}</button></div></article>`; }).join('');
  $('#recipes').addEventListener('click', e => { const b = e.target.closest('[data-recipe]'); if (!b) return; R[+b.dataset.recipe].ing.forEach(([id, q]) => cart[id] = (cart[id] || 0) + q); save(); render(); renderCart(); bump(); Kit.toast('Składniki przepisu dodane do koszyka 🧺'); });
  /* observe new reveal elements */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1 });
  $$('#recipes [data-reveal]').forEach(el => io.observe(el));
  /* ---------- loyalty ---------- */
  const sp = $('#spend'); const lu = () => { const v = +sp.value; $('#spendOut').textContent = v + ' zł'; $('#pts').textContent = v.toLocaleString('pl-PL'); $('#save').textContent = Math.floor(v * 12 / 500) * 25 + ' zł'; };
  sp.addEventListener('input', lu); lu();
  $('#stamps').innerHTML = Array.from({ length: 10 }, (_, i) => `<span class="${i < 7 ? 'on' : ''}" style="--d:${i * 80}ms">${i < 7 ? '☕' : i === 9 ? '🎁' : ''}</span>`).join('');
  $('#joinBtn').onclick = () => Kit.toast('Karta Sąsiada założona (demo, nic nie zostało zapisane).');
  /* ---------- hours ---------- */
  const H = { 0: null, 1: [7, 21], 2: [7, 21], 3: [7, 21], 4: [7, 21], 5: [7, 21], 6: [8, 20] }, now = new Date(), d = now.getDay(), hh = now.getHours() + now.getMinutes() / 60;
  const open = H[d] && hh >= H[d][0] && hh < H[d][1];
  $('#openNow').className = 'open-now ' + (open ? 'yes' : 'no'); $('#openNow').textContent = open ? `● Otwarte do ${H[d][1]}:00` : '● Teraz zamknięte';
  $('#mOpen').textContent = open ? `Otwarte do ${H[d][1]}:00` : 'Teraz zamknięte';
  $('#hours').innerHTML = [1, 2, 3, 4, 5, 6, 0].map(k => `<li class="${k === d ? 'today' : ''}"><span>${DL[k][0].toUpperCase() + DL[k].slice(1)}</span><span>${H[k] ? H[k][0] + ':00–' + H[k][1] + ':00' : 'nieczynne'}</span></li>`).join('');
  /* nav scrollspy-ish */
  render(); renderCart();
})();
