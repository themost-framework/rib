import { DataAdapterBase, DataFieldBase } from "@themost/common";

export declare interface SqlDialectBase {
    sqlTypes: Map<string, any>;
    adapterType: string;
    formatColumn(column: {type: string, size?: number, precision?: number, scale?: number, nullable?: boolean, primary?: boolean, defaultValue?: any}): DataFieldBase;
}

export declare class SqlDialect implements SqlDialectBase {
    abstract get sqlTypes(): Map<string, any>;
    abstract get adapterType(): string;
    formatColumn(column: {type: string,size?:number, precision?:number,scale?:number,nullable?:boolean,primary?:boolean,defaultValue?: any}): DataFieldBase;
}

export declare interface SelectTablesDialect extends SqlDialectBase {
    tables(db: DataAdapterBase): { 
        list(callback: (err?: Error, res?: {name: string}[]) => void): void;
        listAsync(): Promise<{name: string}[]>
    }
}