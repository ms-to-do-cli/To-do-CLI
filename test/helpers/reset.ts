import { AppData } from '../../src/helpers/config/app-data';
import { MemoryStorage } from '../../src/helpers/storage/memory-storage';

export default () => {
    AppData.loadedSettings = false;
    AppData.settings = {};
    MemoryStorage.reset();
};
