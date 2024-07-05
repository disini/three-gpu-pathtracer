import yargs from 'yargs';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import { exec } from 'child_process';

const excludeList = [
	'khronos-MetalRoughSpheres-LDR',
	'khronos-BoxInterleaved',
];

let totalTime = 0;
const SAMPLES = 64;
const argv = yargs( process.argv.slice( 2 ) )
	.usage( 'Usage: $0 <command> [options]' )
	.option( 'output-path', {
		describe: 'Output directory for the files.',
		alias: 'o',
		type: 'string',
		default: './screenshots/golden/',
	} )
	.option( 'scenario', {
		describe: 'The name of one scenario to run.',
		alias: 's',
		type: 'string'
	} )
	.option( 'headless', {
		describe: 'Whether to run in a headless mode.',
		alias: 'h',
		type: 'boolean',
		default: false
	} )
	.argv;

( async () => {

	const req = await fetch( 'https://raw.githubusercontent.com/google/model-viewer/master/packages/render-fidelity-tools/test/config.json' );
	const { scenarios } = await req.json();
	const folderPath = path.resolve( process.cwd(), argv[ 'output-path' ] );
	console.log( `Saving to "${ folderPath }"\n` );

	console.log( 'Running test page service' );
	exec( 'npm run start' );

	fs.mkdirSync( folderPath, { recursive: true } );

	try {

		if ( argv.scenario ) {

			const scenario = scenarios.find( s => s.name === argv.scenario );
			if ( ! scenario ) {

				console.error( `Scenario "${ argv.scenario }" does not exist.` );
				process.exit( 1 );

			} else {

				await saveScreenshot( scenario, folderPath );

			}

		} else {

			for ( const key in scenarios ) {

				const scenario = scenarios[ key ];
				if ( excludeList.includes( scenario.name ) ) {

					console.log( `Skipping ${ scenario.name }` );

				} else {

					console.log( `Rendering ${ scenario.name }` );
					await saveScreenshot( scenario, folderPath );

				}

			}

		}

		console.log( `\nTotal Time: ${ ( 1e-3 * totalTime ).toFixed( 2 ) }s` );
		process.exit( 0 );

	} catch ( e ) {

		console.error( e );
		process.exit( 1 );

	}

} )();

async function saveScreenshot( scenario, targetFolder ) {

	const name = scenario.name;
	const args = argv.headless ? [ '--use-gl=egl', '--headless' ] : [];
	const browser = await puppeteer.launch( {

		defaultViewport: null,
		args,
		headless: argv.headless,

	} );

	const page = await browser.newPage();

	await page.goto( `http://localhost:1234/viewerTest.html?hideUI=true&scale=1&tiles=4&samples=${ SAMPLES }#${ name }` );

	try {

		const startTime = performance.now();
		await page.evaluate( () => {

			return new Promise( ( resolve, reject ) => {

				const TIMEOUT = 240000;
				const handle = setTimeout( () => {

					reject( new Error( `Failed to render in ${ ( 1e-3 * TIMEOUT ).toFixed( 2 ) }s.` ) );

				}, TIMEOUT );

				self.addEventListener( 'render-complete', () => {

					clearTimeout( handle );
					resolve();

				}, { once: true } );

			} );

		} );

		const deltaTime = performance.now() - startTime;
		console.log( `\tin ${ ( 1e-3 * deltaTime ).toFixed( 2 ) }s` );
		totalTime += deltaTime;

	} catch ( e ) {

		console.error( e.message );
		await browser.close();
		return;

	}

	// https://stackoverflow.com/questions/11335460/how-do-i-parse-a-data-url-in-node
	// https://stackoverflow.com/questions/65914988/how-to-save-a-canvas-as-an-image-using-puppeteer
	const dataUrl = await page.evaluate( () => {

		const canvas = document.querySelector( 'canvas' );
		return canvas.toDataURL();

	} );

	const [ info, data ] = dataUrl.split( ',' );
	const [ , ext ] = info.match( /^data:.+\/(.+);base64/ );
	const buffer = Buffer.from( data, 'base64' );
	fs.writeFileSync( `${ targetFolder }/${ name }.${ ext }`, buffer );

	await browser.close();

}
