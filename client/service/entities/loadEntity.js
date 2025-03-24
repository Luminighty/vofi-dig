const { globSync } = require('glob');
const path = require('path');
const fs = require('fs');
const util = require('util');

const entityMap = (() => {
	const directoryPath = '../../assets';
	const pattern = path.join(__dirname, directoryPath, "**", "**.entity.xml");
  const files = globSync(pattern, {
		windowsPathsNoEscape: true,
		nodir: true,
	});
	const entities = {};
	for (const file of files) {
		entities[path.basename(file, ".entity.xml")] = file;
	}
	return entities;
})();

const entities = Object.keys(entityMap);

async function loadEntity(id) {
	return util.promisify(fs.readFile)(entityMap[id]);
}

module.exports = { loadEntity, entities };