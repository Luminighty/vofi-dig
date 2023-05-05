/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();
const path = require('path');
const express = require("express");
var cors = require('cors');
const clientEnv = require("./clientEnv");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.set('trust proxy', true);

app.get("/env.js", clientEnv("DIG_"));
app.use(express.static(path.join(__dirname, './dist')));
app.use(express.static(path.join(__dirname, './assets')));


app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
