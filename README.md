# Oliveira — Serviços Médicos Integrados

Landing page institucional da **Oliveira** — telemedicina, saúde ocupacional, laudos online e comodato/locação de equipamentos médicos.

Site estático (HTML/CSS/JS vanilla), publicado via **GitHub Pages**. Página única (versão **Fusion**).

## Estrutura

```
index.html          Página única (landing page — versão Fusion)
css/base.css        Base do design system (tokens, reset, tipografia)
css/heroes.css      Estilos das seções de hero
css/sections.css    Estilos das demais seções
css/fusion.css      Camada específica da versão Fusion (layout/acento)
js/app.js           Engine de reveal (IntersectionObserver) + stagger
js/fusion.js        Comportamentos da versão Fusion
assets/             Logos (mark.png, logo-teal.png, logo-white-hc.png)
.nojekyll           Desativa o Jekyll no GitHub Pages (serve os arquivos como estão)
```

## Publicação

Push na branch `main` → o GitHub Pages reconstrói automaticamente.
URL: `https://4him-technology.github.io/oliveira/`

> O site da **Doutor Safety** foi movido para um repositório próprio: [`4Him-Technology/Doutor-Safety`](https://github.com/4Him-Technology/Doutor-Safety).
