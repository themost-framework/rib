import { LangUtils } from '@themost/common';
const { parseBoolean } = LangUtils;

const sqlTypes = new Map([
    ['integer', 'Integer'],
    ['smallserial', 'Counter'],
    ['serial', 'Counter'],
    ['bigserial', 'Counter'],
    ['uuid', 'Guid'],
    ['timestamp without time zone', 'DateTime'],
    ['timestamp with time zone', 'DateTime'],
    ['timestamp', 'DateTime'],
    ['time', 'DateTime'],
    ['date', 'Date'],
    ['text', 'Text'],
    ['varchar', 'Text'],
    ['boolean', 'Boolean'],
    ['smallint', 'Short'],
    ['jsonb', 'Json'],
    ['numeric', 'Number'],
    ['decimal', 'Decimal'],
    ['real', 'Number'],
    ['USER-DEFINED', 'Text'],
    ['ARRAY', 'Note'],
    ['tsvector', 'Note'],
    ['character', 'Byte'],
    ['character varying', 'Text'],
    ['bytea', 'Binary']
]);

class PostgreSQLDialect {
    constructor() {

    }

    get adapterType() {
        return '@themost/pg';
    }

    get sqlTypes() {
        return sqlTypes;
    }

    /**
       * Converts a column definition to an instance of data field.
       * @param {{type: string,size?:number, precision?:number,scale?:number,nullable?:boolean,primary?:boolean,defaultValue?:*}} column 
       * @returns {import('@themost/common').DataFieldBase}
       */
    formatColumn(column) {
        let type = column.type;
        const sqlType = this.sqlTypes.get(type.toLowerCase());
        if (sqlType) {
            type = sqlType;
        } else {
            type = 'Unknown';
        }
        /**
         * @type {import('@themost/common').DataFieldBase}
         */
        const result = {
            name: column.name,
            type: type,
            nullable: (typeof column.nullable === 'undefined') ? true : column.nullable
        }
        if (typeof column.size === 'number') {
            result.size = column.size;
        }
        if (typeof column.precision === 'number' && column.precision > 0) {
            result.precision = column.precision;
        }
        if (typeof column.scale === 'number' && column.scale > 0) {
            result.scale = column.scale;
        }
        if (parseBoolean(column.primary)) {
            result.primary = true;
        }
        if (typeof column.defaultValue === 'string' && column.defaultValue.length > 0) {
            if (column.default.startsWith('nextval')) {
                result.readonly = true;
            }
        }
        return result;
    }
}

export { PostgreSQLDialect };