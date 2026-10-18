(() => {
  const { $, $$ } = Kit;
  $('#yr').textContent = new Date().getFullYear();
  const H = { 0: null, 1: [9, 20], 2: [9, 20], 3: [9, 20], 4: [9, 20], 5: [9, 20], 6: [9, 15] };
  const DN = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'], d = new Date().getDay();
  $('#hoursList').innerHTML = [1, 2, 3, 4, 5, 6, 0].map(k => `<li class="${k === d ? 'today' : ''}"><span>${DN[k]}${k === d ? ' · dziś' : ''}</span><span>${H[k] ? H[k][0] + ':00 – ' + H[k][1] + ':00' : 'nieczynne'}</span></li>`).join('');
  /* services: p/t = [short, medium, long] */
  const COL = ['#b0644f', '#d39a7f', '#8a6a5c', '#e3c3b2', '#5d4740', '#c98a6e'];
  const S = [
    { id: 'k1', c: 'Strzyżenie', img: 'bob', n: 'Strzyżenie damskie', s: 'z myciem i stylizacją', p: [110, 130, 150], t: [45, 60, 75] },
    { id: 'k2', c: 'Strzyżenie', img: 'bob', n: 'Grzywka / odświeżenie', s: 'między wizytami', p: [40, 40, 40], t: [15, 15, 15] },
    { id: 'k3', c: 'Strzyżenie', img: 'men', n: 'Strzyżenie męskie / fade', s: 'maszynka i nożyczki', p: [80, 80, 90], t: [40, 40, 45] },
    { id: 'k4', c: 'Strzyżenie', img: 'men', n: 'Strzyżenie dziecięce', s: 'do 12 lat', p: [60, 60, 70], t: [30, 30, 30] },
    { id: 'c1', c: 'Koloryzacja', img: 'color', n: 'Koloryzacja jednolita', s: 'odrost lub całość', p: [190, 240, 290], t: [90, 105, 120] },
    { id: 'c2', c: 'Koloryzacja', img: 'balayage', n: 'Balayage / sombre', s: 'z tonowaniem', p: [380, 460, 560], t: [150, 180, 210] },
    { id: 'c3', c: 'Koloryzacja', img: 'color', n: 'Tonowanie / gloss', s: 'połysk i neutralizacja', p: [110, 130, 150], t: [30, 30, 40] },
    { id: 'p1', c: 'Pielęgnacja i stylizacja', img: 'updo', n: 'Rytuał regenerujący', s: 'odbudowa keratynowa', p: [120, 140, 160], t: [30, 40, 45] },
    { id: 'p2', c: 'Pielęgnacja i stylizacja', img: 'updo', n: 'Upięcie okolicznościowe', s: 'wesele, studniówka', p: [180, 200, 240], t: [60, 60, 75] },
    { id: 'p3', c: 'Pielęgnacja i stylizacja', img: 'updo', n: 'Modelowanie / fale', s: 'na specjalne wyjście', p: [70, 90, 110], t: [30, 40, 50] }];
  const len = () => +$('#hairLen input:checked').value;
  const sel = new Set(['k1']);
  const cats = [...new Set(S.map(x => x.c))];
  $('#svcList').innerHTML = cats.map(c => { const f = S.find(x => x.c === c);
    return `<div class="svc-cat" data-reveal><h3><img src="img/${f.img}-640.webp" alt="" loading="lazy">${c}</h3>${S.filter(x => x.c === c).map(x => `<label class="svc"><input type="checkbox" value="${x.id}"><span><b>${x.n}</b><small>${x.s}</small></span><span class="t" data-t="${x.id}"></span><span class="p" data-p="${x.id}"></span></label>`).join('')}</div>`; }).join('');
  const fmt = m => m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ' ' + m % 60 + ' min' : ''}` : `${m} min`;
  const tot = () => { const l = len(); let p = 0, t = 0; S.forEach(x => { if (sel.has(x.id)) { p += x.p[l]; t += x.t[l]; } }); return { p, t }; };
  const sync = () => { const l = len();
    S.forEach(x => { $(`[data-t="${x.id}"]`).textContent = fmt(x.t[l]); $(`[data-p="${x.id}"]`).textContent = x.p[l] + ' zł'; });
    $$('#svcList input, #bkSvc input').forEach(i => i.checked = sel.has(i.value));
    const list = S.filter(x => sel.has(x.id)), T = tot();
    $('#calcList').innerHTML = list.map((x, i) => `<li><span><i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${COL[i % 6]};margin-right:8px"></i>${x.n}</span><span>${x.p[l]} zł</span></li>`).join('') || '<li class="muted">Zaznacz usługi z listy.</li>';
    $('#calcTl').innerHTML = list.map((x, i) => `<i style="flex:${x.t[l]};background:${COL[i % 6]}" title="${x.n}"></i>`).join('');
    $('#calcTime').textContent = fmt(T.t); $('#calcPrice').textContent = T.p + ' zł';
    $('#bkTotT').textContent = list.length ? `${list.length} usł. · ${fmt(T.t)}` : 'Wybierz usługi'; $('#bkTotP').textContent = T.p + ' zł*';
    if (bk && bk.st.date) { bk.st.time = null; bk.slots(); } };
  $('#bkSvc').innerHTML = S.map(x => `<label class="svc"><input type="checkbox" value="${x.id}"><span><b>${x.n}</b><small>${x.c}</small></span><span class="t" data-t2="${x.id}"></span></label>`).join('');
  document.addEventListener('change', e => { const i = e.target; if (i.matches('.svc input')) { i.checked ? sel.add(i.value) : sel.delete(i.value); sync(); syncT2(); } if (i.matches('#hairLen input')) { sync(); syncT2(); } });
  const syncT2 = () => S.forEach(x => $(`[data-t2="${x.id}"]`).textContent = fmt(x.t[len()]));
  /* before/after */
  const ba = $('#ba'), r = $('input', ba); r.addEventListener('input', () => ba.style.setProperty('--p', r.value + '%'));
  /* stylists */
  const ST = [
    { id: 'a', n: 'Kaja Nowicka', img: 'team1', r: 'Właścicielka · koloryzacja', tags: ['balayage', 'blond', 'korekta koloru'], sl: 3 },
    { id: 'b', n: 'Iga Wrona', img: 'team3', r: 'Stylistka · cięcia', tags: ['bob', 'pixie', 'grzywki'], sl: 2 },
    { id: 'c', n: 'Tomek Lis', img: 'team2', r: 'Barber · męskie', tags: ['fade', 'broda', 'dzieci'], sl: 4 }];
  $('#stylists').innerHTML = ST.map(x => `<button class="sty" data-s="${x.id}" aria-pressed="false"><figure><img src="img/${x.img}-640.webp" alt="${x.n} – zdjęcie poglądowe" loading="lazy"></figure><div class="b"><p class="role">${x.r}</p><h3>${x.n}</h3><p class="muted" style="font-size:.8rem">postać fikcyjna</p><div class="tags">${x.tags.map(t => `<span>${t}</span>`).join('')}</div><span class="pick">Wybierz do rezerwacji</span></div></button>`).join('');
  $('#miniSty').innerHTML = `<label><input type="radio" name="sty" value="" checked><span class="any">✦</span>Dowolna</label>` + ST.map(x => `<label><input type="radio" name="sty" value="${x.id}"><img src="img/${x.img}-640.webp" alt="">${x.n.split(' ')[0]}</label>`).join('');
  const setSty = id => { $$('.sty').forEach(b => b.setAttribute('aria-pressed', b.dataset.s === id)); const i = $(`#miniSty input[value="${id}"]`); if (i) i.checked = true; if (bk && bk.st.date) { bk.st.time = null; bk.slots(); } };
  $('#stylists').addEventListener('click', e => { const b = e.target.closest('.sty'); if (!b) return; setSty(b.dataset.s); Kit.toast(`Wybrano: ${ST.find(x => x.id === b.dataset.s).n}. Przejdź do rezerwacji.`); });
  $('#miniSty').addEventListener('change', e => setSty(e.target.value));
  $('#calcBook').onclick = () => document.getElementById('rezerwacja').scrollIntoView({ behavior: 'smooth' });
  /* gallery + insta */
  const G = [['balayage', 'Balayage karmelowy'], ['bob', 'Bob do żuchwy'], ['hero', 'Wnętrze salonu'], ['men', 'Fade męski'], ['updo', 'Upięcie ślubne'], ['color', 'Koloryzacja miedziana'], ['after', 'Metamorfoza: po'], ['tools', 'Narzędzia'], ['wash', 'Rytuał myjący']];
  $('#gal').innerHTML = G.map(([f, c]) => `<a href="img/${f}.webp" data-lightbox="g" data-caption="${c}"><img src="img/${f}-640.webp" alt="${c}" loading="lazy" width="640" height="360"><span>${c}</span></a>`).join('');
  $('#insta').innerHTML = ['balayage', 'men', 'updo', 'bob', 'color', 'tools'].map(f => `<a href="img/${f}.webp" data-lightbox="ig" data-caption="Instagram (przykład)"><img src="img/${f}-640.webp" alt="Zdjęcie z przykładowego Instagrama" loading="lazy"></a>`).join('');
  /* voucher */
  const vA = $('#vAmt'), vT = $('#vTo'), vc = $('#voucherCard');
  const upd = () => { vA.textContent = $('#giftAmt input:checked').value + ' zł'; vT.textContent = $('#giftTo').value.trim() || 'Dla Ciebie'; vc.classList.remove('v-pop'); void vc.offsetWidth; vc.classList.add('v-pop'); };
  $$('#giftAmt input').forEach(i => i.addEventListener('change', upd)); $('#giftTo').addEventListener('input', upd);
  $('#giftBtn').onclick = () => Kit.toast(`Voucher ${vA.textContent} przygotowany (demo, nic nie zostało zamówione).`);
  /* booking */
  const styId = () => $('#miniSty input:checked').value;
  let bk = null;
  bk = Kit.booking($('#bk'), {
    hours: dt => H[dt.getDay()], step: 15, duration: () => Math.max(30, tot().t),
    busy: (dt, t) => { const s = styId() ? ST.find(x => x.id === styId()).sl : 5; return (dt.getDate() * 7 + t / 15 * s) % 5 === 0 || (t >= 13 * 60 && t < 13.5 * 60); },
    onChange: st => { $('#slotHint').textContent = st.date ? st.date.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' }) + ` – start wizyty (${fmt(Math.max(30, tot().t))}):` : 'Najpierw wybierz dzień.'; },
    check: (s, st) => { if (s === 0 && !sel.size) return 'Wybierz przynajmniej jedną usługę.'; if (s === 1 && (!st.date || !st.time)) return 'Wybierz dzień i godzinę.'; if (s === 2 && !Kit.validate($('#bkForm'))) return 'Uzupełnij wymagane pola.'; },
    onStep: (s, st) => { if (s === 1) bk && bk.st.date && bk.slots(); if (s === 3) { const f = $('#bkForm'), T = tot(), sid = styId(), [h, m] = st.time.split(':').map(Number), end = h * 60 + m + T.t;
      $('#bkSum').innerHTML = `<dt>Klient/ka</dt><dd>${f.n.value}</dd><dt>Termin</dt><dd>${st.date.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}, ${st.time}–${Math.floor(end / 60)}:${String(end % 60).padStart(2, '0')}</dd><dt>Usługi</dt><dd>${S.filter(x => sel.has(x.id)).map(x => x.n).join(', ')}</dd><dt>Stylistka</dt><dd>${sid ? ST.find(x => x.id === sid).n : 'dowolna'}</dd><dt>Szacowany koszt</dt><dd>${T.p} zł (przykład)</dd>`; } } });
  $('#bkAgain').onclick = () => { $('#bkForm').reset(); bk.st.date = null; bk.st.time = null; bk.render(); $('.slots').innerHTML = ''; bk.go(0); };
  sync(); syncT2();
})();
