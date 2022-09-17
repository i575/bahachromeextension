const { Command } = require('commander')
const { execSync } = require('node:child_process')
const eb = require('esbuild')
const path = require('path')
const fs = require('fs-extra')
const fg = require('fast-glob')

const program = new Command()

program
	.name('deploy-recipe-dev')
	.description('dev build script')
	.requiredOption('-f, --floor <floor>', '請選擇樓層(F)')
	.requiredOption(
		'-tcs, --tailwindcss-contents <filenamesString>',
		'請輸入要檢測的 config content',
	)

program.parse(process.argv)

const opts = program.opts()
const { floor } = opts
const tailwindcssContents = opts.tailwindcssContents.split(',')
const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

const rootPath = process.cwd()
const projectName = `${floor}f`
const projectPath = path.resolve(rootPath, projectName)
const tailwindConfigPath = path.resolve(rootPath, 'tailwind.config.js')
const distTailwindConfigsPath = path.resolve(
	rootPath,
	'deploy-recipe/tailwindcss/dist-configs',
)

const log = (key, value) => {
	console.log('')
	console.log(key)
	console.log(value)
}

void (async function () {
	const files = await fg(['**/*.(j|t)s', '!dist'], {
		cwd: projectPath,
		dot: true,
	})
	const entryPoints = files.map(file => path.resolve(projectPath, file))
	const outdir = path.resolve(projectPath, `dist`)

	log('floor', floor)
	log('tailwindcssContents', tailwindcssContents)
	log('outdir', outdir)
	log('entryPoints', entryPoints)

	await fs.remove(outdir)
	await fs.remove(distTailwindConfigsPath)
	await fs.copy(
		path.resolve(rootPath, 'public'),
		path.resolve(outdir, 'public'),
	)
	await fs.copy(
		path.resolve(projectPath, 'manifest.json'),
		path.resolve(outdir, 'manifest.json'),
	)
	await fs.copy(
		path.resolve(projectPath, 'popup.html'),
		path.resolve(outdir, 'popup.html'),
	)

	await eb
		.build({
			entryPoints,
			bundle: true,
			minify: isProd,
			sourcemap: isDev,
			outdir,
			platform: 'browser',
			watch: isDev,
			loader: {
				'.html': 'text',
			},
			define: {},
		})
		.catch(error => {
			console.log(error)
			process.exit(1)
		})
	console.log('esbuild watching...')

	const tailwindcssCilWatch = isProd ? '-w' : ''
	const tailwindcssCilMinify = isProd ? '--minify' : ''
	for (let i = 0; i < tailwindcssContents.length; i++) {
		const content = tailwindcssContents[i]
		const noExtContent = content.replace(/\.\w+/, '')
		const distContent = `./${projectName}/dist/${content}`

		try {
			const tailwindConfigContent = (
				await fs.readFile(tailwindConfigPath, 'utf-8')
			)
				.replace('BUILD_TW_CONTENT', `['${distContent}']`)
				.replace(/require\('.*rem2px'\)/, "require('../rem2px')")
			const tailwindConfigFileName = `tailwind-${noExtContent}.config.js`
			const configOutPath = `${distTailwindConfigsPath}/${tailwindConfigFileName}`
			const outCssFilePath = path.resolve(outdir, `${noExtContent}.css`)

			await fs.outputFile(configOutPath, tailwindConfigContent)

			execSync(
				`tailwindcss -i ./tailwind.css -c ${configOutPath} -o ${outCssFilePath} ${tailwindcssCilWatch} ${tailwindcssCilMinify}`,
			)

			console.log(`${tailwindConfigFileName} watching...`)
		} catch (error) {
			console.log(error)
			process.exit(1)
		}
	}
})()
