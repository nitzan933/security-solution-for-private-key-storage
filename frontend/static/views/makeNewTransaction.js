import abstract from "./abstract.js";

export default class extends abstract {
    constructor() {
        super();
        this.setTitle("Make a Transaction");

    }
    async getHtml() {
        return `
        <div id="box">
            <form id="myform-search" method="post" autocomplete="off">
                <h1>Make a Transaction <span></span></h1>
                <p>
                <input type="text" value="" placeholder="Enter your Public Key" id="senderPublicKey" class="password">
                </p>
                <p>
                <input type="text" value="" placeholder="Enter recipient Public Key" id="RecipientPublicKey" class="password">
                </p>
                <p>
                <input type="text" value="" placeholder="Enter Amount" id="amount" class="password">
                </p><br>
                <p id="valid"></p>
                <button class="button" type="button" id="done" onClick = "handleNewTransaction()">Done</button>
            </form>
            </div>`;
        
    }
}