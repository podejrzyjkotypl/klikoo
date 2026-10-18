/* Klikoo demo kit – shared UI behaviours (vanilla JS, no deps) */
(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const store = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.Kit = { $, $$, store };

  /* theme */
  const root = document.documentElement, saved = store.get('theme');
  if (saved) root.dataset.theme = saved;
  $$('[data-theme-toggle]').forEach(b => b.addEventListener('click', () => {
    const cur = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    root.dataset.theme = cur === 'dark' ? 'light' : 'dark'; store.set('theme', root.dataset.theme);
  }));

  /* nav */
  const nav = $('.nav'), burger = $('.burger'), menu = $('.menu-panel');
  const onScroll = () => { nav && nav.classList.toggle('scrolled', scrollY > 40); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (burger) burger.addEventListener('click', () => { const o = document.body.classList.toggle('menu-open'); burger.setAttribute('aria-expanded', o); });
  const secs = $$('section[id]');
  const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) $$('.nav a[href^="#"]').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => spy.observe(s));

  /* page transition curtain for in-page "pages" */
  const curtain = document.createElement('div'); curtain.className = 'curtain'; curtain.setAttribute('aria-hidden', 'true'); document.body.appendChild(curtain);
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return; const t = $(id); if (!t) return; e.preventDefault();
    document.body.classList.remove('menu-open'); burger && burger.setAttribute('aria-expanded', false);
    if (reduce || a.dataset.noCurtain !== undefined) { t.scrollIntoView(); return; }
    curtain.classList.add('in');
    setTimeout(() => { t.scrollIntoView({ behavior: 'instant' }); history.replaceState(null, '', id); curtain.classList.replace('in', 'out'); setTimeout(() => curtain.classList.remove('out'), 600); }, 520);
  }));

  /* reveal + split headings */
  $$('[data-split]').forEach(h => { h.innerHTML = h.textContent.trim().split(/\s+/).map((w, i) => `<span class="w"><span style="--i:${i}">${w}</span></span>`).join(' '); });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('[data-reveal],[data-split],[data-stagger]').forEach(el => io.observe(el));
  $$('[data-stagger]').forEach(g => [...g.children].forEach((c, i) => c.style.setProperty('--d', i * 80 + 'ms')));

  /* parallax */
  const px = $$('[data-parallax]');
  const loop = () => { const vh = innerHeight; px.forEach(el => { const r = el.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) return; const k = parseFloat(el.dataset.parallax) || .2; el.style.transform = `translate3d(0,${(r.top + r.height / 2 - vh / 2) * -k}px,0) scale(1.15)`; }); requestAnimationFrame(loop); };
  if (!reduce && px.length) loop();

  /* lightbox with swipe */
  const lb = document.createElement('div'); lb.className = 'lb'; lb.hidden = true; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Galeria');
  lb.innerHTML = '<button class="lb-x" aria-label="Zamknij">×</button><button class="lb-p" aria-label="Poprzednie">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="lb-n" aria-label="Następne">›</button><span class="lb-c"></span>';
  document.body.appendChild(lb);
  let group = [], idx = 0, lastFocus = null;
  const show = i => { idx = (i + group.length) % group.length; const g = group[idx]; const img = $('img', lb); img.classList.remove('ok'); img.onload = () => img.classList.add('ok'); img.src = g.dataset.full || g.getAttribute('href'); img.alt = g.dataset.caption || ''; $('figcaption', lb).textContent = g.dataset.caption || ''; $('.lb-c', lb).textContent = `${idx + 1} / ${group.length}`; };
  const open = (el) => { group = $$(`[data-lightbox="${el.dataset.lightbox}"]`); lastFocus = el; lb.hidden = false; document.body.classList.add('noscroll'); show(group.indexOf(el)); $('.lb-x', lb).focus(); };
  const close = () => { lb.hidden = true; document.body.classList.remove('noscroll'); lastFocus && lastFocus.focus(); };
  document.addEventListener('click', e => { const el = e.target.closest('[data-lightbox]'); if (el) { e.preventDefault(); open(el); } });
  $('.lb-x', lb).onclick = close; $('.lb-p', lb).onclick = () => show(idx - 1); $('.lb-n', lb).onclick = () => show(idx + 1);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  let tx = 0; lb.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true });
  lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) show(idx + (d < 0 ? 1 : -1)); });
  addEventListener('keydown', e => { if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(idx + 1); if (e.key === 'ArrowLeft') show(idx - 1); });

  /* generic modal */
  Kit.modal = (html) => { let m = $('.modal'); if (!m) { m = document.createElement('div'); m.className = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.innerHTML = '<div class="modal-box"><button class="modal-x" aria-label="Zamknij">×</button><div class="modal-c"></div></div>'; document.body.appendChild(m);
      m.addEventListener('click', e => { if (e.target === m || e.target.closest('.modal-x')) { m.classList.remove('open'); document.body.classList.remove('noscroll'); } });
      addEventListener('keydown', e => { if (e.key === 'Escape' && m.classList.contains('open')) { m.classList.remove('open'); document.body.classList.remove('noscroll'); } }); }
    $('.modal-c', m).innerHTML = html; m.classList.add('open'); document.body.classList.add('noscroll'); $('.modal-x', m).focus(); return m; };

  /* toast */
  Kit.toast = (msg) => { const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg; document.body.appendChild(t); requestAnimationFrame(() => t.classList.add('on')); setTimeout(() => { t.classList.remove('on'); setTimeout(() => t.remove(), 400); }, 3200); };

  /* simple forms: [data-demo-form] */
  Kit.validate = (form) => { let ok = true; $$('[required]', form).forEach(i => { const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)) || (i.type === 'checkbox' && !i.checked); i.classList.toggle('err', bad); i.setAttribute('aria-invalid', bad); if (bad) ok = false; }); if (!ok) { const f = $('.err', form); f && f.focus(); } return ok; };
  $$('[data-demo-form]').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); if (!Kit.validate(f)) return; f.reset(); Kit.toast(f.dataset.demoForm || 'Dziękujemy! (wersja demo, nic nie zostało wysłane)'); }));

  /* FAQ accordion (single open) */
  $$('.faq details').forEach(d => d.addEventListener('toggle', () => { if (d.open) $$('.faq details').forEach(o => o !== d && (o.open = false)); }));

  /* reviews slider */
  $$('.reviews').forEach(r => { const track = $('.rv-track', r), items = [...track.children]; let i = 0; const dots = $('.rv-dots', r);
    dots.innerHTML = items.map((_, k) => `<button aria-label="Opinia ${k + 1}"></button>`).join('');
    const go = k => { i = (k + items.length) % items.length; track.style.transform = `translateX(-${i * 100}%)`; [...dots.children].forEach((d, n) => d.classList.toggle('on', n === i)); };
    [...dots.children].forEach((d, k) => d.onclick = () => { go(k); clearInterval(t); }); let t = setInterval(() => go(i + 1), 6000); go(0);
    let sx = 0; track.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true }); track.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 40) { go(i + (d < 0 ? 1 : -1)); clearInterval(t); } }); });

  /* cookie banner */
  const cb = $('.cookie');
  if (cb) { if (!store.get('cookie')) setTimeout(() => cb.classList.add('on'), 1200);
    $$('[data-cookie]', cb).forEach(b => b.onclick = () => { store.set('cookie', b.dataset.cookie); cb.classList.remove('on'); }); }

  /* booking wizard: Kit.booking(root, {services, hours(dateObj)->[start,end]|null, step, busy(fn)}) */
  Kit.booking = (root, cfg) => {
    const st = { svc: [], date: null, time: null, extra: {} }; let step = 0;
    const steps = $$('.bk-step', root), bar = $('.bk-bar i', root), lbls = $$('.bk-labels li', root);
    const go = n => { step = n; steps.forEach((s, k) => { s.hidden = k !== n; }); bar.style.width = (n / (steps.length - 1)) * 100 + '%'; lbls.forEach((l, k) => { l.classList.toggle('on', k === n); l.classList.toggle('done', k < n); }); const f = steps[n].querySelector('button,input,select'); cfg.onStep && cfg.onStep(n, st); };
    root.addEventListener('click', e => { const nx = e.target.closest('[data-next]'), pv = e.target.closest('[data-prev]');
      if (nx) { const err = cfg.check && cfg.check(step, st); if (err) { Kit.toast(err); return; } go(step + 1); root.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      if (pv) go(step - 1); });
    /* calendar */
    const cal = $('.cal', root); let view = new Date(); view.setDate(1);
    const mn = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const render = () => { const y = view.getFullYear(), m = view.getMonth(), first = (new Date(y, m, 1).getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
      let h = `<div class="cal-h"><button type="button" class="cal-p" aria-label="Poprzedni miesiąc">‹</button><b>${mn[m]} ${y}</b><button type="button" class="cal-n" aria-label="Następny miesiąc">›</button></div><div class="cal-g">${['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map(d => `<span class="cal-dn">${d}</span>`).join('')}`;
      for (let i = 0; i < first; i++) h += '<span></span>';
      for (let d = 1; d <= days; d++) { const dt = new Date(y, m, d), off = dt < today || !cfg.hours(dt) || (dt - today) / 864e5 > 60; const sel = st.date && +st.date === +dt;
        h += `<button type="button" class="cal-d${sel ? ' on' : ''}${+dt === +today ? ' today' : ''}" data-d="${+dt}" ${off ? 'disabled' : ''} aria-label="${d} ${mn[m]}">${d}</button>`; }
      cal.innerHTML = h + '</div>';
      $('.cal-p', cal).disabled = y === today.getFullYear() && m === today.getMonth();
      $('.cal-p', cal).onclick = () => { view.setMonth(m - 1); render(); }; $('.cal-n', cal).onclick = () => { view.setMonth(m + 1); render(); }; };
    cal.addEventListener('click', e => { const b = e.target.closest('.cal-d'); if (!b || b.disabled) return; st.date = new Date(+b.dataset.d); st.time = null; render(); slots(); cfg.onChange && cfg.onChange(st); });
    const slotBox = $('.slots', root);
    const slots = () => { const [a, z] = cfg.hours(st.date); const dur = cfg.duration ? cfg.duration(st) : 30; let h = '';
      for (let t = a * 60; t + dur <= z * 60; t += cfg.step || 30) { const hh = Math.floor(t / 60), mm = String(t % 60).padStart(2, '0'); const busy = cfg.busy ? cfg.busy(st.date, t) : false; h += `<button type="button" class="slot" ${busy ? 'disabled aria-label="zajęte"' : ''}>${hh}:${mm}</button>`; }
      slotBox.innerHTML = h || '<p class="muted">Brak wolnych terminów.</p>'; };
    slotBox.addEventListener('click', e => { const b = e.target.closest('.slot'); if (!b || b.disabled) return; $$('.slot', slotBox).forEach(x => x.classList.remove('on')); b.classList.add('on'); st.time = b.textContent; cfg.onChange && cfg.onChange(st); });
    render(); go(0); return { st, go, render, slots };
  };
})();
