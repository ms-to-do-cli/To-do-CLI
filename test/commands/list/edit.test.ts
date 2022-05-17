/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expect, test } from '@oclif/test';
import { describe } from 'mocha';
import * as fs from 'node:fs';

import { TaskListResponseData } from '../../../src/helpers/api/ms-graph/task-list';
import { AppData } from '../../../src/helpers/config/app-data';
import { MemoryStorage } from '../../../src/helpers/storage/memory-storage';
import listMocks from '../../helpers/mock/data/list-mocks';
import { mockLogin } from '../../helpers/mock/login';
import reset from '../../helpers/reset';

const getTaskLists = (api: any) => {
    api.get('/me/todo/lists').reply(200, {
        value: listMocks.taskListResponseData,
    } as { value: TaskListResponseData[] });
};

describe('list:edit', () => {
    beforeEach(reset);

    describe('[GOOD]', () => {
        describe('no format', () => {
            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com/v1.0', api => {
                    getTaskLists(api);
                    api.patch('/me/todo/lists/BBBBBBBBBB').reply(200, {
                        ...listMocks.taskListResponseData[1],
                        displayName: 'Grocery List',
                    });
                })
                .command(['list:edit', 'Shopping list', 'Grocery List'])
                .it('runs list edit Shopping list Grocery List', ctx => {
                    fs.writeFileSync('C:\\Users\\lande\\AppData\\Roaming\\JetBrains\\IntelliJIdea2022.1\\scratches\\txt', ctx.stdout, 'utf-8');
                    expect(ctx.stdout).to.contain('Changed TaskList name from Shopping list to Grocery List');
                });

            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com/v1.0', api => {
                    getTaskLists(api);
                    api.patch('/me/todo/lists/CCCCCCCCCC').reply(200, {
                        ...listMocks.taskListResponseData[2],
                        displayName: 'lessons',
                    });
                })
                .command(['list:edit', 'SCHOOL', 'lessons'])
                .it('runs list edit SCHOOL lessons', ctx => {
                    expect(ctx.stdout).to.contain('Changed TaskList name from SCHOOL to lessons');
                });
        });
        describe('json', () => {
            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com/v1.0', api => {
                    getTaskLists(api);
                    api.patch('/me/todo/lists/BBBBBBBBBB').reply(200, {
                        ...listMocks.taskListResponseData[1],
                        displayName: 'Grocery List',
                    });
                })
                .command(['list:edit', 'Shopping list', 'Grocery List', '--json'])
                .it('runs list edit Shopping list Grocery List --json', ctx => {
                    expect(ctx.stdout).to.not.be.null;
                    expect(ctx.stdout).to.not.be.undefined;
                    expect(ctx.stdout).to.not.be.empty;
                    expect(JSON.parse(ctx.stdout)).to.deep.equal({
                        ...listMocks.taskListResponseData[1],
                        displayName: 'Grocery List',
                    });
                });

            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com/v1.0', api => {
                    getTaskLists(api);
                    api.patch('/me/todo/lists/BBBBBBBBBB').reply(200, {
                        ...listMocks.taskListResponseData[1],
                        displayName: 'Grocery List',
                    });
                })
                .command(['list:edit', '-J', 'Shopping list', 'Grocery List'])
                .it('runs list edit -J Shopping list Grocery List', ctx => {
                    expect(ctx.stdout).to.not.be.null;
                    expect(ctx.stdout).to.not.be.undefined;
                    expect(ctx.stdout).to.not.be.empty;
                    expect(JSON.parse(ctx.stdout)).to.deep.equal({
                        ...listMocks.taskListResponseData[1],
                        displayName: 'Grocery List',
                    });
                });
        });
        describe('format', () => {
            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com/v1.0', api => {
                    getTaskLists(api);
                    api.patch('/me/todo/lists/BBBBBBBBBB').reply(200, {
                        ...listMocks.taskListResponseData[1],
                        displayName: 'Grocery List',
                    });
                })
                .command(['list:edit', 'Shopping list', 'Grocery List', '--format'])
                .it('runs list edit Shopping list Grocery List --format', ctx => {
                    expect(ctx.stdout).to.contain('@odata.etag=ODATA_ETAG');
                    expect(ctx.stdout).to.contain('displayName=Grocery List');
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
                    getTaskLists(api);
                    api.patch('/me/todo/lists/BBBBBBBBBB').reply(200, {
                        ...listMocks.taskListResponseData[1],
                        displayName: 'Grocery List',
                    });
                })
                .command(['list:edit', '-F', 'Shopping list', 'Grocery List'])
                .it('runs list edit -F Shopping list Grocery List', ctx => {
                    expect(ctx.stdout).to.contain('@odata.etag=ODATA_ETAG');
                    expect(ctx.stdout).to.contain('displayName=Grocery List');
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
            .command(['list:edit', 'NAME'])
            .catch('Missing 1 required arg:\nnewName  The new name for the TaskList\nSee more help with --help')
            .it('runs list edit NAME NEWNAME | empty name');
        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .do(mockLogin)
            .nock('https://graph.microsoft.com/v1.0', api => {
                getTaskLists(api);
            })
            .command(['list:edit', 'NAME', 'NEW NAME'])
            .catch('Can not find TaskList with name NAME')
            .it('runs list edit NAME NEWNAME | NAME NOT FOUND');

        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .command(['list:edit', 'NAME', 'NEWNAME'])
            .catch('To use this command, you must be logged in')
            .it('runs list edit NAME NEWNAME | must be logged in');

        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .command(['list:edit', '--json', 'NAME', 'NEWNAME', '-F'])
            .catch('Cannot format in both JSON and plain text')
            .it('runs list edit --json NAME NEWNAME -F | format JSON and plain text');

        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .do(mockLogin)
            .nock('https://graph.microsoft.com/v1.0', api => {
                api.get('/me/todo/lists').reply(401, listMocks.badTokensResponse[0]);
            })
            .command(['list:edit', 'NAME', 'NEWNAME'])
            .catch('Request failed with status code 401')
            .it('runs list edit NAME NEWNAME | InvalidAuthenticationToken / no token');
    });
});
