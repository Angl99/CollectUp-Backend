require('dotenv').config({ path: './.env.test' });
const { execSync } = require('child_process');

beforeAll(() => {
  execSync('node ./scripts/initTestDb.js', { stdio: 'inherit' });
});