/* eslint-disable quotes */
module.exports = {
    "parsers": [
        "@themost/rib#SnakeCaseNameConverter",
        "@themost/rib#StartCaseNameConverter",
        "@themost/rib#SingularNameConverter",
        "@themost/rib#PrimaryKeyAssociation"
    ],
    "rootNamespace": "https://themost.io/schemas",
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