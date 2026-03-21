/**
 * Generate Apple Sign in with Apple client secret (JWT) from .p8 key
 * Usage: TEAM_ID=xxx CLIENT_ID=xxx node scripts/generate-apple-client-secret.js
 * Or: node scripts/generate-apple-client-secret.js (will prompt for values)
 *
 * Required:
 * - TEAM_ID: Apple Developer Team ID
 * - CLIENT_ID: Service ID (e.g. com.hasaan.Rabbit) or App Bundle ID
 * - KEY_ID: From .p8 filename (e.g. 6A3AWT24B4)
 * - P8_PATH: Path to .p8 file (default: ./AuthKey_6A3AWT24B4.p8)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((r) => rl.question(q, r));

async function main() {
  let teamId = process.env.TEAM_ID;
  let clientId = process.env.CLIENT_ID;
  let keyId = process.env.KEY_ID || '6A3AWT24B4';
  let p8Path = process.env.P8_PATH || path.join(__dirname, '..', 'AuthKey_6A3AWT24B4.p8');

  if (!teamId) teamId = await ask('Team ID: ');
  if (!clientId) clientId = await ask('Client ID (Service ID / Bundle ID): ');
  rl.close();

  if (!teamId || !clientId) {
    console.error('TEAM_ID and CLIENT_ID are required.');
    process.exit(1);
  }

  if (!fs.existsSync(p8Path)) {
    console.error('P8 file not found at:', p8Path);
    process.exit(1);
  }

  const privateKey = fs.readFileSync(p8Path, 'utf8');

  try {
    const jwt = require('jsonwebtoken');
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: teamId,
      iat: now,
      exp: now + 60 * 60 * 24 * 180, // 6 months
      aud: 'https://appleid.apple.com',
      sub: clientId,
    };
    const token = jwt.sign(payload, privateKey, {
      algorithm: 'ES256',
      header: { kid: keyId, alg: 'ES256' },
    });
    console.log('\n--- Apple Client Secret (copy this) ---\n');
    console.log(token);
    console.log('\n--- Expires in 6 months. Regenerate before expiry. ---\n');
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      console.error('Run: yarn add jsonwebtoken');
      process.exit(1);
    }
    throw e;
  }
}

main();
