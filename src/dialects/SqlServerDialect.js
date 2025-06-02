import { SqlDialect } from './SqlDialect';

const sqlTypes = new Map([
    [ 'bit', 'Boolean' ],
    [ 'tinyint', 'Integer' ],
    [ 'smallint', 'Short' ],
    [ 'int', 'Integer' ],
    [ 'bigint', 'Integer' ],
    [ 'decimal', 'Decimal' ],
    [ 'money', 'Decimal' ],
    [ 'smallmoney', 'Decimal' ],
    [ 'numeric', 'Decimal' ],
    [ 'float', 'Float' ],
    ['uniqueidentifier', 'Guid' ],
    [ 'timestamp', 'Text(8)' ],
    [ 'real', 'Float' ],
    [ 'char', 'Text(1)' ],
    [ 'varchar', 'Text' ],
    [ 'text', 'Text' ],
    [ 'nchar', 'Text(1)' ],
    [ 'nvarchar', 'Text' ],
    [ 'ntext', 'Text' ],
    [ 'date', 'DateTime' ],
    [ 'datetime', 'DateTime' ],
    [ 'datetime2', 'DateTime' ],
    [ 'datetimeoffset', 'DateTimeOffset' ],
    [ 'smalldatetime', 'DateTime' ],
    [ 'time', 'Time' ],
    [ 'binary', 'Binary' ],
    [ 'varbinary', 'Binary' ]
]);

class SqlServerDialect extends SqlDialect {
    constructor() {
        super();
    }
    get adapterType() {
        return '@themost/mssql';
    }

    get sqlTypes() {
        return sqlTypes;
    }
}

export { SqlServerDialect };