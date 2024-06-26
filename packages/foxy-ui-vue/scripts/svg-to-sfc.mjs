import fs from "fs";
import path from "node:path";

const ucfirst = (word) => {
	return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

const properCase = (sentence, separator = ' ', join = ' ') => {
	return sentence
		.split(separator)
		.map((word) => ucfirst(word))
		.join(join);
};


const svgFiles = fs
	.readdirSync('./src/assets/icons', { withFileTypes: true })
	.filter((f) => !f.isDirectory() && f.name.endsWith('.svg'))
	.map((f) => f.name);

const exportsList = [];
for (const svgFile of svgFiles) {
	let templateTagName = properCase(path.basename(svgFile, '.svg'), '-', '') + 'Icon';
	templateTagName = templateTagName.replaceAll('IconIcon', 'Icon');

	const svg = fs.readFileSync(`./src/assets/icons/${svgFile}`, 'utf8');
	fs.writeFileSync(`./src/components/icons/${templateTagName}.vue`, `
<template>
	${svg}
</template>
`);

	exportsList.push(`export {default as ${templateTagName}} from "./components/icons/${templateTagName}.vue";`);
}

const exportLines = exportsList.join('\n');

const index = fs.readFileSync('./src/index.ts', 'utf8');

const regex = /(^\/\/\s*region\s*Icons\s*$).*(^\/\/\s*endregion\s*Icons\s*$)/gms;


const subst = `$1\n${exportLines}\n$2`;

// The substituted value will be contained in the result variable
const result = index.replace(regex, subst);

fs.writeFileSync('./src/index.ts', result);
