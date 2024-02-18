import { Extractor } from '@themost/rib';
import config from './rib.config';

describe('Extractor', () => {
    it('should create instance', () => {
        const service = new Extractor(config);
        expect(service).toBeInstanceOf(Extractor);
    });

    it('should connect with source database', async () => {
        const service = new Extractor(config);
        await service.db.openAsync();
        await service.db.closeAsync();
    });
});