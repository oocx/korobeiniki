const crypto = require('crypto');
const fs = require('fs');
const child_process = require('child_process');

const hashFileName = 'node_modules/package-lock.json.sha256';

function calculatePackageLockHash() {
    const hash = crypto.createHash('sha256');

    const buffer = fs.readFileSync('package-lock.json');
    hash.update(buffer);
    return hash.digest('hex');
}

function readExistingPackageLockHash() {
    if (!fs.existsSync(hashFileName)) {
        return null;
    }
    return fs.readFileSync(hashFileName, 'utf8');
}

function runNpmInstall() {
    child_process.execSync('npm install --no-optional --ignore-scripts');
}

function writePackageLockHash(hash) {
    fs.writeFileSync(hashFileName, hash);
}

const hash = calculatePackageLockHash();
const existing = readExistingPackageLockHash();

console.log(`package_lock.json hash: ${hash}, package_lock.json.sha256: ${existing}`);

if (hash !== existing) {
    console.log('hashes do not match, running npm install')
    runNpmInstall();
} else {
    console.log('hashes match, skipping npm install');
}
writePackageLockHash(hash);
