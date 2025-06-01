import config from './rib.config.sqlite';
import wrongConfig from './wrong-rib.config.sqlite';
import { Extractor } from '@themost/rib';

describe('npm', () => {
    it('should use init', async () => {
        const extractor = new Extractor(config)
        await extractor.init();
        await extractor.export(config.outDir);
    });

    it('should use init and throw error', async () => {
        const extractor = new Extractor(wrongConfig);
        await expect(() => extractor.init()).rejects.toMatch('not in this registry');
    });
    
});