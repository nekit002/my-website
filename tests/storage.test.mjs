import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

test('Writable data stays outside the website and the seed is preserved', async () => {
    const seed = fileURLToPath(new URL('../server/seed.json', import.meta.url));
  const source = seed;
  const before = readFileSync(source);
  const dataDirectory = mkdtempSync(join(tmpdir(), 'learnico-lab10-storage-'));
  const serverFile = fileURLToPath(new URL('../server/index.mjs', import.meta.url));
  const child = spawn(process.execPath, [serverFile], {
    env: { ...process.env, LEARNICO_DATA_DIR: dataDirectory, LEARNICO_PORT: '0' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  try {
    const port = await new Promise((resolve, reject) => {
      let output = '';
      const timeout = setTimeout(() => reject(new Error('Server did not start. ' + output)), 10000);
      child.stdout.on('data', chunk => {
        output += chunk;
        const match = output.match(/http:\/\/127\.0\.0\.1:(\d+)/);
        if (match) { clearTimeout(timeout); resolve(Number(match[1])); }
      });
      child.once('error', reject);
      child.once('exit', code => reject(new Error('Server exited with code ' + code + '. ' + output)));
    });
    const workingDatabase = join(dataDirectory, 'db.json');
    assert.deepEqual(JSON.parse(readFileSync(workingDatabase)).courses, JSON.parse(before).courses);
    const identity = randomUUID().slice(0, 8);
    const response = await fetch('http://127.0.0.1:' + port + '/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Storage', lastName: 'Tester', middleName: '',
        birthDate: '2000-01-01', phone: '+3752' + String(Date.now()).slice(-8),
        email: 'storage-' + identity + '@example.test', nickname: 'Storage' + identity,
        passwordMode: 'manual', password: 'Learnico9!Study', confirmPassword: 'Learnico9!Study',
        acceptedTerms: true
      })
    });
    assert.equal(response.status, 201);
    assert.equal(JSON.parse(readFileSync(workingDatabase)).users.length, JSON.parse(before).users.length + 2);
    assert.deepEqual(readFileSync(source), before);
  } finally {
    if (child.exitCode === null) {
      child.kill();
      await new Promise(resolve => child.once('exit', resolve));
    }
    assert.ok(dataDirectory.startsWith(join(tmpdir(), 'learnico-lab10-storage-')));
    rmSync(dataDirectory, { recursive: true, force: true });
  }
});
