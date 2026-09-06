import { randomBytes } from 'node:crypto';
import { existsSync, copyFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp, hashPassword } from './app.mjs';
import { passwordError } from '../shared/validation.mjs';

const seed = fileURLToPath(new URL('./seed.json', import.meta.url));
const dataDirectory = process.env.LEARNICO_DATA_DIR
  || join(process.env.LOCALAPPDATA || join(homedir(), '.local', 'share'), 'Learnico', 'lab-10');
const database = join(dataDirectory, 'db.json');
mkdirSync(dataDirectory, { recursive: true });
if (!existsSync(database)) copyFileSync(seed, database);

const { app, db } = createApp(database);
if (!db.get('users').find({ role: 'admin' }).value()) {
  const password = process.env.LEARNICO_ADMIN_PASSWORD || 'Aa9!' + randomBytes(8).toString('hex');
  if (passwordError(password)) throw new Error('LEARNICO_ADMIN_PASSWORD does not meet the password rules.');
  db.get('users').push({ id: 'admin', nickname: 'LearnicoAdmin', email: 'admin@learnico.local', role: 'admin', passwordHash: hashPassword(password) }).write();
  console.log('Local demo administrator: admin@learnico.local');
  console.log('Initial password (save it now): ' + password);
}
const port = Number(process.env.LEARNICO_PORT ?? 3010);
const server = app.listen(port, '127.0.0.1', () => console.log('Lab 10: http://127.0.0.1:' + server.address().port + ' — data: ' + database));
