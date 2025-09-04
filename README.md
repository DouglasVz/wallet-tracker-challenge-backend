# Blockchain Portfolio Backend

This is the backend API for the Blockchain Portfolio project, built with [NestJS](https://nestjs.com). It provides authentication, wallet management, and blockchain integration for the frontend application.

---

## Project Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Create a `.env` file in the root directory.
   - Copy the variables from `.env.example` and fill in your values.

---

## Compile and Run the Project

```bash
# Development mode
npm run start

# Watch mode (auto-restart on changes)
npm run start:dev

# Production mode
npm run start:prod
```

By default, the server runs on port **4000**.  
To change the port, update the `PORT` variable in your `.env` file.

---

## Create a MySQL Database

1. Set up a new database using your preferred SQL database manager (e.g., MySQL Workbench, phpMyAdmin, DBeaver).
2. Copy your database credentials (host, port, username, password, database name) into the corresponding variables in your `.env` file.

---

## Migrate the Database Schema

You can manage and migrate your database schema using TypeORM migrations:

1. **Generate a migration:**  
  Replace `migration_name` with a descriptive name for your migration.
  
  ```bash
  npm run migration:generate --name=migration_name
  ```

2. **Run the generated migration:**  
  This will apply the migration and create/update tables based on your `*.entity.ts` files.

  ```bash
  npm run migration:run
  ```

After running the migration, your database tables will be created according to the entity definitions in your project.

---

## API Documentation & Testing (Swagger)

You can test and explore the API endpoints using Swagger UI:

- Visit [http://localhost:4000](http://localhost:4000) in your browser.

**Steps to test endpoints:**
1. Register a user via the `/auth/register` endpoint.
2. Log in with your credentials at `/auth/login` to retrieve an access token.
3. Click the 'Authorize' button (or lock icon) in Swagger UI and paste your access token.
4. If your token expires, log in again to get a new one.

---

## Deployment

For production deployment, review the official [NestJS deployment documentation](https://docs.nestjs.com/deployment).

You can also deploy to AWS using [NestJS Mau](https://mau.nestjs.com):

```bash
npm install -g @nestjs/mau
mau deploy
```

---

## Support

NestJS is an MIT-licensed open source project.  
Support the project and join the community of sponsors and backers: [Learn more](https://docs.nestjs.com/support).

---
