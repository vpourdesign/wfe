/* =========================================================================
   Dev mode — toggles & copy/download utilities for the WordPress integrator.
   Activated via the fixed "DEV" pill or Ctrl/Cmd+D.
   ========================================================================= */
(function () {
  const STORAGE_KEY = 'wfe-dev-mode';
  const SHARED = window.WFE_SHARED || 'shared/';
  const HUB = window.WFE_HUB || 'index.html';
  const body = document.body;

  let active = localStorage.getItem(STORAGE_KEY) === '1';
  if (active) body.classList.add('dev-mode');

  /* ---- utilities ------------------------------------------------------- */
  function toast(msg) {
    const el = document.createElement('div');
    el.className = 'dev-toast';
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('visible'));
    setTimeout(() => {
      el.classList.remove('visible');
      setTimeout(() => el.remove(), 300);
    }, 1800);
  }

  async function copy(text, label) {
    try {
      await navigator.clipboard.writeText(text);
      toast(`✓ ${label} copié`);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      toast(`✓ ${label} copié`);
    }
  }

  function download(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || url.split('/').pop().split('?')[0];
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast(`⬇ ${a.download}`);
  }

  /* ---- toggle ---------------------------------------------------------- */
  const toggle = document.createElement('button');
  toggle.className = 'dev-toggle';
  toggle.type = 'button';
  toggle.title = 'Mode intégrateur (Ctrl/Cmd + D)';
  toggle.textContent = 'DEV';
  toggle.addEventListener('click', () => {
    active = !active;
    body.classList.toggle('dev-mode', active);
    localStorage.setItem(STORAGE_KEY, active ? '1' : '0');
    toast(active ? 'Mode intégrateur activé' : 'Mode intégrateur désactivé');
  });
  body.appendChild(toggle);

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
      e.preventDefault();
      toggle.click();
    }
  });

  /* ---- top bar --------------------------------------------------------- */
  const bar = document.createElement('div');
  bar.className = 'dev-bar';
  bar.innerHTML = `
    <span>Mode intégrateur</span>
    <button data-action="tokens" type="button">⧉ Tokens CSS</button>
    <button data-action="chrome" type="button">⧉ Chrome CSS</button>
    <button data-action="hub" type="button">◂ Maquettes</button>
    <button data-action="exit" type="button">✕ Sortir</button>
  `;
  body.appendChild(bar);

  bar.querySelector('[data-action="tokens"]').addEventListener('click', async () => {
    try {
      const res = await fetch(SHARED + 'tokens.css');
      copy(await res.text(), 'Tokens CSS');
    } catch { toast('✗ Tokens introuvables'); }
  });

  bar.querySelector('[data-action="chrome"]').addEventListener('click', async () => {
    try {
      const res = await fetch(SHARED + 'chrome.css');
      copy(await res.text(), 'Chrome CSS');
    } catch { toast('✗ Chrome introuvable'); }
  });

  bar.querySelector('[data-action="hub"]').addEventListener('click', () => {
    window.location.href = HUB;
  });

  bar.querySelector('[data-action="exit"]').addEventListener('click', () => toggle.click());

  /* ---- block toolbars -------------------------------------------------- */
  document.querySelectorAll('[data-block]').forEach((block) => {
    const toolbar = document.createElement('div');
    toolbar.className = 'dev-block-toolbar';
    const name = block.dataset.block || 'bloc';
    toolbar.innerHTML = `
      <span class="dev-block-name">${name}</span>
      <button data-action="html" type="button" title="Copier HTML">⧉ HTML</button>
    `;
    toolbar.querySelector('[data-action="html"]').addEventListener('click', (e) => {
      e.stopPropagation();
      const clone = block.cloneNode(true);
      clone.querySelectorAll('.dev-block-toolbar, .dev-media-toolbar').forEach((n) => n.remove());
      clone.querySelectorAll('.dev-media-wrap').forEach((w) => {
        const m = w.querySelector('img, video');
        if (m) w.replaceWith(m);
      });
      copy(clone.outerHTML, `HTML — ${name}`);
    });
    block.appendChild(toolbar);
  });

  /* ---- media toolbars -------------------------------------------------- */
  document.querySelectorAll('img, video').forEach((media) => {
    if (media.closest('.dev-toggle, .dev-bar, .dev-toast')) return;
    if (media.closest('.dev-media-wrap')) return;

    const wrap = document.createElement('span');
    wrap.className = 'dev-media-wrap';
    const cs = getComputedStyle(media);
    if (cs.display.includes('inline')) wrap.classList.add('is-inline');

    media.parentNode.insertBefore(wrap, media);
    wrap.appendChild(media);

    const toolbar = document.createElement('div');
    toolbar.className = 'dev-media-toolbar';
    toolbar.innerHTML = `
      <button data-action="dl" type="button" title="Télécharger">⬇</button>
      <button data-action="src" type="button" title="Copier le chemin">⧉ src</button>
    `;

    toolbar.querySelector('[data-action="dl"]').addEventListener('click', (e) => {
      e.stopPropagation();
      const src = media.currentSrc || media.src;
      if (!src) return toast('✗ Pas de src');
      const filename = src.split('/').pop().split('?')[0];
      download(src, filename);
    });

    toolbar.querySelector('[data-action="src"]').addEventListener('click', (e) => {
      e.stopPropagation();
      const src = media.getAttribute('src') || media.currentSrc;
      copy(src, 'Chemin');
    });

    wrap.appendChild(toolbar);
  });
})();
