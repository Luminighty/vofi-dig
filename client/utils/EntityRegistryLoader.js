// eslint-disable-next-line @typescript-eslint/no-var-requires
const { globSync } = require("glob");

const generateFile = (text) => `
import { loadEntityBlueprint } from ".";

export async function registerEntityBlueprints() {
	${text}
}
`;

const generateLine = (path) => `await loadEntityBlueprint("${path}");`;

module.exports = function () {
  const options = this.getOptions();

	const files = globSync(`${options.dir}/${options.path ?? "./assets"}/**/*.entity.xml`, {
		windowsPathsNoEscape: true,
	});
	const file = files
		.map((fileName) => fileName.slice(options.dir.length + 1))
		.map((fileName) => fileName.replaceAll("\\", "/"))
		.map((fileName) => {
			this.addDependency(`${options.dir}/${options.path}/${fileName}`);
			return fileName;
		})
		.map(generateLine)
		.join("\n");
		
	console.log(`Generated registry for ${files.length} entity blueprints.`);
	return generateFile(file);
}