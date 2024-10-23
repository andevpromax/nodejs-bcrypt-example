import fs from 'fs/promises';
import promptSync from 'prompt-sync';
import passwordPrompt from 'password-prompt';

import bcrypt from 'bcrypt';

const prompt = promptSync();

const cmd = process.argv[2];

switch (cmd) {
  case 'store':
    store();
    break;
  case 'verify':
    verify();
    break;
}

async function saveCredentials(username, password) {
  await fs.writeFile('db.json', JSON.stringify([username, password]) + '\n');
}

async function readCredentials() {
  const content = await fs.readFile('db.json', { encoding: 'utf-8' });
  return JSON.parse(content);
}

async function store() {
  const username = prompt('Enter your username: ');
  const password = await passwordPrompt('Enter your password: ');

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  await saveCredentials(username, hashedPassword);
  console.log('Ok! Credentials saved!');
}

async function verify() {
  const username = prompt('Enter your username: ');
  const password = await passwordPrompt('Enter your password: ');
  const [storedUsername, storedPassword] = await readCredentials();

  const usernameMatched = username === storedUsername;
  const passwordMatched = await bcrypt.compare(password, storedPassword);

  if (usernameMatched && passwordMatched) {
    console.log('OK: Verification is successful!');
  } else {
    console.log('ERROR: Verification failed!');
  }
}
