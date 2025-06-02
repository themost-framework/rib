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
    [ 'uniqueidentifier', 'Guid' ],
    [ 'timestamp', 'Text(8)' ],
    [ 'real', 'Float' ],
    [ 'char', 'Text(1)' ],
    [ 'varchar', 'Text' ],
    [ 'text', 'Text' ],
    [ 'nchar', 'Text(1)' ],
    [ 'nvarchar', 'Text' ],
    [ 'ntext(16)', 'Text(1073741823)' ], // ntext is deprecated, but still supported. The size of 16 is used to indicate the maximum size.
    [ 'ntext', 'Text' ],
    [ 'date', 'DateTime(0)' ], // 
    [ 'datetime', 'DateTime(0)' ],
    [ 'datetime2', 'DateTime(0)' ],
    [ 'datetimeoffset', 'DateTimeOffset' ],
    [ 'smalldatetime', 'DateTime' ],
    [ 'time', 'Time' ],
    [ 'binary', 'Binary' ],
    [ 'varbinary', 'Binary' ],
    [ 'image(16)', 'Image(2147483647)' ], // image is deprecated, but still supported. The size of 16 is used to indicate the maximum size.
    [ 'image', 'Image' ]
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