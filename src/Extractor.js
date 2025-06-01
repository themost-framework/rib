import { PostgreSQLDialect } from './dialects/PostgreSQLDialect';
import { mkdir, writeFile, stat } from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';
import { MySQLDialect } from './dialects/MySQLDialect';
import { TraceUtils } from '@themost/common';
import { SqliteDialect } from './dialects/SqliteDialect';
import child_process from 'child_process';
import util from 'util';
const execAsync = util.promisify(child_process.exec);

/**
 * 
 * @returns {import('@themost/common').TraceLogger}
 */
function createLogger() {
    if (typeof TraceUtils.newLogger === 'function') {
        return TraceUtils.newLogger();
    }
    const [loggerProperty] = Object.getOwnPropertySymbols(TraceUtils);
    const logger = TraceUtils[loggerProperty];
    const newLogger = Object.create(TraceUtils[loggerProperty]);
    newLogger.options = Object.assign({}, logger.options);
    return newLogger;
}

class Extractor {

    /**
     * @type {import('@themost/data').DataAdapter}
     */
    _db = null;

    /**
     * @param {import('./Extractor').ExtractorConfiguration} options 
     */
    constructor(options) {
        this.options = options;
        this.dialects = [
            new PostgreSQLDialect(),
            new MySQLDialect(),
            new SqliteDialect()
        ];
        this.logger = createLogger();
    }


    async init() {
        const cwd = path.resolve(process.cwd(), this.options.outDir || '.');
        const encoding = 'utf8';
        // eslint-disable-next-line no-unused-vars
        this.logger.info(`Initializing npm in ${cwd}`);
        await execAsync('npm init -y', {
            cwd,
            encoding
        });
        // get adapter types and try to install them
        const adapterTypes = this.options.adapterTypes || [];
        for (const adapterType of adapterTypes) {
            if (adapterType.type && typeof adapterType.type === 'string') {
                let lsJson;
                try {
                    const lsOut = await execAsync(`npm ls ${adapterType.type} --json`, {
                        cwd,
                        encoding
                    });
                    lsJson = JSON.parse(lsOut.stdout);
                } catch (err) {
                    if (err.code === 1) {
                        // npm ls command failed, probably the package is not installed
                        lsJson = JSON.parse(err.stdout);
                    } else {
                        throw err.stderr;
                    }
                }
                if (lsJson.dependencies && lsJson.dependencies[adapterType.type] && lsJson.dependencies[adapterType.type].version) {
                    this.logger.info(`Adapter type ${adapterType.type} is already installed.`);
                } else {
                    this.logger.info(`Installing adapter type ${adapterType.type}...`);
                    // install adapter type
                    try {
                        const installOut = await execAsync(`npm install ${adapterType.type} --json`, {
                            cwd,
                            encoding
                        });
                        const installJson = JSON.parse(installOut.stdout);
                        if (installJson && installJson.added) {
                            this.logger.info(`${installJson.added} package(s) added.`);
                        }
                        if (installJson && installJson.removed) {
                            this.logger.info(`${installJson.removed} package(s) removed.`);
                        }
                        if (installJson && installJson.changed) {
                            this.logger.info(`${installJson.changed} package(s) changed.`);
                        }
                        this.logger.info(`Adapter type ${adapterType.type} installed successfully.`);
                    } catch (err) {
                        const errorJson = JSON.parse(err.stdout);
                        const errorMessage = errorJson && errorJson.error ? errorJson.error.detail : err.message;
                        const formattedError = errorMessage.replace(/\n+/g, ' ').trim();
                        this.logger.error(`Failed to install adapter type ${adapterType.type}: ${formattedError}`);
                        throw formattedError;
                    }
                }
            }
        }
        
    }


