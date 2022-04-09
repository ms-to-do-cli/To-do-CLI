import getAppDataPath from 'appdata-path';
import Path from 'node:path';

import { config } from '../../../src/helpers/config/config';
import { MemoryStorage } from '../../../src/helpers/storage/memory-storage';

export const appDataFileName = Path.join(getAppDataPath(config.app.name), config.app.settings.fileName);

export const mockLogin = () => {
    MemoryStorage.files.push({
        name: appDataFileName,
        data: '{"authorizationToken": "AUTHORIZATION_TOKEN"}',
    });
};
