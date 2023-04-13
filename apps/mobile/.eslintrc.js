module.exports = {
	extends: [require.resolve('@sd/config/eslint/reactNative.js')],
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: './tsconfig.json'
	},
	settings: {
		tailwindcss: {
			config: './tailwind.config.js',
			callees: ['cva', 'tw', `twStyle`],
			tags: ['tw', 'twStyle']
		}
	}
};
