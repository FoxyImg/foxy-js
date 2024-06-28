import fs from "fs";
import path from "node:path";

const indexFile = fs.readFileSync('./src/index.ts', 'utf8');

const regex = /(\/\/region\s+Manual\s+Exports(.*)\/\/endregion\s+Manual\s+Exports)/gms;
const m = regex.exec(indexFile);
let savedExports = "";
if (m.length > 0) {
	savedExports = m[1];
}

let lastDirectory = null;
const exportList = fs
	.readdirSync('./src/components', { withFileTypes: true, recursive: true })
	.filter((f) => !f.isDirectory() && f.name.endsWith('.vue'))
	.map((f) => {
		const baseName = path.basename(f.name, '.vue');
		let exportStr = `export {default as ${baseName}} from "${f.path.replace('src/', './')}/${f.name}";`;
		if (lastDirectory !== f.path && lastDirectory !== null) {
			exportStr = "\n"+exportStr;
		}

		lastDirectory = f.path;

		return exportStr;
	});

const allExports = exportList.join('\n');
fs.writeFileSync('./src/index.ts', `
${allExports}

${savedExports}
`);
