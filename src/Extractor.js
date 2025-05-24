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
        const types = this.db.types;
        const primaryKey = columns.filter((item) => item.primary);
        for (const column of columns) {
            // find type
            const type = types.find((item) => {
                return item[0] === column.type;
            });
            const field = {
                name: column.name,
                type: type ? type[1] : 'Unknown',
                nullable: column.nullable
            }
            if (column.primary && primaryKey.length === 1) {
                field.primary = true;
            }
            if (column.description) {
                field.description = column.description;
            }
            if (column.size) {
                field.size = column.size;
            }
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