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

    tables() {
        //
    }

}

export {
    ExtractorConfiguration,
    Extractor
}