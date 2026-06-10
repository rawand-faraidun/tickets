import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: './src/index.ts',
	format: 'esm',
	outDir: './dist',
	clean: true,
	deps: {
		alwaysBundle: [/@tickets-project\/.*/],
		neverBundle: [/^@libsql\//, /^@prisma\/adapter-libsql$/, /^libsql$/]
	}
})
