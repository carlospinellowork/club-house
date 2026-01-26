````markdown
# ClubHouse FC - Comunidade do Clube

O ClubHouse FC é um projeto que criei para praticar a construção de uma aplicação fullstack moderna,
simulando uma plataforma de comunidade para sócios de um clube.

O foco foi trabalhar com autenticação, organização de dados, validações e comunicação type-safe entre frontend e backend.

## Características

- Autenticação com e-mail e senha
- Cadastro de novos sócios
- Listagem de sócios
- Detalhes de um sócio
- Busca por sócios
- Interface responsiva com Tailwind CSS
- Validação de formulários com Zod
- Gerenciamento de estado e cache com React Query
- Comunicação com backend via TRPC

## Tecnologias

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma
- Zod
- React Query
- TRPC
- Lucide Icons
- framer-motion

## Pré-requisitos

- Node.js >= 18
- npm ou yarn
- Banco de dados PostgreSQL

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/clubhouse-fc.git
````

2. Entre na pasta do projeto:

```bash
cd clubhouse-fc
```

3. Instale as dependências:

```bash
npm install
# ou
yarn install
```

4. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env`:
     ```bash
     cp .env.example .env
     ```
   - Ajuste as variáveis no arquivo `.env`:
     - `DATABASE_URL`: URL de conexão com seu banco de dados PostgreSQL.
     - `BETTER_AUTH_SECRET`: Segredo para autenticação (gere um com `npx auth secret`).
     - `BETTER_AUTH_URL`: URL base da aplicação (ex: `http://localhost:3000`).

5. Rode as migrações do Prisma:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npm run seed
   ```

## Rodando o projeto

Para rodar o projeto em modo de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000).

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
