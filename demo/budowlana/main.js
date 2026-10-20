/* Fundamo – demo logic */
(() => {
  const { $, $$ } = Kit;
  $('#yr').textContent = new Date().getFullYear();
  const zl = n => (Math.round(n / 100) * 100).toLocaleString('pl-PL') + ' zł';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* mobile sheet: scrim + swipe down to close */
  $$('.mnav [data-close]').forEach(e => e.addEventListener('click', () => Kit.setMenu(false)));
  const sheet = $('.mn-sheet'); let sy = null, dy = 0;
  sheet.addEventListener('touchstart', e => { if (sheet.scrollTop > 0) return; sy = e.touches[0].clientY; dy = 0; sheet.style.transition = 'none'; }, { passive: true });
  sheet.addEventListener('touchmove', e => { if (sy === null) return; dy = Math.max(0, e.touches[0].clientY - sy); sheet.style.transform = `translateY(${dy}px)`; }, { passive: true });
  sheet.addEventListener('touchend', () => { if (sy === null) return; sheet.style.transition = ''; sheet.style.transform = ''; if (dy > 90) Kit.setMenu(false); sy = null; });

  /* build progress bar */
  const bb = $('#buildBar'), bt = $('#buildTxt');
  const prog = () => { const p = Math.round(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) * 100); bb.style.width = p + '%'; bt.textContent = `stan budowy strony: ${p}%${p > 98 ? ' · odbiór ✓' : p > 70 ? ' · wykończenie' : p > 35 ? ' · stan surowy' : ' · fundamenty'}`; };
  addEventListener('scroll', prog, { passive: true }); prog();

  /* counters */
  const cio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const el = e.target, to = +el.dataset.countTo, t0 = performance.now();
    const st = t => { const p = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(st); }; requestAnimationFrame(st); cio.unobserve(el); }));
  $$('[data-count-to]').forEach(e => cio.observe(e));

  /* services */
  const svc = [
    { k: 'domy', n: 'Domy pod klucz', img: 'house', from: '4 900 zł/m²', t: 'Od projektu adaptacji i kierownika budowy po stan deweloperski albo pod klucz. Jedna umowa, jeden harmonogram.', li: ['Fundamenty, ściany, stropy, więźba', 'Dach, okna, elewacja z ociepleniem', 'Instalacje i pompa ciepła', 'Wykończenie wnętrz pod klucz'] },
    { k: 'remonty', n: 'Remonty mieszkań', img: 'living', from: '850 zł/m²', t: 'Kompleksowe remonty mieszkań w blokach i kamienicach. Mieszkasz gdzie indziej, a my codziennie wysyłamy zdjęcia z postępu.', li: ['Wyburzenia i nowe ścianki', 'Wymiana elektryki i hydrauliki', 'Gładzie, malowanie, sufity', 'Podłogi, drzwi, listwy'] },
    { k: 'lazienki', n: 'Łazienki i kuchnie', img: 'tiles', from: '2 600 zł/m²', t: 'Pomieszczenia mokre robimy z hydroizolacją, spadkami i odbiorem szczelności. Płytki wielkoformatowe bez „schodków”.', li: ['Hydroizolacja i odpływy liniowe', 'Płytki do 120×280 cm', 'Zabudowy GK i wnęki LED', 'Montaż armatury i AGD'] },
    { k: 'elewacje', n: 'Elewacje i docieplenia', img: 'facade', from: '260 zł/m²', t: 'Docieplenie styropianem lub wełną z tynkiem cienkowarstwowym. Pomagamy przygotować wniosek o dofinansowanie (przykład).', li: ['Ocieplenie ścian i cokołów', 'Tynki silikonowe i mineralne', 'Okładziny drewnopodobne', 'Parapety i obróbki'] },
    { k: 'dachy', n: 'Dachy', img: 'roof', from: '320 zł/m²', t: 'Więźby, pokrycia z blachy na rąbek, dachówki i dachy płaskie. Wymiana starego eternitu z utylizacją.', li: ['Więźba i deskowanie', 'Blacha na rąbek, dachówka', 'Okna dachowe i kominy', 'Rynny i obróbki blacharskie'] }];
  $('#svcTabs').innerHTML = svc.map((s, i) => `<button type="button" role="tab" id="st-${s.k}" aria-selected="${i === 0}" class="${i === 0 ? 'on' : ''}" data-i="${i}"><span>0${i + 1}</span>${s.n}<i>→</i></button>`).join('');
  const showSvc = i => { const s = svc[i]; $('#svcPane').setAttribute('aria-labelledby', 'st-' + s.k);
    $('#svcPane').innerHTML = `<figure><img src="img/${s.img}-640.webp" srcset="img/${s.img}-640.webp 640w, img/${s.img}.webp 1024w" sizes="(max-width:900px) 100vw, 45vw" alt="${s.n} – zdjęcie poglądowe"><span class="from">od ${s.from}*</span></figure><div><h3>${s.n}</h3><p>${s.t}</p><ul>${s.li.map(x => `<li>${x}</li>`).join('')}</ul><a class="btn line" href="#wycena" data-svc="${s.n}">Zapytaj o ${s.n.toLowerCase()} →</a><p class="small muted">* cena przykładowa, netto</p></div>`;
    $$('#svcTabs button').forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-selected', k === i); }); };
  $('#svcTabs').addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) showSvc(+b.dataset.i); });
  $('#svcTabs').addEventListener('keydown', e => { const bs = $$('#svcTabs button'), i = bs.indexOf(document.activeElement); if (i < 0) return; const n = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? i - 1 : null; if (n === null) return; e.preventDefault(); const j = (n + bs.length) % bs.length; bs[j].focus(); showSvc(j); });
  showSvc(0);
  document.addEventListener('click', e => { const s = e.target.closest('[data-svc]'); if (s) { const d = $('#qForm [name=d]'); if (!d.value) d.value = `Interesuje mnie: ${s.dataset.svc}. `; } });

  /* before / after */
  const BA = { kitchen: { b: 'kitchen-before', a: 'kitchen-after', ab: 'Kuchnia przed remontem: stare brązowe szafki i zniszczona podłoga', aa: 'Ta sama kuchnia po remoncie: zielone szafki bez uchwytów i jasna podłoga', s: [['Metraż', '9 m²'], ['Czas', '16 dni roboczych'], ['Zakres', 'nowa elektryka, wylewka, płytki, zabudowa, AGD'], ['Koszt*', 'ok. 38 000 zł']] },
    bath: { b: 'bath-before', a: 'bath-after', ab: 'Łazienka przed remontem: różowe kafelki, zardzewiała wanna, odpadający tynk', aa: 'Ta sama łazienka po remoncie: szare płyty, wanna wolnostojąca, czarna armatura', s: [['Metraż', '7 m²'], ['Czas', '12 dni roboczych'], ['Zakres', 'skucie, hydroizolacja, płyty 60×120, wnęka LED, deszczownica'], ['Koszt*', 'ok. 31 000 zł']] } };
  const ba = $('#ba'), r = $('#baR');
  const setBA = v => { ba.style.setProperty('--p', v + '%'); };
  r.addEventListener('input', () => setBA(r.value)); setBA(50);
  const loadBA = k => { const o = BA[k]; $('#baBefore').src = `img/${o.b}.webp`; $('#baBefore').alt = o.ab; $('#baAfter').src = `img/${o.a}.webp`; $('#baAfter').alt = o.aa;
    $('#baSpec').innerHTML = `<p class="eyebrow">karta realizacji</p><dl>${o.s.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl><p class="small muted">* koszt przykładowy</p>`;
    $$('[data-ba]').forEach(b => { b.classList.toggle('on', b.dataset.ba === k); b.setAttribute('aria-selected', b.dataset.ba === k); });
    if (!reduce) { let v = 50, t0 = performance.now(); const an = t => { const p = Math.min(1, (t - t0) / 1200); v = 50 + Math.sin(p * Math.PI * 2) * 30 * (1 - p); r.value = v; setBA(v); if (p < 1) requestAnimationFrame(an); }; requestAnimationFrame(an); } };
  $$('[data-ba]').forEach(b => b.onclick = () => loadBA(b.dataset.ba)); loadBA('kitchen');

  /* gallery */
  const G = [['house', 'domy', 'Dom 148 m² · stan pod klucz'], ['living', 'wnetrza', 'Salon z jodełką · 32 m²'], ['kitchen-after', 'wnetrza', 'Kuchnia w bloku · po remoncie'], ['facade', 'elewacje', 'Docieplenie i tynk · 210 m²'], ['roof', 'dachy', 'Blacha na rąbek · 180 m²'], ['bath-after', 'wnetrza', 'Łazienka w kamienicy · po remoncie'], ['hero', 'domy', 'Dom w budowie · więźba'], ['tiles', 'wnetrza', 'Płytki wielkoformatowe 60×120']];
  const GF = { all: 'Wszystkie', domy: 'Domy', wnetrza: 'Wnętrza', elewacje: 'Elewacje', dachy: 'Dachy' };
  $('#galF').innerHTML = Object.entries(GF).map(([k, v], i) => `<button type="button" class="chip${i ? '' : ' on'}" data-f="${k}" aria-pressed="${!i}">${v}<sup>${k === 'all' ? G.length : G.filter(g => g[1] === k).length}</sup></button>`).join('');
  $('#gal').innerHTML = G.map(([im, c, cap], i) => `<a href="img/${im}.webp" class="g g${i}" data-c="${c}" data-lightbox="gal" data-caption="${cap} (zdjęcie poglądowe)"><img src="img/${im}-640.webp" alt="${cap}" loading="lazy"><span><b>${cap}</b><i>${GF[c]}</i></span></a>`).join('');
  const galN = () => { $('#galN').textContent = `${$$('#gal .g:not(.hide)').length} realizacji (przykładowe)`; };
  $('#galF').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; const f = b.dataset.f;
    $$('#galF .chip').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    $$('#gal .g').forEach(g => { const show = f === 'all' || g.dataset.c === f; g.classList.toggle('hide', !show); g.hidden = !show; if (show) g.removeAttribute('data-lightbox-off'); g.dataset.lightbox = show ? 'gal' : 'off'; }); galN(); });
  galN();

  /* renovation calculator */
  const TYPES = [['m', 'Mieszkanie w bloku', 1], ['k', 'Kamienica', 1.15], ['d', 'Dom', 1.08]];
  const STD = [['e', 'Odświeżenie', 'malowanie, podłogi, drobne naprawy', 0.45], ['s', 'Standard', 'kompleksowy remont, średnia półka', 1], ['p', 'Premium', 'wielki format, zabudowy, smart home', 1.65]];
  const SCOPE = [['dem', 'Wyburzenia i wywóz', 60, 'm2'], ['el', 'Nowa instalacja elektryczna', 140, 'm2'], ['hyd', 'Nowa hydraulika', 90, 'm2'], ['gl', 'Gładzie i malowanie', 160, 'm2'], ['pod', 'Podłogi (wylewka + panele/deska)', 210, 'm2'], ['laz', 'Łazienka kompleksowo', 26000, 'szt'], ['kuch', 'Kuchnia (bez AGD)', 21000, 'szt'], ['drz', 'Drzwi wewnętrzne (4 szt.)', 6800, 'szt']];
  const MAT = [['f', 'Materiały kupuje Fundamo', 'rabat hurtowy, jedna faktura', 1], ['k', 'Materiały kupuję sam/a', 'liczymy tylko robociznę', 0.55]];
  const opt = (arr, name, def, desc) => arr.map(([k, n, d], i) => `<label><input type="radio" name="${name}" value="${k}" ${k === def ? 'checked' : ''}><span><b>${n}</b>${desc && typeof d === 'string' ? `<small>${d}</small>` : ''}</span></label>`).join('');
  $('#cType').innerHTML = opt(TYPES, 'ct', 'm'); $('#cStd').innerHTML = opt(STD, 'cs', 's', true); $('#cMat').innerHTML = opt(MAT, 'cm', 'f', true);
  $('#cScope').innerHTML = SCOPE.map(([k, n, p, u], i) => `<label><input type="checkbox" value="${k}" ${['el', 'gl', 'pod', 'laz'].includes(k) ? 'checked' : ''}><span>${n}<em>${u === 'm2' ? p + ' zł/m²*' : p.toLocaleString('pl-PL') + ' zł*'}</em></span></label>`).join('');
  const area = $('#cArea'), areaN = $('#cAreaN');
  const plan = () => { const a = +area.value, w = Math.min(100, 30 + a / 2.5); $('#cPlan').innerHTML = `<div class="room" style="width:${w}%;height:${Math.min(140, 50 + a / 2.2)}px"><span>${a} m²</span><i class="dw">${(Math.sqrt(a * 1.4)).toFixed(1).replace('.', ',')} m</i><i class="dh">${(a / Math.sqrt(a * 1.4)).toFixed(1).replace('.', ',')} m</i></div>`; };
  let last = null;
  const calc = () => { const a = +area.value, t = TYPES.find(x => x[0] === $('[name=ct]:checked').value), s = STD.find(x => x[0] === $('[name=cs]:checked').value), m = MAT.find(x => x[0] === $('[name=cm]:checked').value);
    const items = SCOPE.filter(x => $(`#cScope input[value=${x[0]}]`).checked).map(([k, n, p, u]) => [n, (u === 'm2' ? p * a : p) * t[2] * s[3] * m[3]]);
    const tot = items.reduce((q, x) => q + x[1], 0), mn = tot * .9, mx = tot * 1.15, wk = Math.max(1, Math.round((items.length * 1.1 + a / 28) * (s[0] === 'p' ? 1.3 : s[0] === 'e' ? .6 : 1)));
    $('#rMin').textContent = tot ? zl(mn) : '0 zł'; $('#rMax').textContent = tot ? zl(mx) : '0 zł';
    $('#rM2').textContent = tot ? Math.round(tot / a).toLocaleString('pl-PL') + ' zł' : '–'; $('#rWk').textContent = tot ? `${wk}–${wk + 2} tyg.` : '–';
    const mxi = Math.max(1, ...items.map(x => x[1]));
    $('#rBrk').innerHTML = items.length ? items.sort((a, b) => b[1] - a[1]).map(([n, v]) => `<li><span>${n}</span><b>${zl(v)}</b><i style="--w:${v / mxi * 100}%"></i></li>`).join('') : '<li class="muted">Zaznacz zakres prac (D).</li>';
    last = { a, t: t[1], s: s[1], m: m[1], mn, mx, wk, sc: items.map(x => x[0]) }; plan(); };
  area.addEventListener('input', () => { areaN.value = area.value; calc(); });
  areaN.addEventListener('change', () => { const v = Math.max(15, Math.min(250, +areaN.value || 15)); areaN.value = v; area.value = v; calc(); });
  $('#calcF').addEventListener('change', calc); calc();
  $('#toQuote').onclick = () => { if (!last) return; const q = $('#qCalc'); q.hidden = false;
    q.innerHTML = `<b>Dołączony kosztorys z kalkulatora</b><span>${last.t} · ${last.a} m² · ${last.s} · ${last.m.toLowerCase()}</span><span>${zl(last.mn)} – ${zl(last.mx)} · ${last.wk}–${last.wk + 2} tyg.</span><button type="button" class="x" aria-label="Usuń dołączony kosztorys">×</button>`;
    q.querySelector('.x').onclick = () => { q.hidden = true; };
    $('#qForm [name=d]').value = `Zakres: ${last.sc.join(', ')}.`; $('#qBud').value = Math.round(last.mx / 1000 / 10) * 10 || 20; $('#qBud').dispatchEvent(new Event('input'));
    $('#wycena').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); Kit.toast('Kosztorys przeniesiony do formularza'); };

  /* process timeline */
  const tl = $('#tl');
  tl.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const li = b.parentElement, o = b.getAttribute('aria-expanded') === 'true';
    $$('#tl li').forEach(x => { x.classList.remove('open'); x.firstElementChild.setAttribute('aria-expanded', 'false'); });
    if (!o) { li.classList.add('open'); b.setAttribute('aria-expanded', 'true'); } });
  tl.firstElementChild.classList.add('open');
  const tlProg = () => { const rr = tl.getBoundingClientRect(), p = Math.max(0, Math.min(1, (innerHeight * .6 - rr.top) / rr.height)); tl.style.setProperty('--tp', p); $$('#tl li').forEach(li => { const q = li.getBoundingClientRect(); li.classList.toggle('reached', q.top < innerHeight * .6); }); };
  addEventListener('scroll', tlProg, { passive: true }); tlProg();

  /* gantt */
  const PK = [['sso', 'Stan surowy otwarty'], ['ssz', 'Stan surowy zamknięty'], ['dew', 'Stan deweloperski'], ['klucz', 'Pod klucz']];
  const PH = [['Formalności i przygotowanie', 0, 1.5, 'sso', 'pozwolenie / zgłoszenie, geodeta, przyłącza tymczasowe'], ['Fundamenty i izolacje', 1.5, 1, 'sso', 'ławy, ściany fundamentowe, hydroizolacja, chudziak'], ['Ściany i stropy', 2.5, 1.5, 'sso', 'murowanie, wieńce, strop żelbetowy'], ['Więźba i dach', 4, 1, 'sso', 'więźba, membrana, pokrycie'], ['Okna i drzwi zewn.', 5, .5, 'ssz', 'montaż w ciepłym montażu'], ['Instalacje', 5.5, 1.5, 'dew', 'elektryka, wod-kan, pompa ciepła, rekuperacja'], ['Tynki i wylewki', 7, 1, 'dew', 'tynki gipsowe, wylewki z ogrzewaniem podłogowym'], ['Elewacja', 7, 1.5, 'dew', 'docieplenie, tynk, parapety'], ['Wykończenie wnętrz', 8.5, 2, 'klucz', 'płytki, podłogi, drzwi, biały montaż, malowanie']];
  let pk = 'dew';
  $('#gPkg').innerHTML = PK.map(([k, n]) => `<button type="button" role="radio" data-pk="${k}" class="${k === pk ? 'on' : ''}" aria-checked="${k === pk}">${n}</button>`).join('');
  const renderG = () => { const idx = PK.findIndex(x => x[0] === pk), w = $('#gWinter').checked; const ph = PH.filter(p => PK.findIndex(x => x[0] === p[3]) <= idx).map(p => { let s = p[1]; if (w && s >= 2.5) s += 2.5; return [p[0], s, p[2], p[4]]; });
    const end = Math.max(...ph.map(p => p[1] + p[2])), M = Math.ceil(end);
    const mn = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12', 'M13', 'M14'];
    $('#gantt').innerHTML = `<div class="g-head" style="--m:${M}"><span></span><div>${Array.from({ length: M }, (_, i) => `<i>${mn[i]}</i>`).join('')}</div></div>` + ph.map((p, i) => `<div class="g-row" style="--m:${M}"><span>${p[0]}</span><div><button type="button" class="g-bar" style="--s:${p[1] / M * 100}%;--w:${p[2] / M * 100}%;--i:${i}" data-i="${i}" aria-label="${p[0]}: od miesiąca ${(p[1] + 1).toFixed(1)}, ${p[2]} mies.">${p[2] >= 1 ? p[2].toString().replace('.', ',') + ' mies.' : ''}</button></div></div>`).join('') + (w ? `<div class="g-row winter" style="--m:${M}"><span>Przerwa zimowa</span><div><i style="--s:${2.5 / M * 100}%;--w:${2.5 / M * 100}%"></i></div></div>` : '');
    $('#gInfo').innerHTML = `<b>${PK[idx][1]}</b>: ok. <b>${end.toString().replace('.', ',')} mies.</b> od podpisania umowy (harmonogram przykładowy).`;
    $$('#gantt .g-bar').forEach(b => { const p = ph[+b.dataset.i]; const f = () => { $('#gInfo').innerHTML = `<b>${p[0]}</b> · ${p[2].toString().replace('.', ',')} mies. · ${p[3]}`; }; b.addEventListener('mouseenter', f); b.addEventListener('focus', f); b.addEventListener('click', f); }); };
  $('#gPkg').addEventListener('click', e => { const b = e.target.closest('[data-pk]'); if (!b) return; pk = b.dataset.pk; $$('#gPkg button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); }); renderG(); });
  $('#gWinter').onchange = renderG; renderG();

  /* quote form */
  const ms = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'], now = new Date();
  $('#qStart').innerHTML = '<option>Jak najszybciej</option>' + Array.from({ length: 10 }, (_, i) => { const d = new Date(now.getFullYear(), now.getMonth() + i + 1, 1); return `<option>${ms[d.getMonth()]} ${d.getFullYear()}</option>`; }).join('');
  const bud = $('#qBud'), budL = $('#qBudL'); const bl = () => { budL.textContent = bud.value >= 1500 ? 'powyżej 1,5 mln zł' : `do ${(+bud.value).toLocaleString('pl-PL')} tys. zł`; }; bud.addEventListener('input', bl); bl();
  const fl = $('#qFiles'), list = $('#qFl'), drop = $('#drop'); let files = [];
  const showF = () => { list.innerHTML = files.map((f, i) => `<li><span>${f.name.replace(/</g, '')}</span><small>${(f.size / 1024 / 1024).toFixed(1).replace('.', ',')} MB</small><button type="button" data-rm="${i}" aria-label="Usuń plik ${f.name.replace(/"/g, '')}">×</button></li>`).join(''); };
  fl.addEventListener('change', () => { files = files.concat([...fl.files]).slice(0, 8); fl.value = ''; showF(); });
  list.addEventListener('click', e => { const b = e.target.closest('[data-rm]'); if (b) { files.splice(+b.dataset.rm, 1); showF(); } });
  ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); if (ev === 'drop') { files = files.concat([...e.dataTransfer.files]).slice(0, 8); showF(); } }));
  $('#qForm').addEventListener('submit', e => { e.preventDefault(); const f = e.target; if (!Kit.validate(f)) { Kit.toast('Uzupełnij wymagane pola.'); return; }
    const nr = 'FD-' + String(Date.now()).slice(-5);
    Kit.modal(`<p class="eyebrow">zapytanie ${nr}</p><h3>Dziękujemy, ${f.n.value.split(' ')[0].replace(/</g, '')}!</h3><dl class="sum"><dt>Rodzaj</dt><dd>${$('[name=qt]:checked').value}</dd><dt>Miejsce</dt><dd>${f.m.value.replace(/</g, '')}</dd><dt>Start</dt><dd>${f.s.value}</dd><dt>Budżet</dt><dd>${budL.textContent}</dd><dt>Załączniki</dt><dd>${files.length || 'brak'}</dd></dl><p class="small muted">Wersja demonstracyjna: nic nie zostało wysłane, nikt nie oddzwoni.</p>`);
    f.reset(); files = []; showF(); bl(); $('#qCalc').hidden = true; });

  /* service area */
  const dist = $('#dist'); const dd = () => { const v = +dist.value; $('#distL').textContent = v + ' km'; $('#mapR').setAttribute('r', Math.max(12, v / 150 * 250));
    $('#distR').innerHTML = v <= 50 ? '<b>✓ W zasięgu.</b> Dojazd i oględziny bez opłat (przykład).' : v <= 150 ? '<b>✓ W zasięgu.</b> Dojazd na oględziny [kwota do ustalenia].' : 'Poza obszarem.'; };
  dist.addEventListener('input', dd); dd();
})();