    get parsers() {
        const parsers = this.options.parsers || [];
        return parsers.filter((parser) => {
            return parser != null && (typeof parser === 'function' || typeof parser === 'string');
        }).filter((parser) => {
            if (typeof parser === 'string' && parser.startsWith('-')) {
                return false; //exclude parsers that start with a hyphen
            }
            return true;
        }).map((parser) => {
            if (typeof parser === 'function') {
                return parser;
            }
            if (typeof parser === 'string') {
                const moduleOrClass = parser.split('#');
                if (moduleOrClass.length === 1) {
                    // assume that parser is a module
                    const ParserCtor = require(parser);
                    if (typeof ParserCtor === 'function') {
                        return ParserCtor;
                    }
                    throw new Error(`${parser} does not export a class.`);
                } else if (moduleOrClass.length === 2) {
                    // assume that parser is a class in a module
                    let [modulePath, memberName] = moduleOrClass;
                    if (modulePath === '@themost/rib') { // add exception for internal @themost/rib classes
                        modulePath = './index';
                    }
                    const module = require(modulePath);
                    const MemberCtor = module[memberName];
                    if (typeof MemberCtor === 'function') {
                        return MemberCtor;
                    }
                    throw new Error(`${modulePath} does not export a class named ${memberName}.`);
                }
            }
        });
    }

    /**
     * @type {import('@themost/data').DataAdapter}
     */
    get db() {
        if (this._db) {
            return this._db;
        }
        const adapter = this.options.adapters.find((item) => item.default === true);
        if (adapter == null) {
            throw new Error('Invalid configuration. The default database connection is missing.');
        }
        const adapterType = this.options.adapterTypes.find((item) => item.invariantName === adapter.invariantName);
        if (adapterType == null) {
            throw new Error('Invalid configuration. The default database connection type is missing.');
        }
        // resolve adapter module path using require.resolve
        const modulePath = require.resolve(adapterType.type, {
            paths: [
                path.resolve(process.cwd(), 'node_modules'),
                path.resolve(process.cwd(), this.options.outDir , 'node_modules'),
            ]
        });
        const { createInstance } = require(modulePath);
        if (typeof createInstance !== 'function') {
            throw new Error('The specified adapter type is invalid. Adapter module does not export createInstance method.')
        }
        this._db = createInstance(adapter.options);
        return this._db;
    }

    get dialect() {
        if (this._dialect) {
            return this._dialect;
        }
        const adapter = this.options.adapters.find((item) => item.default === true);
        if (adapter == null) {
            throw new Error('Invalid configuration. The default database connection is missing.');
        }
        const adapterType = this.options.adapterTypes.find((item) => item.invariantName === adapter.invariantName);
        if (adapterType == null) {
            throw new Error('Invalid configuration. The default database connection type is missing.');
        }
        this._dialect = this.dialects.find((item) => item.adapterType === adapterType.type);
        if (this._dialect == null) {
            throw new Error(`Invalid configuration. The dialect for adapter type ${adapterType.type} is missing.`);
        }
        return this._dialect;
    }

    /**
     * 
     * @returns {Promise<{ name: string, owner?: string, schema?: string }[]>}
     */
    async tables() {
        const db = this.db;
        /**
         * @type {import('./dialects/SqlDialect').SelectTablesDialect}
         */
        const dialect = this.dialect;
        let tables = [];
        if (typeof dialect.tables === 'function') {
            tables = await dialect.tables(db).listAsync();
        } else {
            if (typeof db.tables !== 'function') {
                throw new Error('Invalid database connection. The specified adapter does not support returning the collection of tables.');
            }
            tables = await db.tables().listAsync();
        }
        return tables.filter((item) => {
            // check if table is excluded
            if (this.options.exclude && this.options.exclude.length > 0) {
                for (const pattern of this.options.exclude) {
                    if (item.name.match(new RegExp(pattern))) {
                        return false;
                    }
                }
            }
            return true;
        });
    }

    /**
     * 
     * @param {Array<string>} tables
     * @param {{rootNamespace: string}=} options
     * @returns {Promise<Array<import('@themost/common').DataModelProperties>>} 
     */
    async extractMany(tables, options)  {
        const results = [];
        for (const table of tables) {
            const model = await this.extractOne(table, options);
            results.push(model);
        }
        return results;
    }

