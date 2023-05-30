const express = require('express');
const router = express.Router();
const { globSync } = require('glob');
const path = require('path');

router.get("/entities", (req, res) => {
	const directoryPath = '../assets';
	const pattern = path.join(directoryPath, "**", "*.entity.xml");

	console.log(pattern);
  const files = globSync(pattern, {
		windowsPathsNoEscape: true,
		nodir: true,
	});
	const relativeFiles = files.map(file => path.relative(directoryPath, file));

	// Send the relative file names as a JSON response
	//res.json(relativeFiles);
  res.json(files);
});

module.exports = router;