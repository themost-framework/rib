import { camelCase } from 'lodash';
import { SchemaParser } from './SchemaParser';
import { singular } from 'pluralize';

class PrimaryKeyAssociation extends SchemaParser {
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
    // get primary key fields
    const keys = this.schemas.filter((schema) => {
        return schema.fields.filter(f => f.primary).length === 1;
    }).map((schema) => {
        const primaryKey = schema.fields.find(f => f.primary);
        return primaryKey.name;
    });
    // check if primary keys are unique across schemas
    if (keys.length !== new Set(keys).size) {
        return;   
    }
    /**
     * @type {Map<string, string>}
     */
    const primaryKeys = this.schemas.filter((schema) => {
        return schema.fields.filter(f => f.primary).length === 1;
    }).reduce((acc, cur) => {
        const primaryKey = cur.fields.find(f => f.primary);
        if (primaryKey) {
            acc.set(primaryKey.name, cur.name);
        }
        return acc;
    }, new Map());
    for(const field of schema.fields) {
        // try to check if the field is a primary key selected by the previous operation
        if (primaryKeys.has(field.name)) {
            const parent = this.schemas.find(s => s.name === primaryKeys.get(field.name));
            // if parent schema is other than current schema
            if (parent.source !== schema.source) {
                field.type = parent.name;
                // check if the first character is uppercase
                if (camelCase(field.name) === field.name) {
                    // convert to camel case
                    field.property = camelCase(singular(parent.name));
                } else {
                    field.property = singular(parent.name);
                }
                
            }
        }
    }
  }

}

export {
    PrimaryKeyAssociation
}