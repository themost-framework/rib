import { Extractor } from '@themost/rib';
import config from './rib.config.mssql';
import path from 'path';

describe('SqlServerDialect', () => {
    
    it('should export chinook schema', async () => {
        const service = new Extractor(config);
        await service.export(path.resolve(__dirname, '.tmp/mssql'), {
            forceReplace: true
        });
        await service.db.closeAsync();
    });

});