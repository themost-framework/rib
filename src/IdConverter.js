import { SchemaParser } from './SchemaParser';

class IdConverter extends SchemaParser {
/**
 * 
 * @param {Array<import('@themost/common').DataModelProperties>} schemas 
 */
  constructor(schemas) {
    super(schemas);
  }

  /**
   * 
   * @param @param {import('@themost/common').DataModelProperties} schema 
   */
  async parse(schema) {
    for(const field of schema.fields) {
        // try to check if the field follows the pattern of underscore_id
        // if so, we will convert it to camelCase
        if (field.name.match(/id$/i)) {
            // get the field name without the _id suffix
            const name = field.name.replace(/id$/i, '');
            // try to check if a model with the same name exists
            const parent = this.schemas.find(s => s.source === name && s.source !== schema.source);
            if (parent) {
                const parentField = parent.fields.find((f) => f.name === field.name);
                if (parentField && parentField.primary) {
                    field.type = parent.name;
                    field.property = name;
                }
            }
        }
    }
  }

}

export {
    IdConverter
}