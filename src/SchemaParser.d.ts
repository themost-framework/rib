import { DataModelProperties } from "@themost/common";

export declare abstract class SchemaParser {
    abstract async parse(schema: DataModelProperties): Promise<void>;
}