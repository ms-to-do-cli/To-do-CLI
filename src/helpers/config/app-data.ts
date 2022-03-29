import getAppDataPath from 'appdata-path';
import { config } from './config';
import * as Path from 'node:path';
import * as path from 'node:path';
import * as fs from 'node:fs';

export abstract class AppData {
    public static settings: Settings = {};
    public static loadedSettings: boolean = false;
    private static fileName: string = Path.join(getAppDataPath(config.app.name), config.app.settings.fileName);

    public static loadSettings = async (): Promise<void> => {
        if (AppData.loadedSettings)
            return;

        try {
            // no-error = can access | error = can not access
            await fs.promises.access(AppData.fileName, fs.constants.R_OK | fs.constants.W_OK);
        } catch (error: Error | any) {
            // there is no settingsfile yet

            // checking whether the error is NOT a "dir does not exist" exception
            if (error?.code !== 'ENOENT')
                throw error;

            // create dir
            await fs.promises.mkdir(path.dirname(AppData.fileName), { recursive: true });

            AppData.loadedSettings = true;

            // store (empty) settings
            await AppData.storeSettings();

            return;
        }

        // there is already a settingsfile
        // load settings file
        AppData.settings = JSON.parse(await fs.promises.readFile(AppData.fileName, 'utf8'));
        AppData.loadedSettings = true;
    };

    public static storeSettings = async (): Promise<void> => {
        if (!AppData.loadedSettings)
            throw new Error('(INTERNAL) Cannot save settings before they are loaded');

        try {
            await fs.promises.writeFile(AppData.fileName, JSON.stringify(AppData.settings), 'utf8');
        } catch (error) {
            if (error)
                throw error;

            throw new Error(`Something went wrong when writing the settings to ${AppData.fileName}`);
        }
    };

    public static isAuthenticated = async (): Promise<boolean> => {
        await AppData.loadSettings();

        return AppData.settings.authorizationToken !== undefined && AppData.settings.authorizationToken.length > 0;
    };

    public static isTryingToAuthenticate = async (): Promise<boolean> => {
        await AppData.loadSettings();

        // TODO: check expireDate

        return AppData.settings.login !== undefined && AppData.settings.login.devicecode?.length > 0;
    };
}

export interface Settings {
    login?: {
        devicecode: string;
        expireDate: Date;
    };
    authorizationToken?: string;
}
