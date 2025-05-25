import { Extractor } from '@themost/rib';
import config from './rib.config.mysql';
import classicModelsConfig from './rib.config.classicmodels';
import sakilaConfig from './rib.config.sakila';
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

    it('should export classiccmodels schema', async () => {
        const service = new Extractor(classicModelsConfig);
        await service.export(path.resolve(__dirname, '.tmp/classicmodels'));
        await service.db.closeAsync();
    });

    it('should export sakila schema', async () => {
        const service = new Extractor(sakilaConfig);
        await service.export(path.resolve(__dirname, '.tmp/sakila'));
        await service.db.closeAsync();
    });

});