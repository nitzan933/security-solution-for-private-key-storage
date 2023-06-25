//const devidePK = require("../../project.js");

//devidePK('4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d');




const handleDoneClick = () => {
    var p = document.getElementById("p");
    if(p.value.length != 64){
      valid.innerHTML  = "Must be 64 characters long! ";
      return;
    } else {
        valid.innerHTML  = ''; 
    }

    const postData = {
      privateKey: p.value
    }
    
    fetch('http://localhost:5000/api/insertPrivateKey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({privateKey: p.value}),
      //mode: 'no-cors'
    }).then(function (response) {
      return response.json();
    })
    .then(function (data) {
      valid.innerHTML = data.status;
    })
    .catch(function (error) {
      console.log(error);
    });
    

};

const handleNewTransaction = () => {
  var senderPublicKey = document.getElementById("senderPublicKey");
  var RecipientPublicKey = document.getElementById("RecipientPublicKey");
  var amount = document.getElementById("amount");
  console.log(RecipientPublicKey.value)
  console.log(senderPublicKey.value)
  if(senderPublicKey.value.length != 40 || RecipientPublicKey.value.length != 40){
    valid.innerHTML  = "Not Valid public key ";
    return;
  } else {
      valid.innerHTML  = ''; 
  }

  if(amount.value <= 0){
    valid.innerHTML = "amount must be greater than zero";
    return;
  } else {
    valid.innerHTML  = ''; 
  }

  
  fetch('http://localhost:5000/api/makeNewTransaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({senderPublicKey: senderPublicKey.value , amount: amount.value, RecipientPublicKey: RecipientPublicKey.value}),
    //mode: 'no-cors'
  }).then(function (response) {
    return response.json();
  })
  .then(function (data) {
    valid.innerHTML = data.status
  })
  .catch(function (error) {
   // console.log(error);
    valid.innerHTML = error
  });
};

  const handleGetBalance = () => {
    var publicKey = document.getElementById("publicKey");
    if(publicKey.value == ""){
      result.innerHTML = "please enter public key"
      return
    }
    fetch('http://localhost:5000/api/getBalance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({publicKey: publicKey.value}),
      //mode: 'no-cors'
    }).then(function (response) {
      return response.json();
    })
    .then(function (data) {
      result.innerHTML = data.balance + " ETH";
    })
    .catch(function (error) {
      console.log(error);
    });
  };


const handleUnmaskClick= () => {  
    var p = document.getElementById("p");
    if (p.type === "password") {
        p.type = "text";
    }
    else {
        p.type = "password";
    }
  };



