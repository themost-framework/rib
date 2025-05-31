import { Extractor } from '@themost/rib';
import chinookConfig from './rib.config.pg.json';
import path from 'path';

describe('PostgreSQLDialect', () => {
    
    it('should export chinook schema', async () => {
        const service = new Extractor(chinookConfig);
        await service.export(path.resolve(__dirname, '.tmp/chinook'), {
            forceReplace: true
        });
        await service.db.closeAsync();
    });
    
});