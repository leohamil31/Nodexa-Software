/* Nodexa Software — aviso de cookies e Google Analytics (só carrega com consentimento) */
(() => {
  const GA_ID = 'G-XXXXXXXXXX'; // troque pelo ID do seu Google Analytics 4 (começa com G-)
  const ativo = /^G-[A-Z0-9]{6,}$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX';
  const KEY = 'nx-consent';
  const ler = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const salvar = (v) => { try { localStorage.setItem(KEY, v); } catch (e) {} };

  let carregado = false;
  const carregarGA = () => {
    if (carregado) return; carregado = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
    const s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.append(s);
  };

  /* eventos (ex.: pedido de orçamento) só são enviados se o Analytics estiver ativo */
  window.nxTrack = (nome, dados) => { if (window.gtag) window.gtag('event', nome, dados || {}); };

  const prefs = () => document.querySelectorAll('[data-cookie-prefs]');
  if (!ativo) {
    prefs().forEach((a) => { const s = document.createElement('span'); s.textContent = 'Preferências de cookies (nenhum cookie de análise ativo)'; a.replaceWith(s); });
    return;
  }

  const css = document.createElement('style');
  css.textContent = `
.ck{position:fixed;left:16px;bottom:16px;z-index:90;max-width:420px;padding:18px 18px 16px;border-radius:18px;background:rgb(24 20 38 / .92);color:#EEEAF8;border:1px solid rgb(255 255 255 / .12);box-shadow:inset 0 1px 0 rgb(255 255 255 / .1),0 24px 50px -20px rgb(0 0 0 / .7);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);font:15px/1.55 Inter,system-ui,sans-serif;transition:translate .5s cubic-bezier(.34,1.56,.64,1),opacity .35s}
.ck.hide{translate:0 30px;opacity:0;pointer-events:none}
.ck p{margin:0 0 14px;color:#D6D1E6}
.ck a{color:#C4A8FF}
.ck .r{display:flex;gap:8px;flex-wrap:wrap}
.ck button{flex:1;min-height:44px;padding:0 16px;border-radius:12px;border:0;font:600 15px Inter,system-ui,sans-serif;cursor:pointer;transition:transform .4s cubic-bezier(.34,1.56,.64,1),background-color .2s}
.ck button:active{transform:scale(.96)}
.ck .no{background:rgb(255 255 255 / .08);color:#fff}
.ck .no:hover{background:rgb(255 255 255 / .14)}
.ck .yes{background:#7C4DFF;color:#fff}
.ck .yes:hover{background:#6A3AF0}
.ck button:focus-visible,.ck a:focus-visible{outline:3px solid #B794FF;outline-offset:2px}
@media(max-width:600px){.ck{left:10px;right:10px;bottom:84px;max-width:none}}`;
  document.head.append(css);

  let box = null;
  const fechar = () => { if (!box) return; box.classList.add('hide'); const b = box; box = null; setTimeout(() => b.remove(), 500); };
  const abrir = () => {
    if (box) return;
    box = document.createElement('div');
    box.className = 'ck hide'; box.setAttribute('role', 'region'); box.setAttribute('aria-label', 'Aviso de cookies');
    const p = document.createElement('p');
    const link = document.createElement('a'); link.href = 'politica-de-privacidade.html'; link.textContent = 'Política de Privacidade';
    p.append('Usamos cookies de análise só com a sua permissão, para entender como o site é usado. Veja a ', link, '.');
    const r = document.createElement('div'); r.className = 'r';
    const no = document.createElement('button'); no.type = 'button'; no.className = 'no'; no.textContent = 'Recusar';
    const yes = document.createElement('button'); yes.type = 'button'; yes.className = 'yes'; yes.textContent = 'Aceitar';
    no.addEventListener('click', () => { salvar('no'); fechar(); });
    yes.addEventListener('click', () => { salvar('yes'); carregarGA(); fechar(); });
    r.append(no, yes); box.append(p, r); document.body.append(box);
    requestAnimationFrame(() => requestAnimationFrame(() => box && box.classList.remove('hide')));
  };

  prefs().forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); abrir(); }));
  const escolha = ler();
  if (escolha === 'yes') carregarGA();
  else if (escolha !== 'no') setTimeout(abrir, document.documentElement.classList.contains('has-intro') ? 2600 : 800);
})();
