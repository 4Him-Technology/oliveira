/* =========================================================================
   version-switcher.js — seletor de versões / empresas (2 colunas)
   -------------------------------------------------------------------------
   • Botão "Trocar versão do site" no canto inferior esquerdo.
   • Painel com 2 colunas: Oliveira (5 versões) | Doutor Safety.
   • Atalhos (opcionais): tecla ` (crase) ou Shift+V abre; Esc fecha;
     1–9 navegam na ordem (Oliveira 1–5, Doutor Safety 6).
   ========================================================================= */
(function () {
  'use strict';

  // ---- empresas e suas versões (file = arquivo no repo) -----------------
  var COMPANIES = [
    {
      name: 'Oliveira', sub: 'Serviços Médicos Integrados',
      accent: '#e8a82a', dark: '#0a3a46',
      versions: [
        { file: 'index.html',     label: 'Fusion (v5)', desc: 'Premium + dinamismo Tech' },
        { file: 'premium.html',   label: 'Premium',     desc: 'Cinematográfica · foto' },
        { file: 'clean.html',     label: 'Clean',       desc: 'Corporativa clara · cards' },
        { file: 'tech.html',      label: 'Tech',        desc: 'Escura · aurora · vidro' },
        { file: 'editorial.html', label: 'Editorial',   desc: 'Serifada · premium 2' }
      ]
    },
    {
      name: 'Doutor Safety', sub: 'Segurança & Saúde',
      accent: '#2ECC80', dark: '#0e3522',
      versions: [
        { file: 'doutor.html', label: 'Doutor Safety', desc: 'Verde · ocupacional · animado' }
      ]
    }
  ];

  // flatten + detectar atual
  var flat = [];
  COMPANIES.forEach(function (c) {
    c.versions.forEach(function (v) { v.company = c; flat.push(v); });
  });
  var path = location.pathname.split('/').pop() || 'index.html';
  if (path === '') path = 'index.html';
  var current = flat.find(function (v) { return v.file === path; }) || flat[0];
  var brandDark = current.company.dark, brandAccent = current.company.accent;

  // ---- estilos -----------------------------------------------------------
  var css = '' +
    '#vsw-dot{position:fixed;left:16px;bottom:16px;display:inline-flex;align-items:center;gap:9px;' +
      'padding:12px 18px 12px 15px;border:1px solid rgba(255,255,255,.18);border-radius:999px;' +
      'background:' + brandDark + ';color:#fff;font:700 13.5px/1 "Plus Jakarta Sans",system-ui,sans-serif;' +
      'letter-spacing:.01em;box-shadow:0 12px 34px -10px rgba(0,0,0,.55);z-index:99998;cursor:pointer;' +
      'transition:transform .22s,box-shadow .22s,background .22s}' +
    '#vsw-dot:hover{transform:translateY(-2px);box-shadow:0 18px 42px -12px rgba(0,0,0,.6);filter:brightness(1.12)}' +
    '#vsw-dot:active{transform:translateY(0)}' +
    '#vsw-dot svg{flex:none;color:' + brandAccent + '}' +
    '#vsw-dot .vsw-dot-tx{white-space:nowrap}' +
    '@media (max-width:480px){#vsw-dot{left:12px;bottom:12px;padding:11px 15px;font-size:12.5px}}' +
    '#vsw-overlay{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;' +
      'background:rgba(6,24,18,.55);backdrop-filter:blur(6px);font-family:"Plus Jakarta Sans",system-ui,sans-serif}' +
    '#vsw-overlay.open{display:flex}' +
    '#vsw-panel{width:min(720px,94vw);max-height:88vh;overflow:auto;background:#fff;border-radius:18px;' +
      'box-shadow:0 40px 100px -30px rgba(0,0,0,.6);transform:translateY(14px) scale(.98);opacity:0;' +
      'transition:transform .3s cubic-bezier(.22,.61,.36,1),opacity .3s}' +
    '#vsw-overlay.open #vsw-panel{transform:none;opacity:1}' +
    '#vsw-head{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;' +
      'border-bottom:1px solid #eceef0;background:' + brandDark + ';color:#fff}' +
    '#vsw-head h3{margin:0;font-size:15px;font-weight:800;letter-spacing:.02em}' +
    '#vsw-head .sub{font-size:11px;opacity:.72;margin-top:3px;letter-spacing:.06em;text-transform:uppercase}' +
    '#vsw-close{border:none;background:rgba(255,255,255,.16);color:#fff;width:32px;height:32px;border-radius:9px;cursor:pointer;font-size:16px;line-height:1}' +
    '#vsw-cols{display:grid;grid-template-columns:1fr 1fr}' +
    '.vsw-col{padding:14px 12px}' +
    '.vsw-col + .vsw-col{border-left:1px solid #eceef0}' +
    '.vsw-col-head{display:flex;align-items:center;gap:10px;padding:6px 12px 14px}' +
    '.vsw-co-dot{width:11px;height:11px;border-radius:50%;flex:none}' +
    '.vsw-col-head b{display:block;font-size:14.5px;color:#10231a;font-weight:800;line-height:1.1}' +
    '.vsw-col-head .cs{display:block;font-size:10px;color:#6c8389;letter-spacing:.05em;text-transform:uppercase;margin-top:2px}' +
    '.vsw-item{display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:1px solid transparent;background:none;' +
      'padding:12px 12px;border-radius:11px;cursor:pointer;transition:background .2s,border-color .2s;text-decoration:none;color:inherit}' +
    '.vsw-item + .vsw-item{margin-top:4px}' +
    '.vsw-item:hover{background:#f3f6f6}' +
    '.vsw-item.active{border-color:var(--acc);background:#f6faf7}' +
    '.vsw-mk{flex:none;width:30px;height:30px;border-radius:8px;background:#eef2f3;color:#456069;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px}' +
    '.vsw-item.active .vsw-mk{background:var(--acc);color:#fff}' +
    '.vsw-txt b{display:block;font-size:14.5px;color:#10231a;font-weight:700;line-height:1.15}' +
    '.vsw-txt span{display:block;font-size:12px;color:#6c8389;margin-top:1px}' +
    '.vsw-badge{margin-left:auto;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--acc);flex:none}' +
    '#vsw-foot{padding:12px 20px 16px;font-size:11px;color:#8aa0a4;border-top:1px solid #eceef0;text-align:center;letter-spacing:.03em}' +
    '@media (max-width:560px){#vsw-cols{grid-template-columns:1fr}.vsw-col + .vsw-col{border-left:none;border-top:1px solid #eceef0}}';

  var style = document.createElement('style');
  style.textContent = css;

  // ---- botão -------------------------------------------------------------
  var dot = document.createElement('button');
  dot.id = 'vsw-dot';
  dot.type = 'button';
  dot.setAttribute('aria-label', 'Trocar a versão / empresa do site');
  dot.title = 'Trocar versão / empresa';
  dot.innerHTML =
    '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>' +
    '<span class="vsw-dot-tx">Trocar versão do site</span>';

  // ---- painel (2 colunas) ------------------------------------------------
  var colsHtml = COMPANIES.map(function (c) {
    var items = c.versions.map(function (v) {
      var active = v.file === current.file;
      var n = c.versions.indexOf(v) + 1;
      return '<a class="vsw-item' + (active ? ' active' : '') + '" href="' + v.file + '" style="--acc:' + c.accent + '">' +
        '<span class="vsw-mk">' + n + '</span>' +
        '<span class="vsw-txt"><b>' + v.label + '</b><span>' + v.desc + '</span></span>' +
        (active ? '<span class="vsw-badge">Atual</span>' : '') +
        '</a>';
    }).join('');
    return '<div class="vsw-col">' +
      '<div class="vsw-col-head"><span class="vsw-co-dot" style="background:' + c.accent + '"></span>' +
        '<div><b>' + c.name + '</b><span class="cs">' + c.sub + '</span></div></div>' +
      items +
      '</div>';
  }).join('');

  var overlay = document.createElement('div');
  overlay.id = 'vsw-overlay';
  overlay.innerHTML =
    '<div id="vsw-panel" role="dialog" aria-label="Seletor de versões e empresas">' +
      '<div id="vsw-head"><div><h3>Versões dos sites</h3><div class="sub">Oliveira · Doutor Safety</div></div>' +
        '<button id="vsw-close" aria-label="Fechar">&times;</button></div>' +
      '<div id="vsw-cols">' + colsHtml + '</div>' +
      '<div id="vsw-foot">Escolha uma empresa e uma versão para visualizar</div>' +
    '</div>';

  function mount() {
    document.head.appendChild(style);
    document.body.appendChild(dot);
    document.body.appendChild(overlay);

    function open() { overlay.classList.add('open'); }
    function close() { overlay.classList.remove('open'); }
    function toggle() { overlay.classList.toggle('open'); }

    dot.addEventListener('click', open);
    document.getElementById('vsw-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

    document.addEventListener('keydown', function (e) {
      var tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '`' || (e.shiftKey && (e.key === 'V' || e.key === 'v'))) {
        e.preventDefault(); toggle(); return;
      }
      if (e.key === 'Escape') { close(); return; }
      if (overlay.classList.contains('open') && e.key >= '1' && e.key <= String(flat.length)) {
        var v = flat[parseInt(e.key, 10) - 1];
        if (v && v.file !== current.file) location.href = v.file;
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
