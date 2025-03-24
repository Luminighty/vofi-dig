require("dotenv").config();
const path = require('path');
const express = require("express");
var cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const serviceRouter = require("./service");

app.use(cors())
app.set('trust proxy', true);

app.use(express.static(path.join(__dirname, './dist')));
app.use("/assets", serviceRouter);
app.use(express.static(path.join(__dirname, './assets')));


app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
