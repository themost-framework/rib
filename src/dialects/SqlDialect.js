import { LangUtils } from '@themost/common';
const { parseBoolean } = LangUtils;
/**
 * @abstract
 */
class SqlDialect {
    constructor() {
    }

    /**
     * Converts a column definition to an instance of data field.
     * @param {{type: string,size?:number, precision?:number,scale?:number,nullable?:boolean,primary?:boolean,defaultValue?:*}} column 
     * @returns {import('@themost/common').DataFieldBase}
     */
    formatColumn(column) {
        let type = column.type;
        let typeString = type.toLowerCase();
        const [,typeMatch,,,typePrecision,typeScale] = /([a-zA-Z0-9\s]+)(\(((\d+),?(\d+)?)\))?/.exec(typeString);
        if (typeMatch) {
            typeString = typeMatch;
        }
        const sqlTypeString = this.sqlTypes.get(typeString);
        const [,fieldType,,,fieldSize,fieldScale] = /([a-zA-Z0-9\s]+)(\(((\d+),?(\d+)?)\))?/.exec(sqlTypeString);
        if (fieldType) {
            type = fieldType;
        } else {
            type = 'Unknown';
        }
        /**
         * @type {import('@themost/common').DataFieldBase}
         */
        const result = {
            name: column.name,
            type: type,
            nullable: (typeof column.nullable === 'undefined') ? true : parseBoolean(column.nullable)
        }
        if (typeof column.size === 'number') {
            result.size = column.size;
        } else if (typePrecision) {
            result.size = parseInt(typePrecision, 10);
        }
        if (typeof column.precision === 'number' && column.precision > 0) {
            result.size = column.precision;
        } else if (typePrecision) {
            result.size = parseInt(typePrecision, 10);
        }
        if (result.precision === result.size) {
            delete result.precision;
        }
        if (typeof column.scale === 'number' && column.scale > 0) {
            result.scale = column.scale;
        } else if (typeScale) {
            result.scale = parseInt(typeScale, 10);
        }

        // force set size and scale
        if (fieldSize) {
            column.size = parseInt(fieldSize, 10);
        }
        if (fieldScale) {
            column.scale = parseInt(fieldScale, 10);
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

export {
    SqlDialect
}