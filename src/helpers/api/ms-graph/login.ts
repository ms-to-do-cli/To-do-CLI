/* eslint-disable camelcase */
import axios, { AxiosResponse } from 'axios';
import { config } from '../../config/config';
import { AppData } from '../../config/app-data';
import { headers } from './axios/headers';
import AxiosMicrosoftGraphError from './axios/axios-microsoft-graph-error';

export interface DevicecodeResponse {
    user_code: string;
    device_code: string;
    verification_uri: string;
    expires_in: number;
    interval: number;
    message: string;
}

export interface AuthorizationTokenResponse {
    'token_type': string;
    'scope': string;
    'expires_in': number;
    'ext_expires_in': 3600;
    'access_token': string;
    'refresh_token': string;
    'id_token': string;
}

export const getDevicecode = async (): Promise<DevicecodeResponse> => {
    try {
        const devicecodeResponse: DevicecodeResponse = (await axios.post<any, AxiosResponse<DevicecodeResponse>, any>(config.microsoftGraph.url.devicecode, new URLSearchParams({
            client_id: config.microsoftGraph.client.id,
            scope: config.microsoftGraph.scope,
        }), { headers })).data;

        const expireDate = new Date();
        expireDate.setSeconds(expireDate.getSeconds() + devicecodeResponse.expires_in);

        AppData.settings.login = { devicecode: devicecodeResponse.device_code, expireDate };
        await AppData.storeSettings();

        return devicecodeResponse;
    } catch (error: any | Error) {
        if (axios.isAxiosError(error))
            throw new AxiosMicrosoftGraphError('Cannot request devicecode', error);

        throw error;
    }
};

export const getAuthorizationToken = async (): Promise<AuthorizationTokenResponse> => {
    if (!AppData.settings.login?.devicecode)
        throw new Error('(INTERNAL) There is no devicecode');

    try {
        const authorizationTokenResponse: AuthorizationTokenResponse =
            (await axios.post<any, AxiosResponse<AuthorizationTokenResponse>>(config.microsoftGraph.url.authorizationToken, new URLSearchParams({
                grant_type: 'device_code',
                client_id: config.microsoftGraph.client.id,
                code: AppData.settings.login.devicecode,
            }), { headers })).data;

        AppData.settings.authorizationToken = authorizationTokenResponse.access_token;
        delete AppData.settings.login;
        await AppData.storeSettings();

        return authorizationTokenResponse;
    } catch (error: any) {
        delete AppData.settings.login;
        await AppData.storeSettings();

        if (axios.isAxiosError(error))
            throw new AxiosMicrosoftGraphError('Cannot request authorizationtoken', error);

        throw error;
    }
};
