# @themost/rib
MOST Web Framework database-to-api tools and services

# Usage

```bash
npx @themost/rib --config ./config.json --output ./output
```

This command will read the configuration from `config.json` and generate the basic structure of a @themost-framework API server in the `output` directory.

```
     + config
        + models
           <Schema files>
     app.json
```

The `config/models` will contain the schema files that define the structure of your database. The `app.json` file will contain the configuration for the API server.


# Configuration

The configuration file should be a JSON object with the following properties:

- parsers: An array of parsers to use for converting database schema names to API names. Each parser should be a string that specifies the parser to use.
- rootNamespace: A string that specifies the root namespace for the API.
- exclude: An array of strings that specifies the names of tables to exclude from the API.
- adapterTypes: An array of objects that specifies the types of database adapters to use. Each object should have an `invariantName` and a `type` property.
- adapters: An array of objects that specifies the database adapters to use. Each object should have a `name`, `invariantName`, and `options` property. The `options` property should be an object that contains the connection options for the database adapter.

# Example Configuration

```json
{
    "parsers": [
        "@themost/rib#SnakeCaseNameConverter",
        "@themost/rib#SingularNameConverter",
        "@themost/rib#StartCaseNameConverter",
        "@themost/rib#UnderscoreIdConverter"
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
```

The previous example configuration will generate an API server that connects to a MySQL database named `sakila` using the `root` user with the password `secret`. The API server will use the `SnakeCaseNameConverter`, `SingularNameConverter`, `StartCaseNameConverter`, and `UnderscoreIdConverter` parsers to convert database schema names to API names. The `migrations` table will be excluded from the API.

- SnakeCaseNameConverter: Converts snake_case database table names to readable names e.g. `customer_address` to `CustomerAddress`.

- SingularNameConverter: Converts plural database table names to singular names e.g. `customers` to `Customer`.

- StartCaseNameConverter: Converts database table names to start case e.g. `customer` to `Customer`.

- UnderscoreIdConverter: Uses underscore identifiers for creating associations between entities

- IdConverter: Searches for attributes that follow the pattern `*Id` and defines associations between entities.




