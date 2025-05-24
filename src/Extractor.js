import { PostgreSQLDialect } from './dialects/PostgreSQLDialect';

class ExtractorConfiguration {
    /**
     * @type {string[]=}
     */
    schemaNamingConvention = [];
    /**
     * @type {string[]=}
     */
    exclude = [];
    /**
     * @type {import('@themost/data').DataAdapterTypeConfiguration[]}
     */
    adapterTypes = [];
    /**
     * @type {import('@themost/data').DataAdapterConfiguration[]}
     */
    adapters = [];
}

class Extractor {

    /**
     * @type {import('@themost/data').DataAdapter}
     */
    _db = null;

    /**
     * @param {ExtractorConfiguration} options 
     */
    constructor(options) {
        this.options = options;

        this.dialects = [
            new PostgreSQLDialect()
        ]

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
        const {createInstance} = require(adapterType.type);
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
        if (typeof db.tables !== 'function') {
            throw new Error('Invalid database connection. The specified adapter does not support returning the collection of tables.');
        }
        const tables = await db.tables().listAsync();
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
    async extract(tables, options)  {
        const results = [];
        for (const table of tables) {
            const model = await this.extractSingle(table, options);
            results.push(model);
        }
        return results;
    }

    /**
     * 
     * @param {string} name
     * @param {{rootNamespace: string}=} options
     * @returns {Promise<import('@themost/common').DataModelProperties>} 
     */
    async extractSingle(name, options) {
        // get current dialect
        const dialect = this.dialect;
        // get table helper
        const table = this.db.table(name);
        //  get columns
        const columns = await table.columnsAsync();
        const rootNamespace = (options && options.rootNamespace) || 'https://themost.io/schemas';
        /**
         * @type {import('@themost/common').DataModelProperties}
         */
        const model = {
            '@id': `${rootNamespace}#${name}`,
            name: name,
            source: name,
            view: name,
            sealed: false,
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

}

export {
    ExtractorConfiguration,
    Extractor
}