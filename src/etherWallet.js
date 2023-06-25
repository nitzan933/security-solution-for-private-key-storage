const Web3 = require("web3")
const providerUrl = 'http://127.0.0.1:8545';
const web3 = new Web3(providerUrl);


/**

Function: getBalance
Description: Retrieves the balance of a specified public key from the blockchain.
@param {string} publicKey - The public key for which to retrieve the balance.
@returns {string} The balance in Ether for the specified public key.
*/
const getBalance = async(publicKey) => {
    const val = await web3.eth.getBalance(publicKey);
    let am = Web3.utils.fromWei(val, 'ether')
   // console.log(`${publicKey} balance = ${am}`)
    return am;
}
/**

Function: send
Description: Sends a transaction from one address to another on the blockchain.
@param {string} pk - The private key used to sign the transaction.
@param {string} from - The address sending the transaction.
@param {string} to - The address receiving the transaction.
@param {number} amount - The amount to send in Ether.
*/
const send = async (pk,from,to, amount) => {
    // convert amount to Wei
    let am = web3.utils.toWei(amount.toString(), 'ether')
    let gLimit = web3.utils.toHex(21000)
    let gPrice = web3.utils.toHex(web3.utils.toWei("1", "gwei"))
    // create transaction object
    var tx = {
        from: from,
        to: to,
        value: am,
        gas: gLimit,
        gasPrice: gPrice,
    }
    // sign transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, pk)
    // send to blockchain for execution
    let t = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    // print transaction hash
    console.log(t.transactionHash)
    
}


module.exports= { send, getBalance};