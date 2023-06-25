// Divide the private key into 16 smaller parts of 4 characters each
const crypto = require('crypto');

function devidePK (privateKey) {
  // Generate a random 64-character (256-bit) private key
  //const privateKey = crypto.randomBytes(32).toString('hex');
  const parts = [];
  for (let i = 0; i < 16; i++) {
    const start = i * 4;
    const end = start + 4;
    parts.push(privateKey.substring(start, end));
  }

  console.log(parts);

  // Divide the parts into 8-character blocks, with each block containing 2 parts
  const blocks = [];
  for (let i = 0; i < 15; i++) {
    const start = i;
    const end = start + 2;
    const block = parts.slice(start, end);
    blocks.push(block.join(''));
  }
  const block = parts[15] + parts[0];
  blocks.push(block);

  console.log(blocks);

  // Distribute the blocks across 16 servers, with each server storing two blocks
  const servers = [
    { name: 'server1', location: 'aws' },
    { name: 'server2', location: 'aws' },
    { name: 'server3', location: 'aws' },
    { name: 'server4', location: 'aws' },
    { name: 'server5', location: 'aws' },
    { name: 'server6', location: 'aws' },
    { name: 'server7', location: 'aws' },
    { name: 'server8', location: 'aws' },
    { name: 'server9', location: 'google' },
    { name: 'server10', location: 'google' },
    { name: 'server11', location: 'google' },
    { name: 'server12', location: 'google' },
    { name: 'server13', location: 'google' },
    { name: 'server14', location: 'google' },
    { name: 'server15', location: 'google' },
    { name: 'server16', location: 'google' },
  ];

  servers.forEach((server, index) => {
    const block1 = blocks[index];
    
    // Encrypt each block with a symmetric encryption algorithm (e.g., AES)
    const encrypted1 = encrypt(block1);

    // Send the encrypted blocks to the server
    sendToServer(server, encrypted1);
  });

  // Encrypt a block with a symmetric encryption algorithm (e.g., AES)
  function encrypt(block) {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(block, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encrypted, key: key.toString('hex'), iv: iv.toString('hex') };
  }

  // Send the encrypted blocks to the server
  function sendToServer(server, encrypted1) {
    console.log(`Sending blocks to ${server.name} (${server.location})`);
    console.log(`Block 1: ${encrypted1.encrypted}`);
    // console.log(`Block 2: ${encrypted2.encrypted}`);
    console.log(`Key 1: ${encrypted1.key}`);
    // console.log(`Key 2: ${encrypted2.key}`);
    console.log(`IV 1: ${encrypted1.iv}`);
    // console.log(`IV 2: ${encrypted2.iv}`);
  }
};

module.exports =  devidePK 
