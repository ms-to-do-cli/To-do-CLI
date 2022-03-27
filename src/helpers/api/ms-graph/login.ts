/* eslint-disable camelcase */
import axios, { AxiosResponse } from 'axios';
import { config } from '../../config/config';

export interface DevicecodeResponse {
    user_code: string;
    device_code: string;
    verification_uri: string;
    expires_in: number;
    interval: number;
    message: string;
}

export const getDevicecode = async (): Promise<DevicecodeResponse | undefined> => {
    try {
        return (await axios.post<any, AxiosResponse<DevicecodeResponse>, any>(config.microsoftGraph.url.devicecode, new URLSearchParams({
            client_id: config.microsoftGraph.client.id,
            scope: config.microsoftGraph.scope,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })).data;
    } catch (error: any | Error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`Cannot request devicecode: ${error.response.status} ${error.response.statusText}\r\n${error.response.data.error}: ${error.response.data.error_description}`);
        }
    }
};
