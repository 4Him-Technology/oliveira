# Oliveira — Serviços Médicos Integrados · Site (apresentação)

Site institucional one-page, **4 versões visuais** alternáveis por um **seletor oculto** (ideal para apresentar ao cliente e decidir a direção).

## Versões
| Arquivo | Versão | Estilo |
|---|---|---|
| `index.html` | **Premium** | Cinematográfica, foto full-bleed (padrão) |
| `clean.html` | **Clean** | Corporativa clara, cards |
| `tech.html` | **Tech** | Escura, aurora, vidro |
| `editorial.html` | **Editorial** | Serifada, premium 2 |

Todas usam fontes **Plus Jakarta Sans + Manrope** e accent **amarelo**.

## Seletor oculto (durante a apresentação)
- Abrir: tecla **`` ` ``** (crase) **ou** **Shift + V** — ou clicar no pontinho quase invisível no canto inferior esquerdo.
- Trocar: clicar na versão, ou teclas **1–4** com o painel aberto.
- Fechar: **Esc** ou clicar fora.

O cliente não vê o seletor; só você sabe o atalho.

## Publicar no GitHub Pages
1. Crie um repositório novo no GitHub (ex.: `oliveira-site`).
2. Suba **todo o conteúdo desta pasta** (`index.html`, os `.html`, `css/`, `js/`, `assets/`).
3. No repositório: **Settings → Pages → Branch: `main` / root → Save**.
4. Em ~1 min o site fica no ar em `https://SEU-USUARIO.github.io/oliveira-site/`.

> Alternativa sem GitHub: arraste esta pasta inteira em [app.netlify.com/drop](https://app.netlify.com/drop) para publicar na hora.

## Estrutura
```
index.html        clean.html  tech.html  editorial.html
css/              base, heroes, sections, clinic, premium2…
js/               app.js · engine.js · version-switcher.js
assets/           logos + ícone
```
