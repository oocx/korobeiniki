const packageLock = require('./package-lock.json');
const crypto = require('crypto');
const fs = require('fs');

delete packageLock.version;
const sha256 = crypto.createHash('sha256');
sha256.update(JSON.stringify(packageLock));
fs.writeFileSync('package-lock.hash', sha256.digest('hex'));

