// eslint-disable-next-line @typescript-eslint/no-var-requires
const { globSync } = require("glob");

const generateFile = (imports, registers) => `
import { registerComponent } from ".";
${imports}

export function registerComponents() {
	${registers}
}`;

const generateLine = (component) => `registerComponent(${component});`;
const generateImport = (component, path) => `import { ${component} } from "./${path}";`;

module.exports = function () {
  const options = this.getOptions();
  this.addDependency(`${options.dir}/${options.path}`);
	const folder = `${options.dir}/${options.path ?? "./src/components/"}`;
	const files = globSync(`${folder}/**/*.component.ts`, {
		windowsPathsNoEscape: true,
	});

	const components = files
		.map((fileName) => fileName.slice(options.dir.length + 1))
		.map((fileName) => fileName.replaceAll("\\", "/"))
		.map((fileName) => fileName.split("/"))
		.map((split) => split[split.length - 1])
		.map((fileName) => fileName.split(".")[0])
		.map((fileName) => `${fileName}Component`)
	
	const registers = components
		.map(generateLine)
		.join("\n");
	
	const imports = files
		.map((fileName) => fileName.slice(folder.length + 1))
		.map((fileName) => fileName.replaceAll("\\", "/"))
		.map((fileName) => fileName.split("."))
		.map((split) => {
			split.pop();
			return split.join(".")
		})
		.map((file, i) => generateImport(components[i], file))
		.join("\n");

	console.log(`Generated registry for ${components.length} components.`);
	return generateFile(imports, registers);
}