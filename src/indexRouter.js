const { error } = require('console');
const express = require('express');
const http = require('http');
const wallet = require('./etherWallet.js')
const alg = require('./alg.js')
const { Router } = express;
const router = new Router();
const {validatorsMap, tempParts, sendToServer, handleSetResponse,handleGetResponse} = require('./utils.js');
//const tempParts = require('./utils.js');
const dgram = require('dgram');
const crypto = require('crypto');
const { encrypt, decrypt, stringToCipherKey,encryptionKey,iv } = require('./cryptoFunc.js');
const headerGet = "get";
const headerSet = "set"

const blocks = alg.blocks;

// Create a UDP socket for the client
const client = dgram.createSocket('udp4');

// Define the server address and port
var serverPort = 6000;
var isPrivateKey = false;
const serverAddress = '127.0.0.1'; // Replace with the server's IP address or hostname

/**

Function: dividePkToBlocks

Description: Divides the private key into blocks for further processing.

@param {Object} req - The request object containing the private key in the body.

@param {Object} res - The response object to send the HTTP response.
**/
const dividePkToBlocks = (req,res) => {

    var privateKey = req.body.privateKey;
    if(privateKey == undefined){
        console.log("still undefined");
        return;
    }
    
   alg.dividePkToBlocks(privateKey)

    putParty();
    privateKey = ""
    isPrivateKey = true;

    res.status(200).json({status: "success"})

    
 }

 /**

Function: putParty
Description: 
         It iterates over the validatorsMap, encrypts the party data,
         and sends it to the corresponding server using the sendToServer function.
         Finally, it handles the response from the server using the handleSetResponse function.
*/

const putParty = () => {

   var k = 0;
    validatorsMap.forEach((value, key) => {
        serverPort = value;
        party = blocks.at(k);
        console.log(party);
        console.log(encryptionKey)
        const encrypted = encrypt(party,encryptionKey,iv)
        var data = headerSet + encrypted;
        //var port = value;

        sendToServer(client,data, serverPort, serverAddress)
        
        k++;
    });

    handleSetResponse(client)

}


/**

Function: getParties
Description: Sends a request to retrieve party data from a server with the specified port.
         It creates a data variable containing the headerGet value.
         Then it calls the sendToServer function to send the request to the server.
         The function returns the result of the sendToServer function, which is a Promise.
@param {number} port - The port number of the server to retrieve the party data from.
@returns {Promise} - A Promise representing the result of the sendToServer function.
*/
const getParties = (port) => {
    var data = headerGet;
    return sendToServer(client,data, port, serverAddress)


}


/**

Function: makeNewTransaction

Description: Executes a new transaction using the provided details.
         It retrieves the sender's public key, amount to transfer, and recipient's public key from the request body.
         Checks if the private key is available in the system, and returns an error if it is not.
         Retrieves the balance of the sender's wallet and checks if it is sufficient for the transaction.
         Iterates over the validatorsMap to retrieve party data from each server.
         Combines the retrieved private key parts using the combineKey function.
         Decrypts and combines the individual parts of the private key to reconstruct the full private key.
         Sends the transaction using the sendTransaction function.
         Updates the balance of the sender's wallet and sends a success response if the transaction is executed successfully.
         Handles any errors that occur during the process and sends an appropriate error response.
@param {Object} req - The request object containing the sender's public key, amount to transfer, and recipient's public key.

@param {Object} res - The response object to send the HTTP response.
*/
const makeNewTransaction = async(req,res) => {
    var pk = ""
    const publicKey = req.body.senderPublicKey;
    const amountToTransfer = parseInt(req.body.amount,10);
    const RecipientPublicKey = req.body.RecipientPublicKey;
    if(isPrivateKey == false){
        res.status(200).json({status: "no private key in the system"})
        return;
    }
    const balance = wallet.getBalance(publicKey)
    .then(async(balance) => {
      //  console.log(balace)
        if(balance < amountToTransfer){
            console.log("not enough ETH to transfer")
            res.status(200).json({status: "not enough money"})
        }
        if(balance >= amountToTransfer){
            console.log(validatorsMap.size)
            for(i = 0 ; i < validatorsMap.size ; ){
                console.log(i)
                await getParties(validatorsMap.get(i));
                i = i+2
            }
            await handleGetResponse(client,1000, 8);
    
            result = await combineKey()
            if(result == false){
                res.status(200).json({status : "couldnt combine private key"});
            }
            for(i = 0 , j = 0; i < tempParts.size && j < 15 ; i++){
            // console.log("inside loop")
                //part = tempParts.get(j)
                if(tempParts.has(j) == false){
                    part1 = decrypt(tempParts.get(j-1),encryptionKey,iv)
                    part2 = decrypt(tempParts.get(j+1),encryptionKey,iv)
                    part = part1.substring(4)+part2.substring(0,4)
                    console.log("part = " + part)
                    //tempParts.set((validatorsMap.get(j))%100, part)
                }
                else{
                    part = decrypt(tempParts.get(j),encryptionKey,iv)
                }
                pk = pk + part
                j = j +2
            }
            tempParts.clear()
            try{
            await sendTransaction(pk,publicKey,amountToTransfer,RecipientPublicKey)
            pk = ""
            const newBalance = wallet.getBalance(publicKey)
            .then((newBalance) => {
                console.log(`${publicKey} balance = ${newBalance}`);
              });

                res.status(200).json({ status : "The transaction has been executed successfully" });
            } catch (error) {
              console.error(error);
          
              // Send an error response
              res.status(200).json({ status: 'An error occurred = couldnt complete the transaction' });
            }
        }
    })

    .catch((error) => {
        res.status(200).json({status: "something went wrong - could not get balance"})
        console.log("something went wrong - could not get balance")
        console.log(error)
    })
    
    
    
}