    async extract() {
        const tables = await this.tables();
        this.logger.info(`Found ${tables.length} tables in the database.`);
        const schemas = await this.extractMany(tables.map(t => t.name), {
            rootNamespace: this.options.rootNamespace || 'https://themost.io/schemas'
        });
        const parsers = this.parsers;
        this.logger.info(`Found ${parsers.length} schema parsers.`);
        for (const SchemaParserCtor of parsers) {
            this.logger.info(`Using schema parser: ${SchemaParserCtor.name}`);
            const parser = new SchemaParserCtor(schemas);
            for (const schema of schemas) {
                if (typeof parser.parse === 'function') {
                    await parser.parse(schema);
                } else {
                    throw new Error('Invalid schema parser. The specified parser does not implement parse method.');
                }
            }
        }
        return schemas;
    }

    /**
     * 
     * @param {string} name
     * @param {{rootNamespace: string}=} options
     * @returns {Promise<import('@themost/common').DataModelProperties>} 
     */
    async extractOne(name, options) {
        // get current dialect
        const dialect = this.dialect;
        this.logger.info(`Extracting schema for table: ${name}`);
        // get table helper
        const table = this.db.table(name);
        //  get columns
        const columns = await table.columnsAsync();
        const rootNamespace = (options && options.rootNamespace) || 'https://themost.io/schemas';
        /**
         * @type {import('@themost/common').DataModelProperties}
         */
        const model = {
            '$schema': 'https://themost-framework.github.io/themost/models/2018/2/schema.json',
            '@id': `${rootNamespace}#${name}`,
            name: name,
            title: name,
            source: name,
            view: name,
            sealed: true,
            version: '0.1.0',
            fields: [],
            constraints: []
        }
        const primaryKey = columns.filter((item) => item.primary);
        for (const column of columns) {
            const field = dialect.formatColumn(column);
            model.fields.push(field);
        }
        // add primary key constraint
        if (primaryKey.length > 1) {
            const constraint = {
                type: 'unique',
                fields: primaryKey.map((item) => item.name)
            }
            model.constraints.push(constraint);
        }
        return model;
    }

    /**
     * @param {string} outDir
     * @param {{forceReplace?:boolean}=} options
     * @returns {void}
     */
    async export(outDir, options) {
        this.options.outDir = outDir;
        this.logger.info(`Exporting schemas to ${outDir}`);
        await this.init();
        const schemas = await this.extract();
        await mkdir(path.resolve(outDir, 'config', 'models'), { recursive: true });
        const forceReplace = options && options.forceReplace;
        for (const schema of schemas) {
            const fileName = path.resolve(outDir, 'config', 'models', `${schema.name}.json`);
            try {
                const fileStats = await stat(fileName);
                if (fileStats.isFile()) {
                    if (forceReplace) {
                        this.logger.info(`Replacing existing file: ${fileName}`);
                    } else {
                        // skip file if it already exists
                        this.logger.warn(`File already exists: ${fileName}. Skipping export.`);
                        continue;
                    }
                }
            } catch (err) {
                // file does not exist, we can proceed
                if (err.code !== 'ENOENT') {
                    throw err;
                }
            }
            this.logger.info(`Exporting schema for table: ${schema.name} at ${fileName}`);
            await writeFile(fileName, JSON.stringify(schema, null, 2));
        }
        const { adapterTypes, adapters } = this.options;
        const services = [];
        const settings = {
            'app': {
                'title': '@themost-framework API Server | generated by @themost/rib',
            },
            'crypto': {
                'algorithm': 'aes256',
                'key': randomBytes(48).toString('hex')
            },
            'auth': {
                'unattendedExecutionAccount': randomBytes(16).toString('base64')
            },
            'i18n': {
                'locales': [
                    'en'
                ],
                'defaultLocale': 'en'
            }
        }
        const applicationConfig = {
            services,
            settings,
            adapterTypes,
            adapters
        }
        // create app.json
        const configFile = path.resolve(outDir, 'config', 'app.json');
        await writeFile(configFile, JSON.stringify(applicationConfig, null, 2));
    }

    async finalizeAsync() {
        if (this._db) {
            await this._db.closeAsync();
            this._db = null;
        }
    }

}

export {
    Extractor
}