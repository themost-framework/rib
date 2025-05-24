/**
 * @abstract
 */
class SchemaParser {
    /**
     * 
     * @param {Array<import('@themost/common').DataModelProperties>} schemas 
     */
    constructor(schemas) {
        this.schemas = schemas;
    }

    /**
     * @abstract
     * @param {import('@themost/common').DataModelProperties} schema 
     */
    // eslint-disable-next-line no-unused-vars
    async parse(schema) {
        //
    }

}

export {
    SchemaParser
}