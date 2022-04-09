/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expect, test } from '@oclif/test';
import { describe } from 'mocha';

import { AppData } from '../../../src/helpers/config/app-data';
import { MemoryStorage } from '../../../src/helpers/storage/memory-storage';
import listMocks from '../../helpers/mock/data/list-mocks';
import { mockLogin } from '../../helpers/mock/login';
import reset from '../../helpers/reset';

describe('list:add', () => {
    beforeEach(reset);

    describe('[GOOD]', () => {
        describe('no format', () => {
            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com/v1.0', api => {
                    api.post('/me/todo/lists').reply(200, listMocks.taskListResponseData[1]);
                })
                .command(['list:add', 'Shopping list'])
                .it('runs list add Shopping list', ctx => {
                    expect(ctx.stdout).to.contain('Added new list named Shopping list');
                });
        });
        describe('json', () => {
            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com/v1.0', api => {
                    api.post('/me/todo/lists').reply(200, listMocks.taskListResponseData[1]);
                })
                .command(['list:add', 'Shopping list', '--json'])
                .it('runs list add Shopping list --json', ctx => {
                    expect(ctx.stdout).to.not.be.null;
                    expect(ctx.stdout).to.not.be.undefined;
                    expect(ctx.stdout).to.not.be.empty;
                    expect(JSON.parse(ctx.stdout)).to.deep.equal(listMocks.taskListResponseData[1]);
                });

            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com/v1.0', api => {
                    api.post('/me/todo/lists').reply(200, listMocks.taskListResponseData[1]);
                })
                .command(['list:add', '-J', 'Shopping list'])
                .it('runs list add -J Shopping list', ctx => {
                    expect(ctx.stdout).to.not.be.null;
                    expect(ctx.stdout).to.not.be.undefined;
                    expect(ctx.stdout).to.not.be.empty;
                    expect(JSON.parse(ctx.stdout)).to.deep.equal(listMocks.taskListResponseData[1]);
                });
        });
        describe('format', () => {
            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com/v1.0', api => {
                    api.post('/me/todo/lists').reply(200, listMocks.taskListResponseData[1]);
                })
                .command(['list:add', 'Shopping list', '--format'])
                .it('runs list add Shopping list --format', ctx => {
                    expect(ctx.stdout).to.contain('@odata.etag=ODATA_ETAG');
                    expect(ctx.stdout).to.contain('displayName=Shopping list');
                    expect(ctx.stdout).to.contain('id=BBBBBBBBBB');
                    expect(ctx.stdout).to.contain('isOwner=true');
                    expect(ctx.stdout).to.contain('isShared=false');
                    expect(ctx.stdout).to.contain('wellknownListName=none');
                });

            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com/v1.0', api => {
                    api.post('/me/todo/lists').reply(200, listMocks.taskListResponseData[1]);
                })
                .command(['list:add', '-F', 'Shopping list'])
                .it('runs list add -F Shopping list', ctx => {
                    expect(ctx.stdout).to.contain('@odata.etag=ODATA_ETAG');
                    expect(ctx.stdout).to.contain('displayName=Shopping list');
                    expect(ctx.stdout).to.contain('id=BBBBBBBBBB');
                    expect(ctx.stdout).to.contain('isOwner=true');
                    expect(ctx.stdout).to.contain('isShared=false');
                    expect(ctx.stdout).to.contain('wellknownListName=none');
                });
        });
    });

    describe('[BAD]', () => {
        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .do(mockLogin)
            .nock('https://graph.microsoft.com/v1.0', api => {
                api.post('/me/todo/lists').reply(400, listMocks.badTokensResponse[1]);
            })
            .command(['list:add', 'NAME'])
            .catch('Request failed with status code 400')
            .it('runs list add NAME | empty name');

        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .command(['list:add', 'NAME'])
            .catch('To use this command, you must be logged in')
            .it('runs list add NAME | must be logged in');

        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .command(['list:add', '--json', 'NAME', '-F'])
            .catch('Cannot format in both JSON and plain text')
            .it('runs list add --json NAME -F | format JSON and plain text');

        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .do(mockLogin)
            .nock('https://graph.microsoft.com/v1.0', api => {
                api.post('/me/todo/lists').reply(401, listMocks.badTokensResponse[0]);
            })
            .command(['list:add', 'NAME'])
            .catch('Request failed with status code 401')
            .it('runs list add NAME | InvalidAuthenticationToken / no token');
    });
});
