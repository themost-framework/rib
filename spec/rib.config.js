/* eslint-disable quotes */
module.exports = {
    "schemaNamingConvention": [
            "underscore_id"
        ],
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
                "port": 5433,
                "user": "postgres",
                "password": "4nvCzsNA*DdwKRnS=AuLe5Ts",
                "database": "chinook"
            }
        }
    ]
}