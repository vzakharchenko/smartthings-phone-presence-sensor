const NodeRSA = require('node-rsa');

function encryptPassword(password, n) {
  const key = new NodeRSA();
  key.setOptions({ environment: 'browser', encryptionScheme: 'pkcs1' });
  key.importKey({
    n: Buffer.from(n, 'hex'),
    e: 65537,
  }, 'components-public');
  return key.encrypt(password, 'hex');
}

module.exports.encryptPassword = encryptPassword;
