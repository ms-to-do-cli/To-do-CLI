import { UUID } from '../default-types';

export type Config = {
    microsoftGraph: {
        client: {
            id: UUID;
        },
        scope: string;
        url: {
            devicecode: string;
            authorizationToken: string;
            default: string;
        }
    },
    app: {
        name: string;
        settings: {
            fileName: string;
        }
    }
};

export const config: Config = {
    microsoftGraph: {
        client: {
            id: '4c301e95-436e-45df-858a-62e26a6624e0',
        },
        scope: 'user.read openid profile offline_access Tasks.Read Tasks.ReadWrite Tasks.Read.Shared Tasks.ReadWrite.Shared',
        url: {
            devicecode: 'https://login.microsoftonline.com/consumers/oauth2/v2.0/devicecode',
            authorizationToken: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            default: 'https://graph.microsoft.com/v1.0',
        },
    },
    app: {
        name: 'Microsft-To-Do-CLI',
        settings: {
            fileName: 'settings.json',
        },
    },
};
