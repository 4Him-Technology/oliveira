/* =========================================================================
   version-switcher.js — seletor de versão (botão visível para o cliente)
   -------------------------------------------------------------------------
   Como abrir o seletor:
     • Clique no botão "Trocar versão do site" no canto inferior esquerdo.
     • Atalhos (opcionais): tecla  `  (crase) ou Shift + V para abrir;
       teclas 1–4 trocam de versão com o painel aberto.
   Fechar: Esc, clicar fora, ou clicar no ✕.
   ========================================================================= */
(function () {
  'use strict';

  // Ordem e rótulos das versões. O "file" deve bater com os arquivos no repo.
  var VERSIONS = [
    { file: 'index.html',    key: 'fusion',    label: 'Fusion (v5)', desc: 'Premium + dinamismo Tech' },
    { file: 'premium.html',  key: 'premium',   label: 'Premium',     desc: 'Cinematográfica · foto full-bleed' },
    { file: 'clean.html',    key: 'clean',     label: 'Clean',       desc: 'Corporativa clara · cards' },
    { file: 'tech.html',     key: 'tech',      label: 'Tech',        desc: 'Escura · aurora · vidro' },
    { file: 'editorial.html',key: 'editorial', label: 'Editorial',   desc: 'Serifada · premium 2' }
  ];

  // Detecta o arquivo atual
  var path = location.pathname.split('/').pop() || 'index.html';
  if (path === '') path = 'index.html';
  var current = VERSIONS.find(function (v) { return v.file === path; }) || VERSIONS[0];

  // ---- estilos -----------------------------------------------------------
  var css = '' +
    '#vsw-dot{position:fixed;left:16px;bottom:16px;display:inline-flex;align-items:center;gap:9px;' +
      'padding:12px 18px 12px 15px;border:1px solid rgba(255,255,255,.18);border-radius:999px;' +
      'background:#0a3a46;color:#fff;font:700 13.5px/1 "Plus Jakarta Sans","Hanken Grotesk",system-ui,sans-serif;' +
      'letter-spacing:.01em;box-shadow:0 12px 34px -10px rgba(0,0,0,.55);z-index:99998;cursor:pointer;' +
      'transition:transform .22s,box-shadow .22s,background .22s}' +
    '#vsw-dot:hover{background:#0b5867;transform:translateY(-2px);box-shadow:0 18px 42px -12px rgba(0,0,0,.6)}' +
    '#vsw-dot:active{transform:translateY(0)}' +
    '#vsw-dot svg{flex:none;color:#e8a82a}' +
    '#vsw-dot .vsw-dot-tx{white-space:nowrap}' +
    '@media (max-width:480px){#vsw-dot{left:12px;bottom:12px;padding:11px 15px;font-size:12.5px}}' +
    '#vsw-overlay{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;' +
      'background:rgba(6,30,38,.55);backdrop-filter:blur(6px);font-family:"Plus Jakarta Sans","Hanken Grotesk",system-ui,sans-serif}' +
    '#vsw-overlay.open{display:flex}' +
    '#vsw-panel{width:min(440px,92vw);background:#fff;border-radius:16px;overflow:hidden;' +
      'box-shadow:0 40px 100px -30px rgba(0,0,0,.6);transform:translateY(14px) scale(.98);opacity:0;transition:transform .3s cubic-bezier(.22,.61,.36,1),opacity .3s}' +
    '#vsw-overlay.open #vsw-panel{transform:none;opacity:1}' +
    '#vsw-head{display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid #eceef0;background:#0a3a46;color:#fff}' +
    '#vsw-head h3{margin:0;font-size:15px;font-weight:700;letter-spacing:.02em}' +
    '#vsw-head .sub{font-size:11.5px;opacity:.7;margin-top:2px;letter-spacing:.06em;text-transform:uppercase}' +
    '#vsw-close{border:none;background:rgba(255,255,255,.14);color:#fff;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:16px;line-height:1}' +
    '#vsw-list{padding:10px}' +
    '.vsw-item{display:flex;align-items:center;gap:14px;width:100%;text-align:left;border:1px solid transparent;background:none;' +
      'padding:14px 14px;border-radius:11px;cursor:pointer;transition:background .2s,border-color .2s;text-decoration:none;color:inherit}' +
    '.vsw-item:hover{background:#f3f6f6}' +
    '.vsw-item.active{border-color:#e8a82a;background:#fffaf0}' +
    '.vsw-num{flex:none;width:34px;height:34px;border-radius:9px;background:#0b5867;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px}' +
    '.vsw-item.active .vsw-num{background:#e8a82a;color:#3a2a06}' +
    '.vsw-txt b{display:block;font-size:15px;color:#0e2a31;font-weight:700}' +
    '.vsw-txt span{display:block;font-size:12.5px;color:#6c8389;margin-top:1px}' +
    '.vsw-badge{margin-left:auto;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#cf9015;flex:none}' +
    '#vsw-foot{padding:11px 20px 15px;font-size:11px;color:#8aa0a4;border-top:1px solid #eceef0;text-align:center;letter-spacing:.03em}' +
    '#vsw-foot kbd{font-family:ui-monospace,monospace;background:#eef2f3;border-radius:4px;padding:1px 6px;font-size:11px;color:#456069}';

  var style = document.createElement('style');
  style.textContent = css;

  // ---- markup ------------------------------------------------------------
  var dot = document.createElement('button');
  dot.id = 'vsw-dot';
  dot.type = 'button';
  dot.setAttribute('aria-label', 'Trocar a versão visual do site');
  dot.title = 'Trocar a versão visual do site';
  dot.innerHTML =
    '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>' +
    '<span class="vsw-dot-tx">Trocar versão do site</span>';

  var overlay = document.createElement('div');
  overlay.id = 'vsw-overlay';
  var items = VERSIONS.map(function (v, i) {
    var active = v.key === current.key;
    return '<a class="vsw-item' + (active ? ' active' : '') + '" href="' + v.file + '">' +
      '<span class="vsw-num">' + (i + 1) + '</span>' +
      '<span class="vsw-txt"><b>' + v.label + '</b><span>' + v.desc + '</span></span>' +
      (active ? '<span class="vsw-badge">Atual</span>' : '') +
      '</a>';
  }).join('');
  overlay.innerHTML =
    '<div id="vsw-panel" role="dialog" aria-label="Seletor de versão">' +
      '<div id="vsw-head"><div><h3>Versões do site</h3><div class="sub">Oliveira · apresentação</div></div>' +
        '<button id="vsw-close" aria-label="Fechar">&times;</button></div>' +
      '<div id="vsw-list">' + items + '</div>' +
      '<div id="vsw-foot">Clique em uma versão acima para visualizá-la</div>' +
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
      // abrir/fechar
      if (e.key === '`' || (e.shiftKey && (e.key === 'V' || e.key === 'v'))) {
        e.preventDefault(); toggle(); return;
      }
      if (e.key === 'Escape') { close(); return; }
      // 1-4 navega direto (só com o painel aberto, pra não atrapalhar)
      if (overlay.classList.contains('open') && e.key >= '1' && e.key <= String(VERSIONS.length)) {
        var v = VERSIONS[parseInt(e.key, 10) - 1];
        if (v && v.key !== current.key) location.href = v.file;
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
