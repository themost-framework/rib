import { SchemaParser } from './SchemaParser';
import { camelCase, startCase } from 'lodash';

class SnakeCaseNameConverter extends SchemaParser {
  constructor(schemas) {
    super(schemas);
  }
    /**
     * 
     * @param {import('@themost/common').DataModelProperties} schema 
     * @returns void
     */
  async parse(schema) {
    // if name follows the pattern of snake_case
    if (schema.name && schema.name.includes('_')) {
      // convert to camelCase
      schema.name = camelCase(schema.name).replace(/\s/, '');
    }
  }
}

class KebabCaseNameConverter extends SchemaParser {
  constructor(schemas) {
    super(schemas);
  }
    /**
     * 
     * @param {import('@themost/common').DataModelProperties} schema 
     * @returns void
     */
  async parse(schema) {
    // if name follows the pattern of snake_case
    if (schema.name && schema.name.includes('-')) {
      // convert to camelCase
      schema.name = camelCase(schema.name).replace(/\s/, '');
    }
  }
}

class StartCaseNameConverter extends SchemaParser {
  constructor(schemas) {
    super(schemas);
  }
    /**
     * 
     * @param {import('@themost/common').DataModelProperties} schema 
     * @returns void
     */
  async parse(schema) {
    schema.name = startCase(schema.name).replace(/\s/g, '');
  }
}

export {
    SnakeCaseNameConverter,
    StartCaseNameConverter,
    KebabCaseNameConverter
}