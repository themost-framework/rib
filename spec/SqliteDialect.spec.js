import { Extractor } from '@themost/rib';
import chinookConfig from './rib.config.sqlite';
import path from 'path';

describe('sqlite', () => {
    
    it('should extract schema', async () => {
        const service = new Extractor(chinookConfig);
        const schemas = await service.extract();
        expect(Array.isArray(schemas)).toBeTruthy();
        expect(schemas.length).toBeGreaterThan(0);
        await service.db.closeAsync();
    });

    it('should export schema', async () => {
        const service = new Extractor(chinookConfig);
        await service.export(path.resolve(__dirname, '.tmp/sqlite'), {
            forceReplace: true
        });
        await service.db.closeAsync();
    });

});