# ForumApp

Aplicação web de fórum de perguntas e respostas com back-end em Node.js + Express + TypeScript e front-end em Vue 3 + Vite + TypeScript.

## Estrutura de diretórios

```
.
├── client
│   ├── src
│   │   ├── pages
│   │   ├── services
│   │   ├── App.vue
│   │   ├── main.ts
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── server
    ├── src
    │   ├── db.ts
    │   └── index.ts
    ├── data
    ├── package.json
    └── tsconfig.json
```

## Funcionalidades

- Adicionar, listar e excluir perguntas.
- Acessar respostas em página separada.
- Responder e excluir respostas.
- Base de dados SQLite com tabelas `tb_user`, `tb_question`, `tb_answer`.

## Como rodar o projeto localmente

### 1) Back-end

```bash
cd server
npm install
npm run dev
```

O servidor ficará disponível em `http://localhost:3001`.

### 2) Front-end

Em outro terminal:

```bash
cd client
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

## Fluxo da aplicação

1. Na página inicial, cadastre uma nova pergunta com título, descrição e autor.
2. A lista mostra título, autor e data/hora, com ações de excluir ou acessar respostas.
3. Na página de respostas, é possível ver detalhes da pergunta, responder e excluir respostas.
