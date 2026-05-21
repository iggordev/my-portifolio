# Portfólio — Igor Vinicius

Versão melhorada do portfólio com animações interativas em HTML, CSS e JavaScript puro.

## Recursos

- Partículas no hero que reagem ao mouse
- Efeito de digitação nos cargos (Cloud, Dados, DevOps)
- Cards com inclinação 3D ao passar o mouse
- Botões magnéticos e efeito ripple ao clicar
- Animações ao rolar (reveal, barras de skill, linha da timeline)
- Barra de progresso do scroll
- Menu mobile
- Suporte a `prefers-reduced-motion`

## Como publicar no GitHub Pages

1. Copie os arquivos para o repositório [my-portifolio](https://github.com/iggordev/my-portifolio)
2. Estrutura esperada:

```
my-portifolio/
├── index.html
├── css/
│   └── style.css
└── js/
    └── main.js
```

3. Faça commit e push na branch `main`
4. O site ficará em: https://iggordev.github.io/my-portifolio/

## Desenvolvimento local

Abra `index.html` no navegador ou use um servidor simples:

```bash
npx serve .
```

## Personalizar

- **Telefone:** altere o `href` do botão Telefone em `index.html` (`tel:+55...`)
- **Números das skills:** ajuste `data-progress` em cada `.skill-bar span`
- **Cargos do typing:** edite o array `roles` em `js/main.js`
- **Contato:** telefone e LinkedIn na seção `#contato` em `index.html`
