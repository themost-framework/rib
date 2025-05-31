import { SqlDialect } from './SqlDialect';

const sqlTypes = new Map([
    ['integer', 'Integer'],
    ['text', 'Text'],
    ['real', 'Float'],
    ['numeric', 'Number'],
    ['varchar', 'Text'],
    ['nvarchar', 'Text'],
    ['decimal', 'Decimal'],
    ['float', 'Number'],
    ['double', 'Double'],
    ['blob', 'Binary'],
    ['boolean', 'Boolean'],
    ['date', 'Date'],
    ['datetime', 'DateTime'],
    ['timestamp', 'Timestamp'],
    ['json', 'Json']
]);

class SqliteDialect extends SqlDialect {
    constructor() {
        super();
    }
    get adapterType() {
        return '@themost/sqlite';
    }

    get sqlTypes() {
        return sqlTypes;
    }
}

export { SqliteDialect };