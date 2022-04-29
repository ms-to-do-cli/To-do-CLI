/* eslint-disable @typescript-eslint/ban-ts-comment */

import { expect, test } from '@oclif/test';

import { ListTasksResponse } from '../../../src/helpers/api/ms-graph/task';
import { TaskListResponseData } from '../../../src/helpers/api/ms-graph/task-list';
import { AppData } from '../../../src/helpers/config/app-data';
import { MemoryStorage } from '../../../src/helpers/storage/memory-storage';
import listMocks from '../../helpers/mock/data/list-mocks';
import taskMocks from '../../helpers/mock/data/task-mocks';
import { mockLogin } from '../../helpers/mock/login';
import reset from '../../helpers/reset';

describe('task:show', () => {
    beforeEach(reset);

    describe('[GOOD]', () => {
        describe('no format', () => {
            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com', api => {
                    api.get('/v1.0/me/todo/lists').reply(200, {
                        value: [listMocks.taskListResponseData[0]],
                    } as { '@odata.context': string, value: TaskListResponseData[] });

                    api.get(/\/v1.0\/me\/todo\/lists\/.*\/tasks/i).reply(200, {
                        value: [taskMocks.taskResponseData[0]],
                    } as ListTasksResponse);
                })
                .command(['task:show'])
                .it('shows 1 task', ctx => {
                    expect(ctx.stdout).to.contain(
                        '┌───────────┬────────────┐\n' +
                        '│ Name      │ Id         │\n' +
                        '├───────────┼────────────┤\n' +
                        '│ Buy bread │ 1111111111 │\n' +
                        '└───────────┴────────────┘');
                });

            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com', api => {
                    api.get('/v1.0/me/todo/lists').reply(200, {
                        value: [listMocks.taskListResponseData[0]],
                    } as { '@odata.context': string, value: TaskListResponseData[] });

                    api.get(/\/v1.0\/me\/todo\/lists\/.*\/tasks/i).reply(200, {
                        value: [taskMocks.taskResponseData[0], taskMocks.taskResponseData[1]],
                    } as ListTasksResponse);
                })
                .command(['task:show'])
                .it('shows 2 tasks', ctx => {
                    expect(ctx.stdout).to.contain(
                        '┌───────────┬────────────┐\n' +
                        '│ Name      │ Id         │\n' +
                        '├───────────┼────────────┤\n' +
                        '│ Buy bread │ 1111111111 │\n' +
                        '├───────────┼────────────┤\n' +
                        '│ Antivirus │ 2222222222 │\n' +
                        '└───────────┴────────────┘');
                });

            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com', api => {
                    api.get('/v1.0/me/todo/lists').reply(200, {
                        value: [listMocks.taskListResponseData[1]],
                    } as { '@odata.context': string, value: TaskListResponseData[] });

                    api.get(/\/v1.0\/me\/todo\/lists\/.*\/tasks/i).reply(200, {
                        value: [taskMocks.taskResponseData[0]],
                    } as ListTasksResponse);
                })
                .command(['task:show', 'Shopping list'])
                .it('runs show task with specified TaskListName', ctx => {
                    expect(ctx.stdout).to.contain(
                        '┌───────────┬────────────┐\n' +
                        '│ Name      │ Id         │\n' +
                        '├───────────┼────────────┤\n' +
                        '│ Buy bread │ 1111111111 │\n' +
                        '└───────────┴────────────┘');
                });

            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com', api => {
                    api.get('/v1.0/me/todo/lists').reply(200, {
                        value: [listMocks.taskListResponseData[1]],
                    } as { '@odata.context': string, value: TaskListResponseData[] });

                    api.get(/\/v1.0\/me\/todo\/lists\/.*\/tasks/i).reply(200, {
                        value: [taskMocks.taskResponseData[0]],
                    } as ListTasksResponse);
                })
                .command(['task:show', 'ShOpPiNg LiSt'])
                .it('runs show task with specified TaskListName | case insensitive', ctx => {
                    expect(ctx.stdout).to.contain(
                        '┌───────────┬────────────┐\n' +
                        '│ Name      │ Id         │\n' +
                        '├───────────┼────────────┤\n' +
                        '│ Buy bread │ 1111111111 │\n' +
                        '└───────────┴────────────┘');
                });
        });

        describe('json', () => {
            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com', api => {
                    api.get('/v1.0/me/todo/lists').reply(200, {
                        value: [listMocks.taskListResponseData[0]],
                    } as { '@odata.context': string, value: TaskListResponseData[] });

                    api.get(/\/v1.0\/me\/todo\/lists\/.*\/tasks/i).reply(200, {
                        value: [taskMocks.taskResponseData[0], taskMocks.taskResponseData[1]],
                    } as ListTasksResponse);
                })
                .command(['task:show', '--json'])
                .it('shows 2 tasks', ctx => {
                    expect(JSON.parse(ctx.stdout)).to.deep.equal([taskMocks.taskResponseData[0], taskMocks.taskResponseData[1]]);
                });
        });

        describe('format', () => {
            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .nock('https://graph.microsoft.com', api => {
                    api.get('/v1.0/me/todo/lists').reply(200, {
                        value: [listMocks.taskListResponseData[0]],
                    } as { '@odata.context': string, value: TaskListResponseData[] });

                    api.get(/\/v1.0\/me\/todo\/lists\/.*\/tasks/i).reply(200, {
                        value: [taskMocks.taskResponseData[0], taskMocks.taskResponseData[1]],
                    } as ListTasksResponse);
                })
                .command(['task:show', '--format'])
                .it('shows 2 tasks', ctx => {
                    expect(ctx.stdout).to.contain('0_id=1111111111');
                    expect(ctx.stdout).to.contain('0_importance=low');
                    expect(ctx.stdout).to.contain('0_status=completed');
                    expect(ctx.stdout).to.contain('0_title=Buy bread');
                    expect(ctx.stdout).to.contain('0_createdDateTime=2020-01-29T00:00:00');
                    expect(ctx.stdout).to.contain('0_lastModifiedDateTime=2020-01-29T00:00:00');
                    expect(ctx.stdout).to.contain('0_completedDateTime_dateTime=2020-01-30T00:00:00');
                    expect(ctx.stdout).to.contain('0_completedDateTime_timeZone=UTC');
                    expect(ctx.stdout).to.contain('0_status=completed');

                    expect(ctx.stdout).to.contain('1_id=2222222222');
                    expect(ctx.stdout).to.contain('1_importance=low');
                    expect(ctx.stdout).to.contain('1_status=notStarted');
                    expect(ctx.stdout).to.contain('1_title=Antivirus');
                    expect(ctx.stdout).to.contain('1_createdDateTime=2020-02-29T00:00:00');
                    expect(ctx.stdout).to.contain('1_lastModifiedDateTime=2020-02-29T00:00:00');
                    expect(ctx.stdout).to.contain('1_completedDateTime_dateTime=undefined');
                    expect(ctx.stdout).to.contain('1_completedDateTime_timeZone=undefined');
                    expect(ctx.stdout).to.contain('1_status=notStarted');
                });
        });
    });

    describe('[BAD]', () => {
        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .command(['task:show'])
            .catch('To use this command, you must be logged in')
            .it('runs task show | must be logged in');

        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .command(['task:show', '--json', 'NAME', '-F'])
            .catch('Cannot format in both JSON and plain text')
            .it('runs task show --json NAME -F | format JSON and plain text');

        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .do(mockLogin)
            .nock('https://graph.microsoft.com', api => {
                api.get('/v1.0/me/todo/lists').reply(200, {
                    value: [listMocks.taskListResponseData[1]],
                } as { '@odata.context': string, value: TaskListResponseData[] });
            })
            .command(['task:show', '--json'])
            .catch('There is no TaskList with the given name')
            .it('runs task show | no TaskList with given name');

        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .do(mockLogin)
            .nock('https://graph.microsoft.com/v1.0', api => {
                api.get('/me/todo/lists').reply(401, listMocks.badTokensResponse[0]);
            })
            .command(['task:show'])
            .catch('Request failed with status code 401')
            .it('runs task show | InvalidAuthenticationToken / no token');
    });
});
