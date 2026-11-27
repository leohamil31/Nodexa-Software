/* Nodexa Software — interações do site */
{
  const WHATSAPP = '5511999999999'; // troque pelo seu número com DDI e DDD
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* formulário → WhatsApp */
  const form = document.getElementById('form');
  const out = document.getElementById('out');
  const fNome = document.getElementById('fNome');
  const sendBtn = document.getElementById('sendBtn');
  const toast = document.getElementById('toast'), toastTxt = document.getElementById('toastTxt');
  let toastT;
  const showToast = (msg) => {
    toastTxt.textContent = msg; toast.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('show'), 2400);
  };
  form.nome.addEventListener('input', () => { if (form.nome.value.trim()) { fNome.classList.remove('err'); form.nome.removeAttribute('aria-invalid'); } });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (sendBtn.dataset.state === 'loading') return;
    if (form.site.value) return; // isca: só robôs preenchem
    const limpa = (v, max) => v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
    const nome = limpa(form.nome.value, 80);
    if (!nome) {
      out.textContent = '';
      fNome.classList.remove('shake'); void fNome.offsetWidth; fNome.classList.add('err', 'shake');
      form.nome.setAttribute('aria-invalid', 'true'); form.nome.focus(); return;
    }
    const texto = 'Olá, Nodexa! Sou ' + nome +
      (limpa(form.empresa.value, 80) ? ' (' + limpa(form.empresa.value, 80) + ')' : '') +
      '. Tenho interesse em: ' + form.tipo.value + '.' +
      (limpa(form.msg.value, 1500) ? '\n\n' + limpa(form.msg.value, 1500) : '');
    const url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);
    out.textContent = '';
    sendBtn.dataset.state = 'loading';
    setTimeout(() => {
      sendBtn.dataset.state = 'success';
      const a = document.createElement('a');
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = 'Abrir conversa no WhatsApp →';
      out.classList.remove('swap'); void out.offsetWidth; out.classList.add('swap');
      out.append('Mensagem pronta! ', a);
      showToast('Mensagem pronta para enviar');
      a.addEventListener('click', () => setTimeout(() => { location.href = 'obrigado.html'; }, 400));
      if (window.nxTrack) window.nxTrack('generate_lead', { servico: form.tipo.value });
      a.focus();
      setTimeout(() => { sendBtn.dataset.state = 'idle'; }, 2600);
    }, reduce ? 0 : 900);
  });

  /* copiar e-mail */
  document.querySelectorAll('.copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const txt = btn.dataset.copy;
      try { await navigator.clipboard.writeText(txt); }
      catch (err) { showToast('Não deu para copiar. Endereço: ' + txt); return; }
      btn.classList.add('done'); showToast('E-mail copiado');
      setTimeout(() => btn.classList.remove('done'), 1800);
    });
  });
  document.getElementById('floatZap').href = 'https://wa.me/' + WHATSAPP;

  /* menu no celular */
  const nav = document.getElementById('topnav');
  const menuBtn = document.getElementById('menuBtn');
  const links = document.getElementById('links');
  const setMenu = (open) => {
    links.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  menuBtn.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  links.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && links.classList.contains('open')) { setMenu(false); menuBtn.focus(); } });

  /* barra ao rolar + botão flutuante */
  const floatBtn = document.getElementById('floatZap');
  const progC = document.getElementById('progC');
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 8);
    floatBtn.classList.toggle('show', scrollY > innerHeight * 0.6);
    const max = document.documentElement.scrollHeight - innerHeight;
    progC.style.setProperty('--p', (1 - (max > 0 ? scrollY / max : 0)).toFixed(4));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* link ativo no menu, com indicador que desliza */
  const navLinks = [...links.querySelectorAll('a:not(.btn)')];
  const ind = document.getElementById('ind');
  let hovered = null;
  const moveInd = () => {
    const a = hovered || navLinks.find((l) => l.classList.contains('on'));
    if (!a) { ind.style.opacity = 0; return; }
    ind.style.width = a.offsetWidth + 'px';
    ind.style.top = a.offsetTop + 'px';
    ind.style.height = a.offsetHeight + 'px';
    ind.style.translate = a.offsetLeft + 'px 0';
    ind.style.opacity = 1;
  };
  navLinks.forEach((a) => {
    a.addEventListener('pointerenter', () => { hovered = a; moveInd(); });
    a.addEventListener('focus', () => { hovered = a; moveInd(); });
    a.addEventListener('blur', () => { hovered = null; moveInd(); });
  });
  links.addEventListener('pointerleave', () => { hovered = null; moveInd(); });
  addEventListener('resize', moveInd);
  if (document.fonts) document.fonts.ready.then(moveInd);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id));
      moveInd();
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['servicos', 'como', 'porque', 'duvidas', 'contato', 'inicio'].forEach((id) => { const el = document.getElementById(id); if (el) spy.observe(el); });

  /* surgir ao rolar */
  document.querySelectorAll('[data-stagger]').forEach((g) => {
    [...g.children].forEach((c, i) => { if (c.classList.contains('reveal')) c.style.setProperty('--i', i % 3); });
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* abertura */
  const introEl = document.getElementById('intro');
  const introOn = document.documentElement.classList.contains('has-intro');
  const introDone = new Promise((res) => {
    if (!introOn) { introEl.remove(); res(); return; }
    setTimeout(() => { introEl.classList.add('out'); res(); }, 1750);
    setTimeout(() => introEl.remove(), 2600);
  });

  /* rótulos "decodificam" como no terminal */
  const glyphs = 'abcdefghijklmnopqrstuvwxyz<>/_$#{}01';
  const scramble = (el) => {
    const final = el.textContent; const len = final.length; let f = 0; const total = 22;
    const tick = () => {
      el.textContent = [...final].map((ch, i) => (ch === ' ' || i < (f / total) * len) ? ch : glyphs[Math.floor(Math.random() * glyphs.length)]).join('');
      if (++f <= total) requestAnimationFrame(tick); else el.textContent = final;
    };
    tick();
  };
  if (!reduce) {
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { sio.unobserve(en.target); scramble(en.target); } });
    }, { threshold: 0.6 });
    document.querySelectorAll('.eyebrow').forEach((el) => { el.setAttribute('aria-label', el.textContent); sio.observe(el); });
  }

  /* títulos e textos surgem linha por linha */
  const lineEls = [...document.querySelectorAll('[data-lines]')];
  const splitLines = (el) => {
    if (el._orig === undefined) el._orig = el.innerHTML; else el.innerHTML = el._orig;
    const words = [];
    [...el.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        n.textContent.split(/\s+/).forEach((w) => { if (w) { const s = document.createElement('span'); s.textContent = w; words.push(s); } });
      } else if (n.nodeType === 1) { const s = document.createElement('span'); s.append(n); words.push(s); }
    });
    el.textContent = '';
    words.forEach((w, i) => { el.append(w); if (i < words.length - 1) el.append(' '); });
    const lines = []; let top = null;
    words.forEach((w) => { const y = w.offsetTop; if (top === null || Math.abs(y - top) > 4) { lines.push([]); top = y; } lines[lines.length - 1].push(w); });
    el.textContent = '';
    lines.forEach((ws, i) => {
      const line = document.createElement('span'); line.className = 'line';
      const inner = document.createElement('span'); inner.className = 'line-in'; inner.style.setProperty('--l', i);
      ws.forEach((w, j) => { inner.append(...w.childNodes); if (j < ws.length - 1) inner.append(' '); });
      if (i < lines.length - 1) inner.append(' ');
      line.append(inner); el.append(line);
    });
  };
  if (!reduce && lineEls.length) {
    const lio = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); lio.unobserve(en.target); } });
    }, { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1200))]).then(() => {
      lineEls.forEach(splitLines);
      document.documentElement.classList.add('lines-ready');
      introDone.then(() => lineEls.forEach((el) => lio.observe(el)));
    });
    let lastW = innerWidth, rt;
    addEventListener('resize', () => {
      if (innerWidth === lastW) return; lastW = innerWidth;
      clearTimeout(rt); rt = setTimeout(() => lineEls.forEach(splitLines), 200);
    });
  }

  /* terminal com código digitado no topo */
  const heroEl = document.getElementById('inicio');
  const term = document.getElementById('nxTerm'), codeEl = document.getElementById('nxCode'), figEl = document.getElementById('fig');
  if (term && codeEl) {
    const LINES = [
      [['c', '// nodexa — o seu projeto']],
      [['k', 'const '], ['v', 'projeto'], ['p', ' = '], ['f', 'nodexa.criar'], ['p', '({']],
      [['p', '  tipo: '], ['s', "'sistema sob medida'"], ['p', ',']],
      [['p', '  ia: '], ['k', 'true'], ['p', ',']],
      [['p', '  automacao: ['], ['s', "'pedidos'"], ['p', ', '], ['s', "'estoque'"], ['p', '],']],
      [['p', '});']],
      [['k', 'await '], ['v', 'projeto'], ['f', '.publicar'], ['p', '();']],
      [['o', '✓ online em produção']],
    ];
    let timer = 0, running = false;
    const build = (chars) => {
      codeEl.textContent = '';
      let left = chars;
      for (const line of LINES) {
        for (const [cls, txt] of line) {
          if (left <= 0) break;
          const part = txt.slice(0, left); left -= part.length;
          const s = document.createElement('span'); if (cls !== 'p') s.className = 'tk-' + cls; s.textContent = part; codeEl.append(s);
        }
        if (left <= 0) break;
        codeEl.append('\n'); left -= 1;
      }
      const caret = document.createElement('span'); caret.className = 'nx-caret'; codeEl.append(caret);
    };
    const total = LINES.reduce((n, l) => n + l.reduce((m, [, x]) => m + x.length, 0) + 1, 0);
    const stop = () => { clearTimeout(timer); running = false; term.classList.remove('on'); figEl.classList.remove('coding'); };
    const play = (loop) => {
      if (running) return; running = true;
      term.classList.add('on'); figEl.classList.add('coding');
      if (reduce) { build(total); return; }
      let n = 0;
      const step = () => {
        if (!running) return;
        n += Math.random() < .15 ? 3 : 1; build(n);
        if (n < total) timer = setTimeout(step, 16 + Math.random() * 30);
        else if (loop) timer = setTimeout(() => { running = false; term.classList.remove('on'); figEl.classList.remove('coding'); timer = setTimeout(() => play(true), 1600); }, 3200);
      };
      build(0); timer = setTimeout(step, 350);
    };
    if (matchMedia('(pointer: fine)').matches) {
      figEl.addEventListener('pointerenter', () => play(false));
      heroEl.addEventListener('pointerleave', stop);
      heroEl.addEventListener('pointermove', (e) => {
        const r = figEl.getBoundingClientRect(), pad = 40;
        const inside = e.clientX > r.left - pad && e.clientX < r.right + pad && e.clientY > r.top - pad && e.clientY < r.bottom + pad;
        if (!inside && running) stop();
      });
    } else {
      new IntersectionObserver((en) => { if (en[0].isIntersecting) play(true); else stop(); }, { threshold: .5 }).observe(figEl);
    }
  }

  /* no celular, o logo 3D gira de leve com a rolagem */
  if (!reduce && matchMedia('(pointer: coarse)').matches) {
    const tiltEl = document.getElementById('tilt');
    let tk = false;
    addEventListener('scroll', () => {
      if (tk) return; tk = true;
      requestAnimationFrame(() => { tk = false; const k = Math.min(1, scrollY / innerHeight); tiltEl.style.setProperty('--ty', (k * 28).toFixed(1) + 'deg'); tiltEl.style.setProperty('--tx', (k * -10).toFixed(1) + 'deg'); });
    }, { passive: true });
  }

  /* faixas diagonais andam com a rolagem */
  const tracks = [...document.querySelectorAll('.xb .track')];
  if (tracks.length && !reduce) {
    let ticking = false;
    const moveBands = () => {
      const y = scrollY;
      tracks[0].style.translate = (-260 + y * 0.25) + 'px 0';
      tracks[1].style.translate = (-y * 0.35) + 'px 0';
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(moveBands); } }, { passive: true });
    moveBands();
  }

  /* números contam até o valor final */
  const counters = [...document.querySelectorAll('[data-count]')];
  if (counters.length && !reduce) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        const el = en.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
        const t0 = performance.now(), dur = 1600;
        const step = (now) => {
          const k = Math.min(1, (now - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - k, 4)));
          el.textContent = v + suf;
          if (k < 1) requestAnimationFrame(step);
        };
        el.textContent = '0' + suf; requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  }

  /* pausa as animações que estão fora da tela (economiza bateria no celular) */
  const pio = new IntersectionObserver((entries) => {
    entries.forEach((en) => en.target.classList.toggle('paused', !en.isIntersecting));
  });
  document.querySelectorAll('.hero, .slats, .xbands').forEach((el) => pio.observe(el));

  /* botão de vidro 3D magnético */
  const gb = document.getElementById('glassBtn');
  if (gb && !reduce && matchMedia('(pointer: fine)').matches) {
    const area = gb.closest('.hero') || document.body;
    let raf = 0;
    const reset = () => { gb.classList.remove('near'); ['--mx', '--my', '--rx', '--ry'].forEach((p) => gb.style.removeProperty(p)); };
    area.addEventListener('pointermove', (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = gb.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const x = e.clientX - cx, y = e.clientY - cy;
        if (Math.hypot(x / 1.6, y) > 110) { reset(); return; }
        gb.classList.add('near');
        gb.style.setProperty('--mx', Math.max(-12, Math.min(12, x * .14)).toFixed(1) + 'px');
        gb.style.setProperty('--my', Math.max(-8, Math.min(8, y * .2)).toFixed(1) + 'px');
        gb.style.setProperty('--ry', (x / r.width * 22).toFixed(1) + 'deg');
        gb.style.setProperty('--rx', (-y / r.height * 18).toFixed(1) + 'deg');
        gb.style.setProperty('--gx', (e.clientX - r.left) + 'px');
        gb.style.setProperty('--gy', (e.clientY - r.top) + 'px');
      });
    });
    area.addEventListener('pointerleave', reset);
  }

  /* faíscas nos botões do topo */
  const sqBtn = document.querySelector('.btn.sq');
  const sizeSq = () => { if (sqBtn) sqBtn.style.setProperty('--sqw', (sqBtn.offsetWidth + 14) + 'px'); };
  sizeSq(); addEventListener('resize', sizeSq); if (document.fonts) document.fonts.ready.then(sizeSq);
  const COLORS = ['#B794FF', '#7C4DFF', '#FFFFFF', '#E879F9'];
  const burst = (x, y, n, spread) => {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span'); p.className = 'spark';
      const ang = Math.random() * Math.PI * 2, dist = spread * (.4 + Math.random() * .8);
      p.style.left = x + 'px'; p.style.top = y + 'px';
      p.style.setProperty('--x', (Math.cos(ang) * dist).toFixed(0) + 'px');
      p.style.setProperty('--y', (Math.sin(ang) * dist).toFixed(0) + 'px');
      p.style.setProperty('--c', COLORS[i % 4]);
      p.style.setProperty('--d', (.5 + Math.random() * .6).toFixed(2) + 's');
      document.body.append(p); setTimeout(() => p.remove(), 1200);
    }
  };
  let lastSpark = 0;
  document.querySelectorAll('.btn.fx').forEach((b) => {
    if (matchMedia('(pointer: fine)').matches) b.addEventListener('pointermove', (e) => { const now = performance.now(); if (now - lastSpark > 45) { lastSpark = now; burst(e.clientX, e.clientY, 2, 38); } });
    b.addEventListener('pointerdown', (e) => burst(e.clientX, e.clientY, 24, 100));
  });

  /* brilho que segue o mouse nos cartões */
  document.querySelectorAll('.svc').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* logo 3D inclina com o mouse */
  const tilt = document.getElementById('tilt');
  const hero = document.getElementById('inicio');
  if (!reduce && matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.setProperty('--ty', (x * 18).toFixed(2) + 'deg');
      tilt.style.setProperty('--tx', (-y * 14).toFixed(2) + 'deg');
    });
    hero.addEventListener('pointerleave', () => { tilt.style.setProperty('--ty', '0deg'); tilt.style.setProperty('--tx', '0deg'); });
  }
}
