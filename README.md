This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Project Setup Guideline

First, install and start the saleor application. Following the [URL](https://docs.saleor.io/docs/3.x/setup/docker-compose) to install through docker desktop.

After installed the saleor, create `.env.local` file at the root directory and add the following lines into file.
```Properties
SALEOR_API_URL=http://<API_URL>/graphql/
# API_URL mostly configured as
# localhost:8000
```

Finally, generate the required graphql document for typescript environment.
```bash
npm run generate:gql
```

## Database Migration

The first time to start up of the project or migration version has changes `MUST` execute the command to sync the local database.
```bash
npm run migration:run
```

Add new migration
```bash
npm run migration:generate --name={{migration_name}}
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.