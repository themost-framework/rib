const { SnakeCaseNameConverter, StartCaseNameConverter, SetSealedAttribute, UnderscoreIdConverter } = require('@themost/rib');

/* eslint-disable quotes */
module.exports = {
    "parsers": [
        SnakeCaseNameConverter,
        StartCaseNameConverter,
        SetSealedAttribute,
        UnderscoreIdConverter
    ],
    "rootNamespace": "https://themost.io/schemas",
    "exclude": [
        "payment_*",
        "migrations"
    ],
    "adapterTypes": [
        {
            "invariantName": "postgres",
            "type": "@themost/pg"
        }
    ],
    "adapters": [
        {
            "name": "source",
            "invariantName": "postgres",
            "default": true,
            "options": {
                "host": "localhost",
                "port": 5432,
                "user": "postgres",
                "password": "secret",
                "database": "chinook"
            }
        }
    ]
}