/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expect, test } from '@oclif/test';

import { MsErrorResponse } from '../../src/helpers/api/ms-graph/axios/axios-microsoft-graph-error';
import { AuthorizationTokenResponse, DevicecodeResponse } from '../../src/helpers/api/ms-graph/login';
import { AppData, Settings } from '../../src/helpers/config/app-data';
import { config } from '../../src/helpers/config/config';
import { MemoryStorage } from '../../src/helpers/storage/memory-storage';
import { appDataFileName } from '../helpers/app-data-file-name';
import reset from '../helpers/reset';

/* eslint-disable camelcase */
const mockData: { devicecodes: Array<DevicecodeResponse>, errors: Array<MsErrorResponse>, tokens: Array<AuthorizationTokenResponse> } = {
    devicecodes: [
        {
            user_code: 'FJAUPGYY2',
            device_code: 'DEVICE_CODE',
            verification_url: 'https://microsoft.com/devicelogin',
            expires_in: 900,
            interval: 5,
            message: 'To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code FJAUPGYY2 to authenticate.',
        },
    ],
    errors: [{
        error: 'expired_token',
        error_description: 'AADSTS70020: The provided value for the input parameter \'device_code\' is not valid. This device code has expired.\r\nTrace ID: 5c64af6a-074b-4363-b9b2-3007ff9d1100\r\nCorrelation ID: 34b636e3-8c36-4c1d-b94c-48d0710d1c7a\r\nTimestamp: 2022-03-30 14:55:07Z',
        error_codes: [
            70_020,
        ],
        timestamp: '2022-03-30 14:55:07Z',
        trace_id: 'TRACE_ID',
        correlation_id: 'CORRELATION_ID',
        error_uri: 'https://login.microsoftonline.com/error?code=70020',
    }],
    tokens: [
        {
            token_type: 'Bearer',
            scope: config.microsoftGraph.scope,
            expires_in: 3600,
            ext_expires_in: 3600,
            access_token: 'ACCESS_TOKEN',
            refresh_token: 'REFRESH_TOKEN',
            id_token: 'ID_TOKEN',
        },
    ],
};

