import { DataModelProperties, TraceLogger } from '@themost/common';
import { DataAdapter, DataAdapterConfiguration, DataAdapterTypeConfiguration } from '@themost/data';
import { SqlDialect } from './dialects/SqlDialect';

export declare interface ExtractorConfiguration {
    outDir?: string;
    exclude?: string[];
    parsers?: (Function | string)[];
    adapterTypes: DataAdapterTypeConfiguration[];
    adapters: DataAdapterConfiguration[];
}

export declare class Extractor {

    constructor(options?: ExtractorConfiguration);

    get logger(): TraceLogger;
    get db(): DataAdapter;
    get dialect(): SqlDialect;
    async extract(): Promise<DataModelProperties[]>;
    async extractOne(name: string): DataModelProperties;
    async export(outDir: string, options?: { forceReplace?: boolean }): Promise<void>;
}