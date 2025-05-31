import { SqlDialect } from './SqlDialect';

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
    ['user-defined', 'Text'],
    ['array', 'Note'],
    ['tsvector', 'Note'],
    ['character', 'Byte'],
    ['character varying', 'Text'],
    ['bytea', 'Binary']
]);

class PostgreSQLDialect extends SqlDialect {
    constructor() {
        super();
    }

    get adapterType() {
        return '@themost/pg';
    }

    get sqlTypes() {
        return sqlTypes;
    }

}

export { PostgreSQLDialect };