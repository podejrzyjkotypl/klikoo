/* Klikoo consent manager (demo – no real trackers are loaded) */
(() => {
  const KEY = 'ashi-consent', VER = 2, d = document;
  const CATS = [
    ['necessary', 'Niezbędne', 'Zapewniają działanie strony: zapamiętanie Twoich wyborów, koszyka i trybu kolorów. Nie można ich wyłączyć.'],
    ['functional', 'Funkcjonalne', 'Ułatwiają korzystanie ze strony, np. zapamiętują ostatnio wybrane opcje i ustawienia formularzy.'],
    ['analytics', 'Analityczne', 'Pomagają zrozumieć, jak odwiedzający korzystają ze strony, abyśmy mogli ją ulepszać. Dane są zbiorcze.'],
    ['marketing', 'Marketingowe', 'Służą do wyświetlania dopasowanych reklam i mierzenia skuteczności kampanii u naszych partnerów.']];
  const read = () => { try { const c = JSON.parse(localStorage.getItem(KEY)); return c && c.v === VER ? c : null; } catch (e) { return null; } };
  const write = ch => { const c = { v: VER, ts: new Date().toISOString(), necessary: true, ...ch }; try { localStorage.setItem(KEY, JSON.stringify(c)); localStorage.removeItem('cookie'); } catch (e) {} d.dispatchEvent(new CustomEvent('consentchange', { detail: c })); return c; };
  const privacy = d.currentScript?.dataset.privacy || 'polityka-prywatnosci.html';
  const ico = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9 4 4 0 0 1-5-5 4 4 0 0 1-4-4Z"/><circle cx="8.5" cy="11" r="1"/><circle cx="12" cy="16" r="1"/><circle cx="15.5" cy="12.5" r=".6"/></svg>';
  const wrap = d.createElement('div'); wrap.className = 'cc-root';
  wrap.innerHTML = `
<section class="cc-bar" role="region" aria-label="Zgoda na pliki cookies" aria-describedby="cc-desc" hidden>
  <div class="cc-txt"><h2 class="cc-h">${ico}<span>Szanujemy Twoją prywatność</span></h2>
  <p id="cc-desc">Używamy plików cookies, aby strona działała poprawnie, a za Twoją zgodą – także do analityki i marketingu. Możesz zaakceptować wszystkie, odrzucić opcjonalne albo wybrać kategorie. Zgodę zmienisz w każdej chwili w stopce. <a href="${privacy}">Polityka prywatności</a></p>
  <p class="cc-demo">Podgląd projektu – ta wersja strony nie ładuje żadnych narzędzi śledzących.</p></div>
  <div class="cc-btns"><button type="button" class="cc-b" data-cc="all">Akceptuj wszystkie</button><button type="button" class="cc-b" data-cc="none">Odrzuć wszystkie</button><button type="button" class="cc-b" data-cc="settings">Ustawienia</button></div>
</section>
<div class="cc-modal" hidden>
  <div class="cc-scrim" data-cc="close"></div>
  <div class="cc-dlg" role="dialog" aria-modal="true" aria-labelledby="cc-mt" aria-describedby="cc-md" tabindex="-1">
    <header class="cc-mh"><h2 id="cc-mt" class="cc-h">${ico}<span>Ustawienia prywatności</span></h2><button type="button" class="cc-x" data-cc="close" aria-label="Zamknij ustawienia">×</button></header>
    <p id="cc-md" class="cc-lead">Wybierz, na które kategorie plików cookies się zgadzasz. Niezbędne są zawsze aktywne, bo bez nich strona nie działa. Szczegóły znajdziesz w <a href="${privacy}">polityce prywatności</a>.</p>
    <ul class="cc-list">${CATS.map(([k, n, t]) => `<li class="cc-cat"><div><h3 id="cc-l-${k}">${n}${k === 'necessary' ? ' <span class="cc-always">zawsze aktywne</span>' : ''}</h3><p id="cc-d-${k}">${t}</p></div><label class="cc-sw"><input type="checkbox" role="switch" data-k="${k}" aria-labelledby="cc-l-${k}" aria-describedby="cc-d-${k}"${k === 'necessary' ? ' checked disabled' : ''}><span aria-hidden="true"></span></label></li>`).join('')}</ul>
    <p class="cc-demo">Podgląd: wybór zapisuje się w Twojej przeglądarce. Mapa Google ładuje się dopiero po zgodzie na pliki funkcjonalne.</p>
    <footer class="cc-mf"><button type="button" class="cc-b" data-cc="none">Odrzuć wszystkie</button><button type="button" class="cc-b" data-cc="all">Akceptuj wszystkie</button><button type="button" class="cc-b cc-save" data-cc="save">Zapisz wybory</button></footer>
  </div>
</div>
<div class="cc-live" aria-live="polite"></div>`;
  const init = () => {
    d.body.appendChild(wrap);
    const bar = wrap.querySelector('.cc-bar'), modal = wrap.querySelector('.cc-modal'), dlg = wrap.querySelector('.cc-dlg'), live = wrap.querySelector('.cc-live');
    const sw = [...wrap.querySelectorAll('.cc-sw input:not([disabled])')];
    let last = null;
    const showBar = o => { if (o) { bar.hidden = false; requestAnimationFrame(() => bar.classList.add('on')); } else { bar.classList.remove('on'); bar.hidden = true; } };
    const openM = () => { const c = read() || {}; sw.forEach(i => i.checked = !!c[i.dataset.k]); last = d.activeElement; modal.hidden = false; d.documentElement.classList.add('cc-lock'); requestAnimationFrame(() => { modal.classList.add('on'); dlg.focus(); }); };
    const closeM = () => { modal.classList.remove('on'); modal.hidden = true; d.documentElement.classList.remove('cc-lock'); if (!read()) { showBar(true); bar.querySelector('[data-cc=settings]').focus(); } else if (last && last.focus && d.contains(last) && !bar.contains(last)) last.focus(); };
    const done = (c, msg) => { write(c); live.textContent = msg; if (!modal.hidden) closeM(); showBar(false); if (last && d.contains(last) && !wrap.contains(last)) last.focus(); };
    wrap.addEventListener('click', e => { const b = e.target.closest('[data-cc]'); if (!b) return; const a = b.dataset.cc;
      if (a === 'all') done({ functional: true, analytics: true, marketing: true }, 'Zaakceptowano wszystkie pliki cookies.');
      if (a === 'none') done({ functional: false, analytics: false, marketing: false }, 'Odrzucono opcjonalne pliki cookies.');
      if (a === 'save') done(Object.fromEntries(sw.map(i => [i.dataset.k, i.checked])), 'Zapisano Twoje wybory.');
      if (a === 'settings') { if (!last || bar.contains(last)) last = null; showBar(false); openM(); }
      if (a === 'close') closeM(); });
    d.addEventListener('click', e => { const o = e.target.closest('[data-cc-open]'); if (o) { e.preventDefault(); showBar(false); openM(); last = o; } });
    d.addEventListener('keydown', e => { if (modal.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeM(); }
      if (e.key === 'Tab') { const f = [...dlg.querySelectorAll('button,a[href],input:not([disabled])')].filter(x => x.offsetParent); const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && (d.activeElement === a || d.activeElement === dlg)) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && d.activeElement === z) { e.preventDefault(); a.focus(); } } }, true);
    if (!read()) setTimeout(() => showBar(true), 600);
    window.KlikooConsent = { get: read, open: openM };
  };
  d.readyState === 'loading' ? d.addEventListener('DOMContentLoaded', init) : init();
})();
