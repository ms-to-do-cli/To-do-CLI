import getAppDataPath from 'appdata-path';
import * as Path from 'node:path';
import * as path from 'node:path';

import { FileSystemStorage } from '../storage/file-system-storage';
import { config } from './config';

export abstract class AppData {
    public static settings: Settings = {};
    public static loadedSettings = false;
    public static storage = FileSystemStorage;
    private static fileName: string = Path.join(getAppDataPath(config.app.name), config.app.settings.fileName);

    public static loadSettings = async (): Promise<void> => {
        if (AppData.loadedSettings)
            return;

        try {
            // no-error = can access | error = can not access
            await AppData.storage.access(AppData.fileName);
        } catch (error: Error | any) {
            // there is no settingsfile yet

            // checking whether the error is NOT a "dir does not exist" exception
            if (error?.code !== 'ENOENT')
                throw error;

            // create dir
            await AppData.storage.mkdir(path.dirname(AppData.fileName));

            AppData.loadedSettings = true;

            // store (empty) settings
            await AppData.storeSettings();

            return;
        }

        // there is already a settingsfile
        // load settings file
        AppData.settings = JSON.parse(await AppData.storage.readFile(AppData.fileName));
        AppData.loadedSettings = true;
    };

    public static storeSettings = async (): Promise<void> => {
        if (!AppData.loadedSettings)
            throw new Error('(INTERNAL) Cannot save settings before they are loaded');

        try {
            await AppData.storage.writeFile(AppData.fileName, JSON.stringify(AppData.settings));
        } catch (error) {
            if (error)
                throw error;

            throw new Error(`Something went wrong when writing the settings to ${AppData.fileName}`);
        }
    };

    public static isAuthenticated = async (): Promise<boolean> => {
        await AppData.loadSettings();

        return AppData.settings.authorization?.token !== undefined && AppData.settings.authorization.token.length > 0;
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
    authorization?: {
        token: string,
        expireDate: Date
    };
    refreshToken?: string;
}
