import { Extractor } from '@themost/rib';

describe('Extractor', () => {
    it('should create instance', () => {
        const service = new Extractor();
        expect(service).toBeInstanceOf(Extractor);
    });
});