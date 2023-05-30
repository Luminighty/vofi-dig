const express = require('express');
const router = express.Router();

const EntityRouter = require("./entities");

router.use("/assets", EntityRouter);

module.exports = router;