#!/usr/bin/env node
import { Extractor } from './index';
import minimist from 'minimist';
import path from 'path';
import packageJson from '../package.json';

(async function main() {
    const argv = minimist(process.argv.slice(2), {
        string: ['config', 'output'],
        boolean: ['help', 'version'],
        alias: {
            c: 'config',
            o: 'output',
            h: 'help',
            v: 'version'
        }
    });
    if (argv.help) {
        console.log('Usage: rib [options]');
        console.log('Options:');
        console.log('  -c, --config <file>   Configuration file');
        console.log('  -o, --output <path>   Output path');
        console.log('  -h, --help            Show this help message');
        console.log('  -v, --version         Show version information');
        return;
    }
    if (argv.version) {
        console.log(`@themost/rib v${packageJson.version}`);
        return;
    }
    if (argv.config == null) {
        console.error('Error: Configuration file is required.');
        process.exit(1);
    }
    if (argv.output == null) {
        console.error('Error: Output path is required.');
    }
    // get configuration file
    const config = require(path.resolve(process.cwd(), argv.config));
    // initialize extractor
    const extractor = new Extractor(config);
    // export data to output path
    await extractor.export(argv.output);
    // close database connection
    extractor.db.closeAsync();
})().then(() => {
    console.log('Extraction completed successfully.');
}).catch((error) => {
    console.error('Error during extraction:', error.message);
    if (error.stack) {
        console.error(error.stack);
    }
    process.exit(1);
});