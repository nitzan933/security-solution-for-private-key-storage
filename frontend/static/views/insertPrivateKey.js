import abstract from "./abstract.js";

export default class extends abstract {
    constructor() {
        super();
        this.setTitle("Inset Private Key");
    }
    
    async getHtml() {
        return `
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <div id="box">
        <form id="myform-search" method="post" autocomplete="off">
        <h1>Insert Private Key <span>64 characters long</span></h1>
          <p>
            <input type="password" value="" placeholder="Enter your private key" id="p" name="p" class="password">
            <button class="unmask" type="button" id="unmask" onclick="handleUnmaskClick()"></button>
          </p>
          <p>     
          <p id="valid"></p>
          <button class="button" type="button" id="done" onclick="handleDoneClick()" >Done</button>
          </p>
        </form>
        </div>
          `;
        
    }
  

}

//E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262


