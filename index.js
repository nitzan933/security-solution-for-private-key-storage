const express = require("express");
const app = express();
app.use(express.json());
const dgram = require('dgram');
var crypto = require('crypto');
const pass = "hello";
const auth = "itisok";
var party = "";


//var name = 'braitsch';
//var hash = crypto.createHash('md5').update(name).digest('hex');
//console.log(hash); // 9b74c9897bac770ffc029102a200c5de



var port = 6000;
const address = '127.0.0.1'; // Use '0.0.0.0' to listen on all available network interfaces

process.on('message', (config) => {
    port = config;
    server.bind(config, address, () => {
        console.log(`UDP server is listening on ${address}:${config}`);
      });
  });

  
// Create a UDP server
const server = dgram.createSocket('udp4');

// Handle incoming messages
server.on('message', (message, remoteInfo) => {
//  console.log(`Received message from ${remoteInfo.address}:${remoteInfo.port}: ${message}`);
  const str = message.toString('utf8');
  //console.log(str.substring(0,3));
  if(str.substring(0,3) == "get"){
    // Sending a response back to the client
    //const party = str.substring(4);
   // console.log(party);
    sendMsg(party,remoteInfo,str.substring(0,3));
  }
  else if (str.substring(0,3) == "set"){
    party = str.substring(3);
   // console.log(party);
    sendMsg("ok",remoteInfo,str.substring(0,3));
  }

  

});

const sendMsg = (res,remoteInfo,header) => {
 // console.log("res is : " + res);
    const response = header + res;
    const buffer = Buffer.from(response, 'utf8');
    server.send(buffer, 0, buffer.length, remoteInfo.port, remoteInfo.address, (err) => {
        if (err) {
        console.error('Error while sending response:', err);
        } else {
      //  console.log('Response sent to the client ' + response);
        }
    });
}



// Listen for messages from the parent process
/*
process.on('message', (config) => {
    app.listen(config, () => {
        console.log("listening on port "+ config);
    });
  });
*/
/*
app.listen(6000, () => {
    console.log("listening on port "+ 6000);
});

app.get("/getParty", (req,res) => {
    res.json({party : party});
});

app.post("/putParty", (req,res) => {
    party = req.body.get;
    console.log(party);
    res.json({status : "ok"});
});

*/



