import { SqlDialect } from './SqlDialect';

const sqlTypes = new Map([
    ['int', 'Integer'],
    ['smallint', 'Integer(2)'],
    ['integer', 'Integer'],
    ['float', 'Number'],
    ['varchar', 'Text'],
    ['decimal', 'Decimal'],
    ['dec', 'Decimal'],
    ['double', 'Number'],
    ['date', 'Date'],
    ['datetime', 'DateTime'],
    ['timestamp', 'DateTime'],
    ['time', 'Time'],
    ['binary', 'Binary'],
    ['varbinary', 'Binary'],
    ['blob', 'Binary'],
    ['tinyblob', 'Binary(255)'],
    ['mediumblob', 'Binary(16777215)'],
    ['longblob', 'Binary(4294967295)'],
    ['text', 'Text'],
    ['boolean', 'Boolean'],
    ['tinyint', 'Integer(1)'],
    ['mediumint', 'Integer(3)'],
    ['bigint', 'Integer(8)'],
    ['char', 'Text'],
    ['longtext', 'Text(4294967295)'],
    ['mediumtext', 'Text(16777215)'],
    ['tinytext', 'Text(255)'],
    ['enum', 'String'],
    ['set', 'String']
]);

class MySQLDialect extends SqlDialect {

    constructor() {
        super();
    }

    get adapterType() {
        return '@themost/mysql';
    }

    get sqlTypes() {
        return sqlTypes;
    }

}

export { MySQLDialect };