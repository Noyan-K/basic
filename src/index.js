import mysql from 'mysql2/promise';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { DatabaseService } from './services/database.service.js';
import { EmailService } from './services/email.service.js';
import { RepositoryService } from './services/repository.service.js';
import { UserService } from './services/user.service.js';
import { PostUsersController } from './controllers/post-users.controller.js';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || '3306',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'main',
  waitForConnections: true,
  connectionLimit: process.env.MYSQL_CONNECTION_LIMIT || 100,
  queueLimit: 0,
});

const databaseService = new DatabaseService(pool);
const emailService = new EmailService();
const repositoryService = new RepositoryService({
  databaseService,
});

const app = new Koa();

app.use(bodyParser({
  extendTypes: {
    json: ['application/x-javascript'],
  },
}));
app.use(async (ctx, next) => {
  ctx.userService = new UserService({
    repositoryService,
    emailService,
  });

  return next();
});
app.use(PostUsersController);

export const httpServer = app.listen(process.env.PORT || '4000');
httpServer.on('close', async () => {
  await pool.end();
});
