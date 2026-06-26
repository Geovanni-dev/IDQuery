<p align="right">
  <a href="README.md">🇺🇸 Read in English</a>
</p>

# 🛡️ IDQuery Blacklist

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"/>
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white"/>
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white"/>
</p>

> 💼 **Projeto Freelance** — Esta API foi desenvolvida originalmente para um cliente como um serviço de consulta para a comunidade de Mobile Legends, permitindo que jogadores verifiquem IDs de contas com histórico de roubo ou fraude antes de realizarem negociações. Para respeitar a confidencialidade do cliente e sua interface privada, separei este back-end e criei um front-end dedicado exclusivamente para o meu portfólio. Veja o projeto ao vivo em: [idquery.grdev.app.br](https://idquery.grdev.app.br)

---

## 🛠️ Tecnologias Utilizadas

**Back-end & Infraestrutura:**

- **Node.js + TypeScript** — Base sólida, tipada e escalável
- **Express** — Roteamento e middlewares da API
- **Prisma ORM** — Modelagem de dados e queries tipadas
- **Supabase (PostgreSQL)** — Banco de dados relacional em nuvem
- **Docker** — Containerização completa da aplicação para deploy padronizado
- **GitHub Actions** — Pipeline de CI/CD para build e deploy automatizados
- **ESLint + Prettier** — Análise estática e padronização consistente do estilo de código

---

## 📁 Estrutura do Projeto

```text
/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline de CI/CD
├── prisma/
│   ├── migrations/             # Histórico de migrations do banco
│   └── schema.prisma           # Definição dos modelos de dados
├── public/                     # Arquivos estáticos do front-end (servidos pelo Express)
├── src/
│   ├── IDs/
│   │   ├── controller/
│   │   │   └── idController.ts # Handlers das requisições
│   │   └── routes/
│   │       └── idRoutes.ts     # Definição das rotas
│   ├── lib/
│   │   └── prisma.ts           # Singleton do cliente Prisma
│   ├── middlewares/            # Middlewares customizados (rate limit, etc.)
│   ├── app.ts                  # Configuração do app Express
│   └── server.ts               # Entry point do servidor HTTP
├── .dockerignore
├── .editorconfig
├── .env.example
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── eslint.config.js
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── yarn.lock
```

---

## ⚙️ Funcionalidades e Segurança

- **CRUD Completo** — Rotas para busca, adição (individual e em massa) e exclusão de IDs
- **Proteção por Rate Limit** — Middleware customizado para evitar ataques de força bruta. Limite de 15 requisições por minuto; IPs que excedem sofrem cooldown automático de 5 minutos com status `429 Too Many Requests`
- **CORS Configurado** — Preparado para receber requisições apenas de origens específicas em produção
- **ESLint + Prettier** — Garante consistência no estilo de código e detecta erros comuns em tempo de desenvolvimento, com regras ajustadas para projetos TypeScript e Node.js

---

## 📍 Endpoints da API

| Método   | Rota        | Descrição                                                            |
| :------- | :---------- | :------------------------------------------------------------------- |
| `GET`    | `/ids/:id`  | Consulta se um ID específico está na base (Protegido por Rate Limit) |
| `POST`   | `/ids/add`  | Registra um novo ID no sistema                                       |
| `POST`   | `/ids/bulk` | Registra múltiplos IDs de uma vez (Carga em massa)                   |
| `DELETE` | `/ids/:id`  | Remove um ID do banco de dados                                       |

> 🔒 **Nota sobre Gerenciamento (Admin):** O front-end de administração desta aplicação é estritamente privado. Para testar o cadastro (`POST`) ou a exclusão (`DELETE`) de IDs localmente, utilize um client HTTP como **Postman**, **Insomnia** ou **Bruno**.

---

## ⚙️ CI/CD com GitHub Actions

O projeto utiliza **GitHub Actions** para automatizar o processo de build e deploy a cada push na branch `main`.

**Fluxo do pipeline:**

1. **Build e Push** — a imagem Docker é construída e enviada automaticamente para o Docker Hub
2. **Deploy** — via SSH, o servidor puxa a nova imagem e recria o container na VPS

**Secrets necessários no repositório:**

| Secret               | Descrição                     |
| -------------------- | ----------------------------- |
| `DOCKERHUB_USERNAME` | Seu usuário no Docker Hub     |
| `DOCKERHUB_TOKEN`    | Token de acesso do Docker Hub |
| `SSH_HOST`           | IP público da VPS             |
| `SSH_USER`           | Usuário SSH da VPS            |
| `SSH_KEY`            | Chave privada SSH completa    |

---

## 🚀 Como rodar o projeto localmente

**1. Clone o repositório:**

```bash
git clone https://github.com/Geovanni-dev/IDQuery.git
cd IDQuery
```

**2. Configure as Variáveis de Ambiente:**

Crie um arquivo `.env` baseado no `.env.example`:

```env
DATABASE_URL="postgresql://usuario:senha@host.supabase.co:5432/postgres"
PORT=3333
```

**3. Suba o container com Docker:**

```bash
docker compose up -d --build
```

---

## 🌐 Deploy

O projeto é hospedado em uma **VPS** com deploy contínuo via **GitHub Actions**. A cada push na branch `main` a imagem é reconstruída, enviada ao Docker Hub e o container é atualizado automaticamente no servidor.

---

## 📄 Licença

**MIT © Geovani Rodrigues**
