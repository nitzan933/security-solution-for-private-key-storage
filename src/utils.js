const validatorsMap = new Map();
const STARTPORT = 6000;
validatorsMap.set(0,STARTPORT);
validatorsMap.set(1,STARTPORT + 1);
validatorsMap.set(2,STARTPORT + 2);
validatorsMap.set(3,STARTPORT + 3);
validatorsMap.set(4,STARTPORT + 4);
validatorsMap.set(5,STARTPORT + 5);
validatorsMap.set(6,STARTPORT + 6);
validatorsMap.set(7,STARTPORT + 7);
validatorsMap.set(8,STARTPORT + 8);
validatorsMap.set(9,STARTPORT + 9);
validatorsMap.set(10,STARTPORT + 10);
validatorsMap.set(11,STARTPORT + 11);
validatorsMap.set(12,STARTPORT + 12);
validatorsMap.set(13,STARTPORT + 13);
validatorsMap.set(14,STARTPORT + 14);
validatorsMap.set(15,STARTPORT + 15);

const tempParts = new Map();

/**

Function: sendToServer
Description: Sends a message to a server using a UDP client.
@param {UDP client} client - The UDP client used for sending the message.
@param {string} data - The data to be sent.
@param {number} serverPort - The port number of the server.
@param {string} serverAddress - The IP address or hostname of the server.
@returns {Promise} - A promise that resolves when the message is successfully sent or rejects with an error.
*/
const sendToServer = (client,data, serverPort, serverAddress) => {
    return new Promise((resolve, reject) => {
      client.send(data, serverPort, serverAddress, (err) => {
        if (err) {
          console.error('Error while sending message:', err);
          reject(err);
        } else {
          console.log(`Message sent to ${serverAddress}:${serverPort}`);
          resolve();
        }
      });
    });
  };


  /**

Function: handleSetResponse
Description: Handles the response from the server after sending a set request.
@param {UDP client} client - The UDP client used for receiving the response.
*/
const handleSetResponse = (client) => {
    // Handle the server's response
    client.on('message', (response, serverInfo) => {
        console.log(`Received response from ${serverInfo.address}:${serverInfo.port }: ${response}`);
    });
}

/**

Function: handleGetResponse
Description: Handles the response from the server after sending a get request. It listens for incoming messages from the server and stores the received responses in a temporary storage. The function resolves when all expected responses have been received or when the timeout duration is reached.
@param {UDP client} client - The UDP client used for receiving the response.
@param {number} timeoutDurationMs - The duration in milliseconds to wait for responses before timing out.
@param {number} expectedResponses - The number of expected responses.
@returns {Promise} - A promise that resolves when all expected responses have been received or when the timeout duration is reached.
*/
const handleGetResponse = (client,timeoutDurationMs,expectedResponses) => {
    var receivedResponses = 0
    return new Promise((resolve) => {
        client.on('message', (response, serverInfo) => {
            console.log(`Received response from ${serverInfo.address}:${serverInfo.port }: ${response}`);
            if(tempParts.has(serverInfo.port%100) == false){
                tempParts.set(serverInfo.port%100,String(response).substring(3));
                receivedResponses++;
                console.log(tempParts);
            }
        });

                // Set a timeout to resolve the promise if no new responses are received within the specified duration
        const timeoutId = setTimeout(() => {
            console.log('Timeout: No more responses received');
            resolve();
        }, timeoutDurationMs);
    
        // Clear the timeout and resolve the promise when all expected responses have been received
        const checkCompletion = () => {
            if (receivedResponses.size === expectedResponses) {
            clearTimeout(timeoutId);
            resolve();
            }
        };
    
        // Check completion initially and whenever a new response is received
        checkCompletion();

    });
}


module.exports = { validatorsMap, tempParts ,sendToServer,handleSetResponse, handleGetResponse};

