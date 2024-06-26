import fs from "fs";
import path from "node:path";

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

fs.writeFileSync('./src/index.ts', exportList.join('\n'));
