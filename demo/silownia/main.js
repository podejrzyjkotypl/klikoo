/* Hartbox – demo logic */
(() => {
  const { $, $$, store } = Kit;
  $('#yr').textContent = new Date().getFullYear();
  const zl = n => Math.round(n).toLocaleString('pl-PL') + ' zł';

  /* ---------- occupancy (simulated by hour) ---------- */
  const curve = [0,0,0,0,0,0,30,55,48,30,22,20,26,28,25,30,48,72,86,80,64,45,30,15];
  const wkMul = [1,1.05,1,1.08,.9,.7,.55];
  const occNow = () => { const d = new Date(), h = d.getHours(), wd = (d.getDay() + 6) % 7; if (h < 6 || h >= 23) return 0; return Math.min(98, Math.round(curve[h] * wkMul[wd] + (d.getMinutes() % 7))); };
  const paintOcc = () => { const o = occNow(); $$('[data-occ]').forEach(e => e.textContent = o ? o + '%' : 'zamknięte'); $$('[data-occ-bar]').forEach(e => e.style.width = o + '%'); document.documentElement.style.setProperty('--occ', o > 70 ? 'var(--acc)' : o > 45 ? '#ffb020' : '#2ecc71'); };
  paintOcc(); setInterval(paintOcc, 60000);

  /* counters */
  const cio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const el = e.target, to = +el.dataset.countTo, t0 = performance.now();
    const step = t => { const p = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString('pl-PL'); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); cio.unobserve(el); }));
  $$('[data-count-to]').forEach(e => cio.observe(e));

  /* ---------- schedule ---------- */
  const DN = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'], DL = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
  const CAT = { sila: 'Siła', cardio: 'Cardio', mind: 'Mind & body', walka: 'Walka' };
  const INT = { 1: 'Łagodne', 2: 'Średnie', 3: 'Mocne' };
  const T = { tm: 'Tomasz Mazur', ka: 'Kasia Nowik', ew: 'Ewa Lis', ad: 'Adam Ryś' };
  const base = [
    ['06:30', 45, 'Poranna siła', 'sila', 3, 'tm', 12], ['07:30', 50, 'Cycling Sunrise', 'cardio', 3, 'ka', 28], ['09:00', 60, 'Joga Flow', 'mind', 1, 'ew', 18],
    ['10:30', 55, 'Pilates Reformer', 'mind', 2, 'ew', 8], ['12:15', 30, 'Lunch HIIT', 'cardio', 3, 'ka', 16], ['16:30', 60, 'Boks dla początkujących', 'walka', 2, 'ad', 14],
    ['17:30', 55, 'Kettlebell Club', 'sila', 2, 'tm', 14], ['18:00', 45, 'Cycling Beats', 'cardio', 3, 'ka', 28], ['18:30', 60, 'Mobility & Stretch', 'mind', 1, 'ew', 20],
    ['19:00', 60, 'Boks sparingowy', 'walka', 3, 'ad', 12], ['19:30', 50, 'Zdrowy kręgosłup', 'mind', 1, 'ew', 16], ['20:00', 45, 'Barbell Basics', 'sila', 2, 'tm', 10]];
  const week = DN.map((_, d) => base.filter((c, i) => d > 4 ? c[0] >= '09:00' && c[0] <= '18:30' : (i + d) % 3 !== 0).map((c, i) => { const seed = (d * 31 + i * 17) % 11; return { t: c[0], dur: c[1], name: c[2], cat: c[3], int: c[4], tr: c[5], cap: c[6], taken: Math.min(c[6], Math.round(c[6] * (.35 + seed / 14))) }; }));
  const mine = new Set(JSON.parse(store.get('hb-mine') || '[]'));
  let day = (new Date().getDay() + 6) % 7, fCat = 'all', fInt = 0;
  $('#days').innerHTML = DN.map((d, i) => `<button type="button" role="tab" aria-selected="${i === day}" data-d="${i}" class="${i === day ? 'on' : ''}"><b>${d}</b><small>${week[i].length} zaj.</small></button>`).join('');
  $('#cats').innerHTML = `<button type="button" class="chip on" data-c="all" aria-pressed="true">Wszystkie</button>` + Object.entries(CAT).map(([k, v]) => `<button type="button" class="chip c-${k}" data-c="${k}" aria-pressed="false">${v}</button>`).join('');
  $('#ints').innerHTML = `<button type="button" class="chip on" data-i="0" aria-pressed="true">Każda</button>` + Object.entries(INT).map(([k, v]) => `<button type="button" class="chip" data-i="${k}" aria-pressed="false">${'●'.repeat(k)}${'○'.repeat(3 - k)} ${v}</button>`).join('');
  const key = (d, c) => `${d}-${c.t}-${c.name}`;
  const renderSched = () => {
    const free = $('#onlyFree').checked;
    const list = week[day].filter(c => (fCat === 'all' || c.cat === fCat) && (!fInt || c.int == fInt) && (!free || c.taken < c.cap));
    $('#sched').innerHTML = list.length ? list.map((c, i) => { const k = key(day, c), m = mine.has(k), left = c.cap - c.taken - (m ? 1 : 0) + (m ? 1 : 0), full = c.taken >= c.cap && !m;
      return `<li class="cls c-${c.cat}${m ? ' mine' : ''}${full ? ' full' : ''}" style="--d:${i * 40}ms"><span class="cl-t"><b>${c.t}</b><small>${c.dur} min</small></span><span class="cl-n"><b>${c.name}</b><small>${CAT[c.cat]} · ${T[c.tr]} · ${'●'.repeat(c.int)}${'○'.repeat(3 - c.int)}</small></span><span class="cl-cap"><i style="width:${c.taken / c.cap * 100}%"></i><small>${full ? 'brak miejsc' : (c.cap - c.taken) + ' / ' + c.cap + ' wolnych'}</small></span><button type="button" class="btn sm${m ? ' ghost' : ''}" data-k="${k}" ${full ? 'disabled' : ''}>${m ? 'Wypisz się' : full ? 'Lista rezerwowa' : 'Zapisz się'}</button></li>`; }).join('')
      : '<li class="empty">Brak zajęć dla tych filtrów. Zmień dzień lub filtr.</li>';
  };
  $('#days').addEventListener('click', e => { const b = e.target.closest('[data-d]'); if (!b) return; day = +b.dataset.d; $$('#days button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); }); renderSched(); });
  $('#cats').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; fCat = b.dataset.c; $$('#cats .chip').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); renderSched(); });
  $('#ints').addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; fInt = +b.dataset.i; $$('#ints .chip').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); renderSched(); });
  $('#onlyFree').addEventListener('change', renderSched);
  $('#sched').addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (!b) return; const k = b.dataset.k, c = week[day].find(x => key(day, x) === k);
    if (mine.has(k)) { mine.delete(k); c.taken--; Kit.toast(`Wypisano z: ${c.name} (demo)`); } else { mine.add(k); c.taken++; Kit.toast(`Zapisano na ${c.name}, ${DL[day].toLowerCase()} ${c.t} (demo)`); }
    store.set('hb-mine', JSON.stringify([...mine])); renderSched(); });
  renderSched();

  /* ---------- plans ---------- */
  const plans = [
    { id: 'poranny', n: 'Poranny', d: 'Wejścia do 15:00', m: 99, f: ['Siłownia i cardio 6–15', 'Szafka i ręcznik', 'Aplikacja z planem'], no: ['Zajęcia grupowe', 'Sauna'] },
    { id: 'open', n: 'Open', d: 'Najczęściej wybierany', m: 149, hot: true, f: ['Siłownia 7 dni, bez limitu godzin', 'Wszystkie zajęcia grupowe', 'Wprowadzenie z trenerem', 'Sauna 2× w miesiącu'], no: ['Trening personalny'] },
    { id: 'pro', n: 'Pro', d: 'Z trenerem w pakiecie', m: 269, f: ['Wszystko z Open', '2 treningi personalne / mies.', 'Analiza składu ciała', 'Sauna bez limitu', 'Wejście z osobą towarzyszącą 1×/mies.'], no: [] }];
  let per = 'm';
  const price = p => { let v = p.m; if (per === 'y') v *= .8; if ($('#student').checked) v *= .85; return v; };
  const renderPlans = () => { $('#plans').innerHTML = plans.map(p => `<article class="plan${p.hot ? ' hot' : ''}">${p.hot ? '<span class="badge">Najczęściej wybierany</span>' : ''}<h3>${p.n}</h3><p class="muted">${p.d}</p><p class="pr"><b data-v="${Math.round(price(p))}">${Math.round(price(p))}</b><span> zł / mies.*</span></p><p class="small muted">${per === 'y' ? `płatne rocznie: ${zl(price(p) * 12)}` : 'bez umowy, odnawiany co miesiąc'}</p><ul>${p.f.map(x => `<li>${x}</li>`).join('')}${p.no.map(x => `<li class="no">${x}</li>`).join('')}</ul><a href="#probny" class="btn${p.hot ? '' : ' ghost'}" data-plan="${p.n}">Wybieram ${p.n}</a></article>`).join(''); };
  $$('[data-per]').forEach(b => b.onclick = () => { per = b.dataset.per; $$('[data-per]').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); }); renderPlans(); });
  $('#student').onchange = renderPlans; renderPlans();
  const rows = [['Siłownia i cardio', 'do 15:00', '✓', '✓'], ['Zajęcia grupowe', '–', '✓', '✓'], ['Sauna', '–', '2× / mies.', 'bez limitu'], ['Trening personalny', '–', '–', '2× / mies.'], ['Analiza składu ciała', '–', '1× na start', 'co miesiąc'], ['Zamrożenie karnetu', '14 dni', '30 dni', '45 dni']];
  $('#cmpT').innerHTML = `<thead><tr><th scope="col">Funkcja</th>${plans.map(p => `<th scope="col">${p.n}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr><th scope="row">${r[0]}</th>${r.slice(1).map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>`;
  document.addEventListener('click', e => { const p = e.target.closest('[data-plan]'); if (p) Kit.store.set('hb-plan', p.dataset.plan); });

  /* ---------- calculator ---------- */
  let sex = 'k', goal = 0;
  const calc = () => { const a = +$('#age').value, h = +$('#h').value, w = +$('#w').value, act = +$('#act').value;
    $('#vAge').textContent = a + ' lat'; $('#vH').textContent = h + ' cm'; $('#vW').textContent = w + ' kg';
    const bmi = w / Math.pow(h / 100, 2); $('#bmi').textContent = bmi.toFixed(1).replace('.', ',');
    const cat = bmi < 18.5 ? ['Niedowaga', '#3aa0ff'] : bmi < 25 ? ['Waga prawidłowa', '#2ecc71'] : bmi < 30 ? ['Nadwaga', '#ffb020'] : ['Otyłość', '#ff4d1a'];
    $('#bmiCat').textContent = cat[0]; $('#bmiCat').style.background = cat[1];
    $('#bmiPin').style.left = Math.max(0, Math.min(100, (bmi - 15) / 25 * 100)) + '%';
    const bmr = 10 * w + 6.25 * h - 5 * a + (sex === 'm' ? 5 : -161), kc = bmr * act + goal;
    $('#bmr').textContent = Math.round(bmr).toLocaleString('pl-PL'); $('#kcal').textContent = Math.round(kc).toLocaleString('pl-PL');
    const p = Math.round(w * (goal < 0 ? 2 : 1.8)), f = Math.round(kc * .27 / 9), c = Math.max(0, Math.round((kc - p * 4 - f * 9) / 4));
    const tot = p * 4 + f * 9 + c * 4;
    $('#macro').innerHTML = [['Białko', p, p * 4, 'var(--acc)'], ['Tłuszcze', f, f * 9, '#ffb020'], ['Węglowodany', c, c * 4, 'var(--ink)']].map(([n, g, k, col]) => `<div><span>${n}</span><b>${g} g</b><i style="--w:${k / tot * 100}%;--c:${col}"></i></div>`).join(''); };
  $$('#calcF input, #calcF select').forEach(i => i.addEventListener('input', calc));
  $$('.sex [data-sex]').forEach(b => b.onclick = () => { sex = b.dataset.sex; $$('.sex button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); }); calc(); });
  $$('.goal [data-goal]').forEach(b => b.onclick = () => { goal = +b.dataset.goal; $$('.goal button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); }); calc(); });
  calc();

  /* ---------- trainers ---------- */
  const tr = [
    { n: 'Tomasz Mazur', r: 'Trener siłowy', img: 'tr1', tags: ['Trójbój', 'Technika bojów', 'Początkujący'], y: 11, q: 'Siła to umiejętność. Pokażę Ci, jak się jej nauczyć.', slots: ['Pn 7:00', 'Śr 17:00', 'Pt 8:00'] },
    { n: 'Kasia Nowik', r: 'Trenerka przygotowania motorycznego', img: 'tr2', tags: ['Kettlebell', 'HIIT', 'Redukcja'], y: 7, q: 'Najlepszy trening to ten, na który chcesz wrócić.', slots: ['Wt 18:00', 'Cz 7:30', 'So 10:00'] },
    { n: 'Ewa Lis', r: 'Joga, pilates, mobilność', img: 'tr3', tags: ['Kręgosłup', 'Reformer', '50+'], y: 15, q: 'Ruch ma leczyć, nie męczyć.', slots: ['Pn 10:00', 'Śr 9:00', 'Pt 18:30'] }];
  $('#trainers').innerHTML = tr.map((t, i) => `<article class="tr" data-reveal style="--d:${i * .1}s"><button type="button" class="tr-card" aria-expanded="false" aria-label="${t.n} – pokaż szczegóły"><span class="tr-front"><img src="img/${t.img}-640.webp" srcset="img/${t.img}-640.webp 640w, img/${t.img}.webp 1024w" sizes="(max-width:800px) 100vw, 33vw" alt="${t.n}, ${t.r.toLowerCase()} (postać fikcyjna)" loading="lazy"><span class="tr-cap"><b>${t.n}</b><small>${t.r}</small></span><span class="tr-more">+</span></span><span class="tr-back"><span class="tr-y"><b>${t.y}</b> lat doświadczenia</span><q>${t.q}</q><span class="tags">${t.tags.map(x => `<i>${x}</i>`).join('')}</span><span class="tr-sl">Wolne terminy (przykładowe): ${t.slots.join(' · ')}</span><span class="small">postać fikcyjna</span></span></button></article>`).join('');
  $$('.tr-card').forEach(b => b.onclick = () => { const o = b.getAttribute('aria-expanded') === 'true'; b.setAttribute('aria-expanded', !o); b.parentElement.classList.toggle('flip', !o); });
  $$('#trainers [data-reveal]').forEach(el => new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { el.classList.add('in'); o.disconnect(); } })).observe(el));

  /* ---------- zones scroller ---------- */
  const z = $('#zones'); const zb = () => { $('#zbar').style.width = (z.scrollLeft / (z.scrollWidth - z.clientWidth) * 80 + 20) + '%'; };
  z.addEventListener('scroll', zb, { passive: true }); zb();
  $$('[data-z]').forEach(b => b.onclick = () => z.scrollBy({ left: +b.dataset.z * z.clientWidth * .7, behavior: 'smooth' }));
  let dn = false, sx = 0, sl = 0, moved = false;
  z.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; dn = true; moved = false; sx = e.clientX; sl = z.scrollLeft; z.classList.add('drag'); });
  addEventListener('pointermove', e => { if (!dn) return; const d = e.clientX - sx; if (Math.abs(d) > 5) moved = true; z.scrollLeft = sl - d; });
  addEventListener('pointerup', () => { dn = false; z.classList.remove('drag'); });
  z.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

  /* ---------- peak hours ---------- */
  let pd = (new Date().getDay() + 6) % 7;
  $('#pDays').innerHTML = DN.map((d, i) => `<button type="button" data-p="${i}" class="${i === pd ? 'on' : ''}" aria-pressed="${i === pd}">${d}</button>`).join('');
  const renderBars = () => { const hrs = []; for (let h = 6; h < 23; h++) hrs.push([h, Math.min(98, Math.round(curve[h] * wkMul[pd]))]);
    const nowH = new Date().getHours(), today = pd === (new Date().getDay() + 6) % 7;
    $('#bars').innerHTML = hrs.map(([h, v]) => `<button type="button" class="bar${today && h === nowH ? ' now' : ''}" style="--v:${v}%" data-h="${h}" data-v="${v}" aria-label="${h}:00 – obłożenie ${v}%"><i></i><small>${h % 3 === 0 ? h : ''}</small></button>`).join('');
    const best = hrs.filter(x => x[0] >= 7 && x[0] <= 21).sort((a, b) => a[1] - b[1])[0];
    $('#peakTip').innerHTML = `Najluźniej (${DL[pd].toLowerCase()}): <b>${best[0]}:00–${best[0] + 1}:00</b>, ok. ${best[1]}% obłożenia.`; };
  $('#pDays').addEventListener('click', e => { const b = e.target.closest('[data-p]'); if (!b) return; pd = +b.dataset.p; $$('#pDays button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); renderBars(); });
  $('#bars').addEventListener('pointerover', e => { const b = e.target.closest('.bar'); if (b) $('#peakTip').innerHTML = `${DL[pd]}, <b>${b.dataset.h}:00</b> – średnio ${b.dataset.v}% obłożenia${b.dataset.v > 70 ? ' (tłoczno)' : b.dataset.v < 35 ? ' (luźno)' : ''}.`; });
  $('#bars').addEventListener('focusin', e => { const b = e.target.closest('.bar'); if (b) $('#peakTip').innerHTML = `${DL[pd]}, <b>${b.dataset.h}:00</b> – średnio ${b.dataset.v}% obłożenia.`; });
  renderBars();

  /* ---------- trial booking ---------- */
  const bk = Kit.booking($('#bk'), {
    hours: d => { const w = d.getDay(); return w === 0 ? [9, 14] : w === 6 ? [9, 16] : [7, 21]; }, step: 60, duration: () => 60,
    busy: (d, t) => ((d.getDate() * 7 + t / 60) % 5) === 0,
    check: (s, st) => { if (s === 1 && (!st.date || !st.time)) return 'Wybierz dzień i godzinę treningu.'; if (s === 2 && !Kit.validate($('#bkForm'))) return 'Uzupełnij wymagane pola.'; },
    onChange: st => { $('#slotHint').textContent = st.date ? st.date.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' }) + (st.time ? ' · ' + st.time : '') : 'Wybierz dzień w kalendarzu'; },
    onStep: (n, st) => { if (n === 3) { const f = $('#bkForm'), g = $('input[name=g]:checked').value, plan = store.get('hb-plan');
      $('#bkSum').innerHTML = `<dt>Cel</dt><dd>${g} · ${$('#lvl').value}</dd><dt>Termin</dt><dd>${st.date.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}, ${st.time}</dd><dt>Trener</dt><dd>${g === 'Zdrowie' ? 'Ewa Lis' : g === 'Siła' ? 'Tomasz Mazur' : 'Kasia Nowik'} (fikcyjny)</dd><dt>Imię</dt><dd>${f.n.value.replace(/</g, '')}</dd>${plan ? `<dt>Interesuje Cię</dt><dd>karnet ${plan}</dd>` : ''}`; } } });
  $('#bkAgain').onclick = () => { $('#bkForm').reset(); bk.st.date = null; bk.st.time = null; bk.render(); $('.slots').innerHTML = ''; bk.go(0); };
})();
/* burger label */
(() => { const b = document.querySelector('.burger .bt'); new MutationObserver(() => { b.textContent = document.body.classList.contains('menu-open') ? 'ZAMKNIJ' : 'MENU'; }).observe(document.body, { attributes: true, attributeFilter: ['class'] }); })();
