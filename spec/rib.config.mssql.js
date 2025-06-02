const { SnakeCaseNameConverter, StartCaseNameConverter, PrimaryKeyAssociation } = require('@themost/rib');

/* eslint-disable quotes */
module.exports = {
    "parsers": [
        SnakeCaseNameConverter,
        StartCaseNameConverter,
        PrimaryKeyAssociation
    ],
    "rootNamespace": "https://themost.io/schemas",
    "exclude": [
    ],
    "adapterTypes": [
        {
            "invariantName": "mssql",
            "type": "@themost/mssql"
        }
    ],
    "adapters": [
        {
            "name": "source",
            "invariantName": "mssql",
            "default": true,
            "options": {
                "server": "mssql",
                "port": 1433,
                "user": "sa",
                "password": "password",
                "database": "Northwind"
            }
        }
    ]
}