import getAppDataPath from 'appdata-path';
import * as Path from 'node:path';

import { config } from '../../src/helpers/config/config';

export const appDataFileName = Path.join(getAppDataPath(config.app.name), config.app.settings.fileName);