describe('login', () => {
    beforeEach(reset);

    describe('[GOOD]', () => {
        describe('request devicecode', () => {
            describe('not yet logged in', () => {
                const checkMemoryStorageForLogin = () => {
                    const memoryStorageData = MemoryStorage.files.find(f => f.name === appDataFileName)?.data;
                    expect(memoryStorageData).to.not.be.null;
                    expect(memoryStorageData).to.not.be.undefined;
                    expect(memoryStorageData).to.exist;
                    expect(memoryStorageData).to.have.length.gt(0);
                    const memoryStorageDataParsed: Settings = JSON.parse(memoryStorageData as string);
                    expect(memoryStorageDataParsed?.login).to.exist;
                    expect(memoryStorageDataParsed.login?.expireDate).to.exist;
                    expect(memoryStorageDataParsed.login?.devicecode).to.exist;
                    expect(memoryStorageDataParsed.login?.devicecode).to.equal('DEVICE_CODE');
                };

                test
                    .stdout()
                    // @ts-ignore
                    .stub(AppData, 'storage', MemoryStorage)
                    .nock('https://login.microsoftonline.com', api => {
                        api.post('/consumers/oauth2/v2.0/devicecode').reply(200, mockData.devicecodes[0]);
                    })
                    .command(['login'])
                    .it('runs login', async ctx => {
                        expect(ctx.stdout).to.contain('To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code FJAUPGYY2 to authenticate. After you have logged in, run this command again to validate');
                        checkMemoryStorageForLogin();
                    });

                test
                    .stdout()
                    // @ts-ignore
                    .stub(AppData, 'storage', MemoryStorage)
                    .nock('https://login.microsoftonline.com', api => {
                        api.post('/consumers/oauth2/v2.0/devicecode').reply(200, mockData.devicecodes[0]);
                    })
                    .command(['login', '--json'])
                    .it('runs login --json', ctx => {
                        expect(JSON.parse(ctx.stdout)).deep.equal({
                            ...mockData.devicecodes[0],
                            message: mockData.devicecodes[0].message + ' After you have logged in, run this command again to validate',
                        });

                        checkMemoryStorageForLogin();
                    });

                test
                    .stdout()
                    // @ts-ignore
                    .stub(AppData, 'storage', MemoryStorage)
                    .nock('https://login.microsoftonline.com', api => {
                        api.post('/consumers/oauth2/v2.0/devicecode').reply(200, mockData.devicecodes[0]);
                    })
                    .command(['login', '--format'])
                    .it('runs login --format', ctx => {
                        expect(ctx.stdout).to.contain('user_code=FJAUPGYY2');
                        expect(ctx.stdout).to.contain('device_code=DEVICE_CODE');
                        expect(ctx.stdout).to.contain('verification_url=https://microsoft.com/devicelogin');
                        expect(ctx.stdout).to.contain('expires_in=900');
                        expect(ctx.stdout).to.contain('interval=5');
                        expect(ctx.stdout).to.contain('message=To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code FJAUPGYY2 to authenticate. After you have logged in, run this command again to validate');

                        checkMemoryStorageForLogin();
                    });
            });

            describe('already logged in', () => {
                test
                    .stdout()
                    // @ts-ignore
                    .stub(AppData, 'storage', MemoryStorage)
                    .nock('https://login.microsoftonline.com', api => {
                        api.post('/consumers/oauth2/v2.0/devicecode').reply(200, mockData.devicecodes[0]);
                    })
                    .do(() => {
                        MemoryStorage.files.push({
                            name: appDataFileName,
                            data: '{"authorizationToken": "AUTHORIZATION_TOKEN"}',
                        });
                    })
                    .command(['login'])
                    .it('runs login', ctx => {
                        expect(ctx.stdout).to.contain('To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code FJAUPGYY2 to authenticate. After you have logged in, run this command again to validate');
                    });
            });
        });

        describe('request access token', () => {
            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .nock('https://login.microsoftonline.com', api => {
                    api.post('/common/oauth2/v2.0/token').reply(200, mockData.tokens[0]);
                })
                .do(() => {
                    MemoryStorage.files.push({
                        name: appDataFileName,
                        data: '{"login": {"devicecode": "DEVICE_CODE", "expireDate": "2500-01-30T15:19:30.241Z"}}',
                    });
                })
                .command(['login'])
                .it('runs login', ctx => {
                    expect(ctx.stdout).to.contain('You are logged in');
                });

            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .nock('https://login.microsoftonline.com', api => {
                    api.post('/common/oauth2/v2.0/token').reply(200, mockData.tokens[0]);
                })
                .do(() => {
                    MemoryStorage.files.push({
                        name: appDataFileName,
                        data: '{"login": {"devicecode": "DEVICE_CODE", "expireDate": "2500-01-30T15:19:30.241Z"}}',
                    });
                })
                .command(['login', '-F'])
                .it('runs login -F', ctx => {
                    expect(ctx.stdout).to.contain('message=You are logged in');
                });

            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .nock('https://login.microsoftonline.com', api => {
                    api.post('/common/oauth2/v2.0/token').reply(200, mockData.tokens[0]);
                })
                .do(() => {
                    MemoryStorage.files.push({
                        name: appDataFileName,
                        data: '{"login": {"devicecode": "DEVICE_CODE", "expireDate": "2500-01-30T15:19:30.241Z"}}',
                    });
                })
                .command(['login', '-J'])
                .it('runs login -J', ctx => {
                    expect(JSON.parse(ctx.stdout)).deep.equal({ message: 'You are logged in' });
                });
        });
    });

    describe('[BAD]', () => {
        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .command(['login', '-F', '-J'])
            .catch('Cannot format in both JSON and plain text')
            .it('runs login -F -J | format both JSON and plain text');

        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .do(() => {
                MemoryStorage.files.push({
                    name: appDataFileName,
                    data: '{"login": {"devicecode": "DEVICE_CODE", "expireDate": "2500-01-30T15:19:30.241Z"}}',
                });
            })
            .nock('https://login.microsoftonline.com', api => {
                api.post('/common/oauth2/v2.0/token').reply(400, mockData.errors[0]);
            })
            .command(['login'])
            .catch(error => {
                expect(error.message).to.contain('Cannot request authorizationtoken');
            })
            .it('runs login | Cannot request authorizationtoken');
    });
});
