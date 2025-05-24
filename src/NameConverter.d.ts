import { DataModelProperties } from '@themost/common';
import { SchemaParser } from './SchemaParser';

export declare class SnakeCaseNameConverter extends SchemaParser {
    constructor(schema: DataModelProperties[]);
}

export declare class StartCaseNameConverter extends SchemaParser {
    constructor(schema: DataModelProperties[]);
}

export declare class KebabCaseNameConverter extends SchemaParser {
    constructor(schema: DataModelProperties[]);
}