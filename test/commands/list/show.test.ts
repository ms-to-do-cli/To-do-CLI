/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expect, test } from '@oclif/test';
import getAppDataPath from 'appdata-path';
import { describe } from 'mocha';
import * as Path from 'node:path';

import { MsGraphErrorResponse } from '../../../src/helpers/api/ms-graph/axios/axios-microsoft-graph-error';
import { TaskListResponseData } from '../../../src/helpers/api/ms-graph/task-list';
import { AppData } from '../../../src/helpers/config/app-data';
import { config } from '../../../src/helpers/config/config';
import { MemoryStorage } from '../../../src/helpers/storage/memory-storage';
import reset from '../../helpers/reset';

const appDataFileName = Path.join(getAppDataPath(config.app.name), config.app.settings.fileName);

const mockData: { taskListResponseData: TaskListResponseData[], badTokensResponse: MsGraphErrorResponse[] } = {
    taskListResponseData: [{
        '@odata.etag': 'ODATA_ETAG',
        id: 'AAAAAAAAAA',
        wellknownListName: 'defaultList',
        displayName: 'Taken',
        isOwner: true,
        isShared: false,
    }, {
        '@odata.etag': 'ODATA_ETAG',
        id: 'BBBBBBBBBB',
        displayName: 'Shopping list',
        wellknownListName: 'none',
        isOwner: true,
        isShared: false,
    }],
    badTokensResponse: [
        {
            error: {
                code: 'InvalidAuthenticationToken',
                message: 'CompactToken validation failed with reason code: CODE.',
                innerError: {
                    date: 'DATE',
                    'request-id': 'REQUEST_ID',
                    'client-request-id': 'CLIENT_REQUEST_ID',
                },
            },
        },
    ],
};

const mockLogin = () => {
    MemoryStorage.files.push({
        name: appDataFileName,
        data: '{"authorizationToken": "AUTHORIZATION_TOKEN"}',
    });
};

describe('list:show', () => {
    beforeEach(reset);

    describe('[GOOD]', () => {
        describe('no format', () => {
            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com/v1.0', api => {
                    api.get('/me/todo/lists').reply(200, {
                        '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#users(\'USER\')/todo/lists',
                        value: [mockData.taskListResponseData[0]],
                    } as { '@odata.context': string, value: TaskListResponseData[] });
                })
                .command(['list:show'])
                .it('runs list show', ctx => {
                    expect(ctx.stdout).to.contain('Owner | Share | Name  | Id\n  X   |       | Taken | AAAAAAAAAA');
                });

            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com/v1.0', api => {
                    api.get('/me/todo/lists').reply(200, {
                        '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#users(\'USER\')/todo/lists',
                        value: [mockData.taskListResponseData[0], mockData.taskListResponseData[1]],
                    } as { '@odata.context': string, value: TaskListResponseData[] });
                })
                .command(['list:show'])
                .it('runs list show', ctx => {
                    expect(ctx.stdout).to.contain('Owner | Share | Name          | Id\n  X   |       | Taken         | AAAAAAAAAA\n  X   |       | Shopping list | BBBBBBBBBB');
                });
        });
        describe('json', () => {
            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com/v1.0', api => {
                    api.get('/me/todo/lists').reply(200, {
                        '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#users(\'USER\')/todo/lists',
                        value: [mockData.taskListResponseData[0]],
                    } as { '@odata.context': string, value: TaskListResponseData[] });
                })
                .command(['list:show', '-J'])
                .it('runs list show -J', ctx => {
                    expect(JSON.parse(ctx.stdout)).deep.equal([mockData.taskListResponseData[0]]);
                });

            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com/v1.0', api => {
                    api.get('/me/todo/lists').reply(200, {
                        '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#users(\'USER\')/todo/lists',
                        value: [mockData.taskListResponseData[0], mockData.taskListResponseData[1]],
                    } as { '@odata.context': string, value: TaskListResponseData[] });
                })
                .command(['list:show', '--json'])
                .it('runs list show --json', ctx => {
                    expect(JSON.parse(ctx.stdout)).deep.equal([mockData.taskListResponseData[0], mockData.taskListResponseData[1]]);
                });
        });

        describe('format', () => {
            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com/v1.0', api => {
                    api.get('/me/todo/lists').reply(200, {
                        '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#users(\'USER\')/todo/lists',
                        value: [mockData.taskListResponseData[0]],
                    } as { '@odata.context': string, value: TaskListResponseData[] });
                })
                .command(['list:show', '-F'])
                .it('runs list show --f', ctx => {
                    expect(ctx.stdout).to.contain('0_@odata.etag=ODATA_ETAG');
                    expect(ctx.stdout).to.contain('0_id=AAAAAAAAAA');
                    expect(ctx.stdout).to.contain('0_wellknownListName=defaultList');
                    expect(ctx.stdout).to.contain('0_displayName=Taken');
                    expect(ctx.stdout).to.contain('0_isOwner=true');
                    expect(ctx.stdout).to.contain('0_isShared=false');
                });

            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com/v1.0', api => {
                    api.get('/me/todo/lists').reply(200, {
                        '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#users(\'USER\')/todo/lists',
                        value: [mockData.taskListResponseData[0], mockData.taskListResponseData[1]],
                    } as { '@odata.context': string, value: TaskListResponseData[] });
                })
                .command(['list:show', '--format'])
                .it('runs list show --format', ctx => {
                    expect(ctx.stdout).to.contain('0_@odata.etag=ODATA_ETAG');
                    expect(ctx.stdout).to.contain('0_id=AAAAAAAAAA');
                    expect(ctx.stdout).to.contain('0_wellknownListName=defaultList');
                    expect(ctx.stdout).to.contain('0_displayName=Taken');
                    expect(ctx.stdout).to.contain('0_isOwner=true');
                    expect(ctx.stdout).to.contain('0_isShared=false');
                    expect(ctx.stdout).to.contain('1_@odata.etag=ODATA_ETAG');
                    expect(ctx.stdout).to.contain('1_id=BBBBBBBBBB');
                    expect(ctx.stdout).to.contain('1_wellknownListName=none');
                    expect(ctx.stdout).to.contain('1_displayName=Shopping list');
                    expect(ctx.stdout).to.contain('1_isOwner=true');
                    expect(ctx.stdout).to.contain('1_isShared=false');
                });
        });
    });
    describe('[BAD]', () => {
        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .command(['list:show'])
            .catch('To use this command, you must be logged in')
            .it('runs list show | must be logged in');

        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .do(mockLogin)
            .nock('https://graph.microsoft.com/v1.0', api => {
                api.get('/me/todo/lists').reply(401, mockData.badTokensResponse[0]);
            })
            .command(['list:show'])
            .catch('Request failed with status code 401')
            .it('runs list show | InvalidAuthenticationToken / no token');
    });
});
