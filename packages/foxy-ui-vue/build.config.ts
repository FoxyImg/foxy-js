import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
	entries: [
		// *.vue -> *.vue
		{ builder: 'mkdist', input: './src',pattern: ['**/*.vue'], loaders: ['vue'] },
		{ builder: 'mkdist', input: './lib',pattern: ['**/*.js'], loaders: ['js'] },

		// *.ts -> *.js & *.cjs
		// plz keep `esm` after `cjs`
		{ builder: 'mkdist', input: './src', pattern: ['**/*.ts'], format: 'cjs', loaders: ['js'] },
		{ builder: 'mkdist', input: './src', pattern: ['**/*.ts'], format: 'esm', loaders: ['js'] },
	],
	clean: true,
	declaration: true,
	externals: ['vue']
})
