import { Extractor } from '@themost/rib';
import config from './rib.config.sakila';
import path from 'path';

describe('MySQLDialect', () => {
    
    it('should export sakila schema', async () => {
        const service = new Extractor(config);
        await service.export(path.resolve(__dirname, '.tmp/sakila'), {
            forceReplace: true
        });
        await service.db.closeAsync();
    });

});