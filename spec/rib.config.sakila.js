const { SnakeCaseNameConverter, StartCaseNameConverter, UnderscoreIdConverter, SingularNameConverter } = require('@themost/rib');

/* eslint-disable quotes */
module.exports = {
    "parsers": [
        SnakeCaseNameConverter,
        SingularNameConverter,
        StartCaseNameConverter,
        UnderscoreIdConverter
    ],
    "rootNamespace": "https://themost.io/schemas",
    "exclude": [
        "migrations"
    ],
    "adapterTypes": [
        {
            "invariantName": "mysql",
            "type": "@themost/mysql"
        }
    ],
    "adapters": [
        {
            "name": "source",
            "invariantName": "mysql",
            "default": true,
            "options": {
                "host": "localhost",
                "port": 3306,
                "user": "root",
                "password": "secret",
                "database": "sakila"
            }
        }
    ]
}