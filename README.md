````markdown
# ClubHouse FC - Comunidade do Clube

Este é um projeto de uma plataforma social para sócios do ClubHouse FC, desenvolvido com Next.js, React e TypeScript.

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

## Implantação em Produção

Para subir o projeto para produção (ex: Vercel, Railway, Render), você precisará configurar as mesmas variáveis de ambiente no painel administrativo do provedor:

1. **Variáveis de Ambiente**:
   - `DATABASE_URL`: Deve apontar para o banco de dados PostgreSQL de produção.
   - `BETTER_AUTH_SECRET`: Gere um segredo forte (ex: `openssl rand -base64 32`).
   - `BETTER_AUTH_URL`: Deve ser a URL final do seu site (ex: `https://seu-dominio.com`).
   - `NEXT_PUBLIC_APP_URL`: Mesma URL acima.

2. **Dica para Vercel**:
   - O comando de build deve ser `next build`.
   - Certifique-se de que o Prisma instale o client corretamente durante o build (geralmente automático através do script `postinstall` se configurado, ou garantido pelo comando de build).

## Scripts úteis

* `dev` - Inicia o servidor de desenvolvimento
* `build` - Compila o projeto para produção
* `start` - Inicia o projeto em produção
* `prisma studio` - Abre o Prisma Studio para visualização do banco de dados

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`)
3. Faça commit das alterações (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.