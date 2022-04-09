import axios, { AxiosResponse } from 'axios';

import { AppData } from '../../../config/app-data';
import { headers } from './headers';

export const request = async <ResponseType>(type: RequestType, url: string, data = {}): Promise<AxiosResponse<ResponseType>> => {
    switch (type) {
    case 'GET':
    case 'get':
        return axios.get<ResponseType>(url, {
            headers: {
                ...headers,
                Authorization: await getAuthorizationBearer(),
            },
        });
    case 'POST':
    case 'post':
        return axios.post<any, AxiosResponse<ResponseType>>(url, new URLSearchParams(data), {
            headers: {
                ...headers,
                Authorization: await getAuthorizationBearer(),
            },
        });
    default:
        throw new Error('(INTERNAL): the given http request type is not valid');
    }
};

export type RequestType = 'post' | 'POST' | 'get' | 'GET'

export const getAuthorizationBearer = async () => {
    if (!await AppData.isAuthenticated())
        throw new NotLoggedInError();

    return `Bearer ${AppData.settings.authorizationToken}`;
};

export class NotLoggedInError extends Error {
    public static readonly errorMessage = 'To use this command, you must be logged in';

    constructor(message = '') {
        super(NotLoggedInError.errorMessage + message);
    }
}
