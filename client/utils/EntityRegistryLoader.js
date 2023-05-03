const { glob, globSync } = require("glob");

const generateFile = (text) => `
import { loadEntityBlueprint } from ".";

export async function registerEntityBlueprints() {
	${text}
}
`;

const generateLine = (path) => `await loadEntityBlueprint("${path}");`;

module.exports = function () {
  const options = this.getOptions();
  this.addDependency(`${options.dir}/${options.path}`);

	const files = globSync(`${options.dir}/${options.path ?? "./assets"}/**/*.entity.xml`, {
		windowsPathsNoEscape: true,
	});
	const file = files
		.map((fileName) => fileName.slice(options.dir.length + 1))
		.map((fileName) => fileName.replaceAll("\\", "/"))
		.map(generateLine)
		.join("\n");
	console.log(file);
	return generateFile(file);
}