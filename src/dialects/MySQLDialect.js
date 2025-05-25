import { SqlDialect } from './SqlDialect';

const sqlTypes = new Map([
    ['int', 'Integer'],
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
    ['tinyblob', 'Binary'],
    ['mediumblob', 'Binary'],
    ['longblob', 'Binary'],
    ['text', 'Text'],
    ['boolean', 'Boolean'],
    ['tinyint', 'Integer'],
    ['mediumint', 'Integer'],
    ['bigint', 'Integer'],
    ['char', 'Text'],
    ['longtext', 'Text'],
    ['mediumtext', 'Text'],
    ['tinytext', 'Text'],
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

    /**
     * 
     * @param {import('@themost/common').DataAdapterBase} db 
     * @returns 
     */
    tables(db) {
        return {
            list: function (callback) {
                db.execute('SELECT `TABLE_NAME` AS `name` FROM `information_schema`.`TABLES` WHERE `TABLE_SCHEMA` = DATABASE()', null, function (err, results) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, results);
                });
            },
            listAsync: function () {
                const self = this;
                return new Promise((resolve, reject) => {
                    self.list((err, results) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(results);
                    });
                });
            }
        }
    }

}

export { MySQLDialect };