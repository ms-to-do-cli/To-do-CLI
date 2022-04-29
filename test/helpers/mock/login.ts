import getAppDataPath from 'appdata-path';
import Path from 'node:path';

import { config } from '../../../src/helpers/config/config';
import { MemoryStorage } from '../../../src/helpers/storage/memory-storage';

export const appDataFileName = Path.join(getAppDataPath(config.app.name), config.app.settings.fileName);

export const mockLogin = () => {
    MemoryStorage.files.push({
        name: appDataFileName,
        data: JSON.stringify({
            refreshToken: 'REFRESH_TOKEN',
            authorization: {
                token: 'AUTHORIZATION_TOKEN',
                expireDate: '2999-01-01T00:00:00.000',
            },
        }),
    });
};