/**

Function: combineKey

Description: 
         Checks for missing parts and retrieves them from the corresponding servers.
         Handles the response received for missing parts.
         Combines the retrieved private key parts to reconstruct the full private key.
@returns {boolean} - Returns true if the private key is successfully combined, false otherwise.
*/
const combineKey = async() => {
    const missingParts = new Set();

    if(tempParts.size < 8){
        key = 0
        for(i = 0 ; i < 8 ; i++){
            if(tempParts.has(key) == false){
                missingParts.add(validatorsMap.get((key-1) % 16))
                missingParts.add(validatorsMap.get((key+1) % 16))
            }
            key = key + 2;
        }
        console.log(missingParts)

        for (const port of missingParts) {
            await getParties(port)
            await handleGetResponse(client,1000,1)
        }
        
        key = 0 
        for(i = 0 ; i < 8 ; i++){
            if(tempParts.has(key) == false){
                if(tempParts.has(key-1) == false || tempParts.get(key+1) == false){
                    console.log("couldnt combine private key")
                    return false;
                }
                else{
                  //  console.log("inside else")
                   // part = tempParts.get(key-1).substring(3)+tempParts.get(key+1).substring(0,4)
                   // tempParts.set((validatorsMap.get(key))%100, part)
                }
            }
            key = key + 2;
        }
    }

    return true;


}
/**

Function: sendTransaction
Description: Sends a transaction using the provided private key, sender's public key,
         recipient's public key, and the amount to transfer.
@param {string} pk - The private key used to sign the transaction.
@param {string} publicKey - The public key of the sender.
@param {string} RecipientPublicKey - The public key of the recipient.
@param {number} amount - The amount of cryptocurrency to transfer.
*/
const sendTransaction = async(pk,publicKey,amount,RecipientPublicKey) => {
    await wallet.send(pk,publicKey,RecipientPublicKey,amount)

}


/**

Function: getBalance

Description: Retrieves the balance of a specified public key from the wallet.

@param {Object} req - The request object containing the public key.

@param {Object} res - The response object to send the balance as a response.
*/

const getBalance = async (req, res) => {
    const publicKey = req.body.publicKey;
    try {
      const balance = await wallet.getBalance(publicKey);
      console.log(`${publicKey} balance = ${balance}`);
  
      // Send the balance as a response
      res.status(200).json({ balance : balance });
    } catch (error) {
      console.error(error);
  
      // Send an error response
      res.status(500).json({ error: 'An error occurred' });
    }
  };
  

router.post("/insertPrivateKey",dividePkToBlocks);
router.post("/makeNewTransaction",makeNewTransaction);
router.post("/getBalance",getBalance);
//dividePkToBlocks

users = [];

router.post("/createUser", (req,res) => {
    const { user } = req.body;
    console.log(users);
    users.push({userName: user.userName, password: user.password})
    res.json({loggedIn : true, status: "ok"});
});

module.exports = router;
