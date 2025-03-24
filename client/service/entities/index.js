const express = require('express');
const { loadEntity, entities } = require('./loadEntity');

const router = express.Router();

router.get("/", (req, res) => {
  res.json(entities);
});

router.get("/:id", async (req, res) => {
	const entity = await loadEntity(req.params.id);
	res.send(entity.toString())
});

module.exports = router;