const express = require("express");
const app = express();
const indexRouter = require("./indexRouter"); 
const bodyParser = require("body-parser");
var cors = require("cors")

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/api",indexRouter);


app.listen(5000, () => {
    console.log("listening on port 5000");
});

