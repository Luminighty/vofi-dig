const express = require('express');
const router = express.Router();
const { loadEntity, entities } = require('./loadEntity');

router.get("/entity", (req, res) => {
  res.json(entities);
});

router.get("/entity/:id", async (req, res) => {
	const entity = await loadEntity(req.params.id);
	res.send(entity.toString())
});

module.exports = router;