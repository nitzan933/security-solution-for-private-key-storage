import abstract from "./abstract.js";

export default class extends abstract {
    constructor() {
        super();
        this.setTitle("Check Out Balance");

    }
    async getHtml() {
        return `
            <div id="box">
            <form id="myform-search" method="post" autocomplete="off">
                <h1>Check Out Balance </h1>
                <div >
                <p>
                <input type="text" value="" placeholder="Enter your Public Key" id="publicKey" class="password">
                </p>
                </div><br>
                <p id="valid"></p>
                <button class="button" type="button" id="done" onClick = "handleGetBalance()">Done</button><br>
                <br>
                <label class="total" id="result"></label>
            </form>
            </div>
        `;  
    }
}