## Getting Started

### Steps to run locally

1. Clone the project

```bash
git clone git@github.com:Lima08/Ativacaotec.git
```

2. Install dependencies

```bash
npm install
```

3. Rename the file `.env.example` to `.env` and then add the values to the variables

- Request this info with the dev team.

4. Create the database container

```bash
npm run create:container
```

5. Run migrations

```bash
npx prisma migrate dev
```

6. Open Prisma Studio

```bash
npx prisma studio
```

- 6.1 Create a company and copy its ID

- 6.2 Create an user with the copied company ID. And then set the **active** field to `TRUE` and the **role** one to `300`.

7. Start the app
