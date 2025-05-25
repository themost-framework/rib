import { Extractor } from '@themost/rib';
import config from './rib.config.mysql';
import path from 'path';

describe('MySQLDialect', () => {
    
    it('should extract schema', async () => {
        const service = new Extractor(config);
        const schemas = await service.extract();
        expect(Array.isArray(schemas)).toBeTruthy();
        expect(schemas.length).toBeGreaterThan(0);
        await service.db.closeAsync();
    });

    it('should export schema', async () => {
        const service = new Extractor(config);
        await service.export(path.resolve(__dirname, '.tmp/mysql'));
        await service.db.closeAsync();
    });

});