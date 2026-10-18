(() => {
  const { $, $$ } = Kit;
  $('#yr').textContent = new Date().getFullYear();
  /* hours */
  const H = { 0: [9, 20], 1: null, 2: [11, 21], 3: [11, 21], 4: [11, 21], 5: [11, 23], 6: [9, 23] };
  const DN = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
  const now = new Date(), d = now.getDay(), h = now.getHours() + now.getMinutes() / 60;
  const open = H[d] && h >= H[d][0] && h < H[d][1], oe = $('#openNow');
  oe.classList.add(open ? 'open' : 'closed'); oe.textContent = open ? 'Otwarte teraz' : 'Teraz zamknięte';
  $('#openHours').textContent = H[d] ? `Dziś ${H[d][0]}:00–${H[d][1]}:00` : 'Dziś nieczynne';
  $('#mOpen').classList.add(open ? 'open' : 'closed'); $('#mOpen').textContent = open ? 'Otwarte teraz' : 'Teraz zamknięte'; $('#mHours').textContent = $('#openHours').textContent;
  $('#hoursList').innerHTML = [1, 2, 3, 4, 5, 6, 0].map(k => `<li class="${k === d ? 'today' : ''}"><span>${DN[k]}${k === d ? ' · dziś' : ''}</span><span>${H[k] ? H[k][0] + ':00 – ' + H[k][1] + ':00' : 'nieczynne'}</span></li>`).join('');
  /* menu data */
  const A = { 1: 'gluten', 3: 'jaja', 7: 'mleko', 8: 'orzechy', 9: 'seler', 10: 'gorczyca', 12: 'siarczyny' };
  const M = [
    { c: 'Śniadania', n: 'Jajecznica na maśle', d: 'Trzy jaja od szczęśliwych kur, szczypiorek, chleb na zakwasie', p: 26, a: [1, 3, 7], v: 1 },
    { c: 'Śniadania', n: 'Tosty na zakwasie', d: 'Awokado, jajko w koszulce, rzodkiewka, kiełki', p: 32, a: [1, 3], v: 1, img: 'bread' },
    { c: 'Śniadania', n: 'Owsianka sezonowa', d: 'Owoce z sezonu, prażone orzechy, miód gryczany', p: 22, a: [7, 8], v: 1, gf: 1 },
    { c: 'Przystawki', n: 'Chleb i masło', d: 'Pieczywo z naszego pieca, masło solone, smalec z jabłkiem', p: 16, a: [1, 7], img: 'bread' },
    { c: 'Przystawki', n: 'Tatar z polędwicy', d: 'Marynowane grzyby, żółtko, ogórek kiszony, grzanka', p: 46, a: [1, 3, 10] },
    { c: 'Zupy', n: 'Krem z dyni', d: 'Prażone pestki, olej dyniowy, grzanka na zakwasie', p: 24, a: [7, 9], v: 1, img: 'soup' },
    { c: 'Zupy', n: 'Żurek na zakwasie', d: 'Biała kiełbasa, jajko, chrzan', p: 26, a: [1, 3, 9, 10] },
    { c: 'Dania główne', n: 'Pierogi ruskie', d: '8 sztuk lepionych ręcznie, chrupiąca cebulka, śmietana', p: 34, a: [1, 3, 7], v: 1, img: 'pierogi' },
    { c: 'Dania główne', n: 'Kotlet schabowy', d: 'Młode ziemniaki z koperkiem, mizeria', p: 46, a: [1, 3, 7], img: 'schabowy' },
    { c: 'Dania główne', n: 'Risotto z grzybami leśnymi', d: 'Parmezan, tymianek, masło szałwiowe', p: 48, a: [7, 9, 12], v: 1, gf: 1, img: 'risotto' },
    { c: 'Dania główne', n: 'Pstrąg z masłem', d: 'Kasza pęczak, burak pieczony, chrzan', p: 54, a: [7], gf: 1 },
    { c: 'Desery', n: 'Sernik baskijski', d: 'Sos z owoców leśnych, kawa przelewowa w zestawie +8 zł', p: 24, a: [3, 7], v: 1, gf: 1, img: 'cheesecake' },
    { c: 'Desery', n: 'Szarlotka na ciepło', d: 'Gałka lodów waniliowych, kruszonka', p: 22, a: [1, 3, 7], v: 1 },
    { c: 'Napoje', n: 'Kawa przelewowa', d: 'Ziarno z lokalnej palarni, zmienne origin', p: 15, a: [], v: 1, gf: 1, img: 'coffee' },
    { c: 'Napoje', n: 'Lemoniada domowa', d: 'Cytryna, mięta, miód lipowy', p: 16, a: [], v: 1, gf: 1 },
    { c: 'Napoje', n: 'Wino na kieliszki', d: 'Zapytaj o aktualne butelki (karta win obok)', p: 22, a: [12], v: 1, gf: 1, img: 'wine' }];
  const W = {
    'Pierogi ruskie': { w: 'Riesling wytrawny', t: 'białe · rześkie', r: 'Kwasowość przecina tłustość cebulki i śmietany.', b: [30, 80, 20], temp: '8–10°C' },
    'Kotlet schabowy': { w: 'Pinot Noir', t: 'czerwone · lekkie', r: 'Owocowe, delikatne taniny nie przytłoczą panierki.', b: [55, 60, 35], temp: '14–16°C' },
    'Risotto z grzybami leśnymi': { w: 'Chardonnay z beczki', t: 'białe · pełne', r: 'Kremowa tekstura i nuty masła podbijają grzyby.', b: [70, 45, 15], temp: '10–12°C' },
    'Pstrąg z masłem': { w: 'Sauvignon Blanc', t: 'białe · ziołowe', r: 'Ziołowa świeżość podkreśla rybę i chrzan.', b: [25, 85, 10], temp: '8–10°C' },
    'Tatar z polędwicy': { w: 'Gamay', t: 'czerwone · owocowe', r: 'Soczyste, lekko schłodzone, świetne do surowego mięsa.', b: [40, 65, 30], temp: '12–14°C' },
    'Sernik baskijski': { w: 'Tokaji Late Harvest', t: 'słodkie · deserowe', r: 'Miód i morela grają z karmelizowanym wierzchem.', b: [85, 60, 5], temp: '8–10°C' } };
  const cats = ['Wszystko', ...new Set(M.map(x => x.c))]; let cat = 'Wszystko';
  $('#cats').innerHTML = cats.map((c, i) => `<button role="tab" aria-selected="${i === 0}">${c}</button>`).join('');
  $('#legend').innerHTML = 'Alergeny: ' + Object.entries(A).map(([k, v]) => `<span class="ic">${k}</span> ${v}`).join(' · ') + ' &nbsp; <span class="ic v">V</span> wege &nbsp; <span class="ic gf">GF</span> bez glutenu';
  const icons = x => `<span class="icons">${x.v ? '<span class="ic v" title="wegetariańskie">V</span>' : ''}${x.gf ? '<span class="ic gf" title="bez glutenu">GF</span>' : ''}</span>`;
  const renderMenu = () => { const f = $$('.diet input:checked').map(i => i.value), q = $('#q').value.toLowerCase().trim();
    const list = M.filter(x => (cat === 'Wszystko' || x.c === cat) && f.every(k => x[k]) && (!q || (x.n + x.d).toLowerCase().includes(q)));
    $('#menuList').innerHTML = list.map((x, i) => `<li style="--d:${i * 40}ms"><button class="dish" data-i="${M.indexOf(x)}"><span class="th${x.img ? '' : ' no'}">${x.img ? `<img src="img/${x.img}-640.webp" alt="" loading="lazy">` : x.n[0]}</span><span><h3>${x.n}${icons(x)}</h3><p>${x.d}</p></span><span class="pr">${x.p} zł</span></button></li>`).join('') || '<li class="empty">Brak dań spełniających kryteria. Spróbuj zmienić filtry.</li>'; };
  $('#cats').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('#cats button').forEach(x => x.setAttribute('aria-selected', x === b)); cat = b.textContent; renderMenu(); });
  $$('.diet input').forEach(i => i.addEventListener('input', renderMenu)); renderMenu();
  const dishModal = x => Kit.modal(`<div class="dm">${x.img ? `<figure><img src="img/${x.img}.webp" alt="${x.n}"></figure>` : ''}<div class="b" style="${x.img ? '' : 'grid-column:1/-1'}"><p class="eyebrow">${x.c}</p><h3>${x.n}</h3><div class="pr">${x.p} zł <small style="font-size:.8rem;color:var(--mut)">(przykład)</small></div><p class="muted">${x.d}.</p>
    <h4>Alergeny</h4><div class="al">${x.a.length ? x.a.map(k => `<span>${k} · ${A[k]}</span>`).join('') : '<span>brak głównych alergenów</span>'}${x.v ? '<span>wegetariańskie</span>' : ''}${x.gf ? '<span>bez glutenu</span>' : ''}</div>
    ${W[x.n] ? `<h4>Polecane wino</h4><p><b>${W[x.n].w}</b> · ${W[x.n].t}<br><span class="muted">${W[x.n].r}</span></p>` : ''}<p style="margin-top:26px"><a href="#rezerwacja" class="btn" onclick="document.querySelector('.modal').classList.remove('open');document.body.classList.remove('noscroll')">Zarezerwuj stolik</a></p></div></div>`);
  document.addEventListener('click', e => { const b = e.target.closest('.dish,.spec'); if (b) dishModal(M[+b.dataset.i]); });
  /* daily specials (rotate by weekday) */
  const withImg = M.filter(x => x.img && x.c !== 'Napoje'); const off = d % withImg.length;
  const sp = [0, 1, 2].map(k => withImg[(off + k) % withImg.length]);
  $('#todayLabel').textContent = `${DN[d]}, ${now.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}. Zestaw zmienia się codziennie (demo).`;
  $('#specials').innerHTML = sp.map((x, k) => `<button class="spec" data-i="${M.indexOf(x)}"><figure><img src="img/${x.img}.webp" srcset="img/${x.img}-640.webp 640w, img/${x.img}.webp 1024w" sizes="(max-width:900px) 100vw, 33vw" alt="${x.n}" loading="lazy"><span class="day">${['Polecane', 'Szef kuchni poleca', 'Na słodko'][k]}</span></figure><h3>${x.n}<span>${x.p} zł</span></h3><p>${x.d}</p></button>`).join('');
  /* wine pairing */
  const pk = $('#pairPick'), pc = $('#pairCard'), names = Object.keys(W);
  pk.innerHTML = names.map((n, i) => `<button role="radio" aria-checked="${i === 0}">${n}</button>`).join('');
  const pair = n => { const x = W[n]; pc.classList.remove('flip'); void pc.offsetWidth; pc.classList.add('flip');
    setTimeout(() => { pc.innerHTML = `<p class="g">Do dania: ${n}</p><h3>${x.w}</h3><p style="color:#5f6a63">${x.r}</p><div class="meta"><div>Styl<b>${x.t}</b></div><div>Podawać<b>${x.temp}</b></div><div>Kieliszek<b>od 22 zł*</b></div></div><div class="bars"><div>Słodycz/ciało<i style="--v:${x.b[0]}%"></i></div><div>Kwasowość<i style="--v:${x.b[1]}%"></i></div><div>Taniny<i style="--v:${x.b[2]}%"></i></div></div><p style="font-size:.75rem;color:#8a8f88;margin-top:16px">* ceny i wina przykładowe</p>`; }, 300); };
  pk.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('button', pk).forEach(x => x.setAttribute('aria-checked', x === b)); pair(b.textContent); }); pair(names[0]);
  /* gallery */
  const G = [['hero', 'Sala wieczorem'], ['pierogi', 'Pierogi ruskie'], ['wine', 'Wino do kolacji'], ['soup', 'Krem z dyni'], ['event', 'Stół na przyjęcie'], ['risotto', 'Risotto z grzybami'], ['coffee', 'Kawa przelewowa'], ['cheesecake', 'Sernik baskijski'], ['bread', 'Chleb na zakwasie'], ['schabowy', 'Kotlet schabowy']];
  $('#gal').innerHTML = G.map(([f, c]) => `<a href="img/${f}.webp" data-lightbox="g" data-caption="${c}"><img src="img/${f}-640.webp" alt="${c}" loading="lazy" width="640" height="360"><span>${c}</span></a>`).join('');
  $('#insta').innerHTML = ['pierogi', 'coffee', 'bread', 'wine', 'cheesecake', 'soup'].map(f => `<a href="img/${f}.webp" data-lightbox="ig" data-caption="Instagram (przykład)"><img src="img/${f}-640.webp" alt="Zdjęcie z przykładowego Instagrama" loading="lazy"></a>`).join('');
  /* voucher */
  const vA = $('#vAmt'), vT = $('#vTo'), vc = $('#voucherCard');
  const upd = () => { vA.textContent = $('#giftAmt input:checked').value + ' zł'; vT.textContent = $('#giftTo').value.trim() || 'Dla Ciebie'; vc.classList.remove('v-pop'); void vc.offsetWidth; vc.classList.add('v-pop'); };
  $$('#giftAmt input').forEach(i => i.addEventListener('change', upd)); $('#giftTo').addEventListener('input', upd);
  $('#giftBtn').onclick = () => Kit.toast(`Voucher ${vA.textContent} przygotowany (demo, nic nie zostało zamówione).`);
  /* booking */
  let guests = 2; const go = $('#guests');
  $('#gMinus').onclick = () => { guests = Math.max(1, guests - 1); go.textContent = guests; }; $('#gPlus').onclick = () => { guests = Math.min(12, guests + 1); go.textContent = guests; };
  const bk = Kit.booking($('#bk'), {
    hours: dt => H[dt.getDay()] && [H[dt.getDay()][0], H[dt.getDay()][1] - 1.5],
    busy: (dt, t) => (dt.getDate() * 13 + t / 30 * 7) % 6 === 0, duration: () => 30,
    onChange: st => { $('#slotHint').textContent = st.date ? st.date.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' }) + ' – wybierz godzinę:' : 'Najpierw wybierz dzień.'; },
    check: (s, st) => { if (s === 1 && (!st.date || !st.time)) return 'Wybierz dzień i godzinę.'; if (s === 2 && !Kit.validate($('#bkForm'))) return 'Uzupełnij wymagane pola.'; },
    onStep: (s, st) => { if (s === 3) { const f = $('#bkForm');
      $('#bkSum').innerHTML = `<dt>Gość</dt><dd>${f.n.value}</dd><dt>Termin</dt><dd>${st.date.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}, ${st.time}</dd><dt>Liczba osób</dt><dd>${guests}</dd><dt>Okazja</dt><dd>${$('#occasion input:checked').value}</dd><dt>Strefa</dt><dd>${$('#zone input:checked').value}</dd>`; } } });
  $('#bkAgain').onclick = () => { $('#bkForm').reset(); bk.st.date = null; bk.st.time = null; bk.render(); $('.slots').innerHTML = ''; bk.go(0); };
})();
