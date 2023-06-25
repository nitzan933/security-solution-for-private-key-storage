const crypto = require('crypto');
const blocks = [];


/**

Function: dividePkToBlocks
Description: Divides a given private key into blocks for further processing. The private key is divided into 16 parts, each consisting of 4 characters. These parts are then grouped into blocks, where each block contains 2 parts. The resulting blocks are stored in the blocks array.
@param {string} privateKey - The private key to be divided into blocks.
*/
const dividePkToBlocks = (privateKey) => {
    // Generate a random 64-character (256-bit) private key
    //const privateKey = crypto.randomBytes(32).toString('hex');
    const parts = [];
    for (let i = 0; i < 16; i++) {
      const start = i * 4;
      const end = start + 4;
      parts.push(privateKey.substring(start, end));
    }
  
    //console.log(parts);
  
    // Divide the parts into 8-character blocks, with each block containing 2 parts
    for (let i = 0; i < 15; i++) {
      const start = i;
      const end = start + 2;
      const block = parts.slice(start, end);
      blocks.push(block.join(''));
    }
    const block = parts[15] + parts[0];
    blocks.push(block);
  
    console.log(blocks);
}

module.exports = {dividePkToBlocks, blocks};

