import { Extractor } from '@themost/rib';
import config from './rib.config.mysql';
import path from 'path';

describe('MySQLDialect', () => {
    
    it('should export schema', async () => {
        const service = new Extractor(config);
        await service.export(path.resolve(__dirname, '.tmp/mysql'));
        await service.db.closeAsync();
    });

});