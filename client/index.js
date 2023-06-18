require("dotenv").config();
const path = require('path');
const express = require("express");
var cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const router = require("./routes");

app.use(cors())
app.set('trust proxy', true);

app.use(express.static(path.join(__dirname, './dist')));
app.use(router);
app.use(express.static(path.join(__dirname, './assets')));


app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
