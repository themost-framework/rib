/* eslint-disable quotes */
module.exports = {
    "options": {
        "schemaNamingConvention": [
            "undescore_id"
        ],
        "exclude": [
            "payment_*"
        ]
    },
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
                "post": 5432,
                "user": "gitpod",
                "password": "",
                "database": "pagila"
            }
        }
    ]
}