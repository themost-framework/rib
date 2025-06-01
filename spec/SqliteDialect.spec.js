import { Extractor } from '@themost/rib';
import config from './rib.config.sqlite';
import path from 'path';

describe('sqlite', () => {
    
    it('should export schema', async () => {
        const service = new Extractor(config);
        await service.export(path.resolve(__dirname, '.tmp/sqlite'), {
            forceReplace: true
        });
        await service.db.closeAsync();
    });

});