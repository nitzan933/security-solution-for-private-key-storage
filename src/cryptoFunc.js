const crypto = require('crypto');

//const encryptionKey = crypto.randomBytes(32);
//const iv = crypto.randomBytes(16); // Generate a 128-bit IV
//console.log(encryptionKey) 


const encryptionKey = '0123456789abcdef0123456789abcdef';
const iv = '0123456789abcdef';

// Encryption function using AES algorithm
function encrypt(data, key, iv) {
  console.log(key)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encryptedData = cipher.update(data, 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  return encryptedData;
}

// Decryption function using AES algorithm
function decrypt(encryptedData, key, iv) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
}

// Convert a string to a crypto.CipherKey
function stringToCipherKey(keyString) {
    // Derive a Buffer from the key string
    const keyBuffer = Buffer.from(keyString, 'utf8');
  
    // Create a CipherKey from the Buffer
    const cipherKey = crypto.createCipheriv('aes-256-cbc', keyBuffer, null);
  
    // Return the CipherKey
    return cipherKey;
  }

module.exports = {encrypt,decrypt, stringToCipherKey, encryptionKey, iv}