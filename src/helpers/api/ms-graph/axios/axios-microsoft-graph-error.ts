import { AxiosError } from 'axios';

export default class AxiosMicrosoftGraphError extends Error {
    constructor(message: string, axiosError: AxiosError<MsErrorResponse>) {
        if (axiosError.response)
            super(`${message}: ${axiosError.response.status} ${axiosError.response.statusText}\r\n${axiosError.response.data.error}: ${axiosError.response.data.error_description}`);
        else
            super(message);
    }
}

export interface MsGraphErrorResponse {
    'error': {
        'code': string,
        'message': string,
        'innerError': {
            'code'?: string,
            'date': string,
            'request-id': string,
            'client-request-id': string
        }
    };
}

export interface MsErrorResponse {
    'error': string;
    'error_description': string;
    'error_codes': number[];
    'timestamp': string;
    'trace_id': string;
    'correlation_id': string;
    'error_uri': string;
}
