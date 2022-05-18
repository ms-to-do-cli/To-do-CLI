/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expect, test } from '@oclif/test';
import { describe } from 'mocha';

import { TaskListResponseData } from '../../../src/helpers/api/ms-graph/task-list';
import { AppData } from '../../../src/helpers/config/app-data';
import { MemoryStorage } from '../../../src/helpers/storage/memory-storage';
import listMocks from '../../helpers/mock/data/list-mocks';
import taskMocks from '../../helpers/mock/data/task-mocks';
import { mockLogin } from '../../helpers/mock/login';
import reset from '../../helpers/reset';

describe('task:add', () => {
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
                        value: listMocks.taskListResponseData,
                    } as { value: TaskListResponseData[] });
                    api.post('/me/todo/lists/BBBBBBBBBB/tasks').reply(201, taskMocks.taskResponseData[0]);
                })
                .command(['task:add', 'Buy bread', 'Shopping list'])
                .it('runs task add "Buy bread" "Shopping list"', ctx => {
                    expect(ctx.stdout).to.contain('Added new Task Buy bread to Shopping list');
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
                        value: listMocks.taskListResponseData,
                    } as { value: TaskListResponseData[] });
                    api.post('/me/todo/lists/BBBBBBBBBB/tasks').reply(201, taskMocks.taskResponseData[0]);
                })
                .command(['task:add', 'Buy bread', 'Shopping list', '--json'])
                .it('runs task add "Buy bread" "Shopping list" --json', ctx => {
                    expect(ctx.stdout).to.not.be.null;
                    expect(ctx.stdout).to.not.be.undefined;
                    expect(ctx.stdout).to.not.be.empty;
                    expect(JSON.parse(ctx.stdout)).to.deep.equal(taskMocks.taskResponseData[0]);
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
                        value: listMocks.taskListResponseData,
                    } as { value: TaskListResponseData[] });
                    api.post('/me/todo/lists/BBBBBBBBBB/tasks').reply(201, taskMocks.taskResponseData[0]);
                })
                .command(['task:add', 'Buy bread', 'Shopping list', '--format'])
                .it('runs task add "Buy bread" "Shopping list" --format', ctx => {
                    expect(ctx.stdout).to.contain('importance=low');
                    expect(ctx.stdout).to.contain('status=completed');
                    expect(ctx.stdout).to.contain('title=Buy bread');
                    expect(ctx.stdout).to.contain('createdDateTime=2020-01-29T00:00:00');
                    expect(ctx.stdout).to.contain('lastModifiedDateTime=2020-01-29T00:00:00');
                    expect(ctx.stdout).to.contain('completedDateTime_dateTime=2020-01-30T00:00:00');
                    expect(ctx.stdout).to.contain('completedDateTime_timeZone=UTC');
                    expect(ctx.stdout).to.contain('body_content=');
                    expect(ctx.stdout).to.contain('body_contentType=text');
                    expect(ctx.stdout).to.contain('id=1111111111');
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
                api.get('/me/todo/lists').reply(200, {
                    value: listMocks.taskListResponseData,
                } as { value: TaskListResponseData[] });
            })
            .command(['task:add', 'NAME', 'LISTNAME'])
            .catch('Can not find TaskList with name or id LISTNAME')
            .it('runs task add NAME LISTNAME | invalid listname');

        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .do(mockLogin)
            .command(['task:add', 'NAME'])
            .catch('Missing 1 required arg:\nlistName  the name or id of the TaskList to which you want to add the new task\nSee more help with --help')
            .it('runs task add NAME | empty name');

        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .command(['task:add', 'NAME', 'LISTNAME'])
            .catch('To use this command, you must be logged in')
            .it('runs task add NAME LISTNAME | must be logged in');

        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .command(['task:add', '--json', 'NAME', 'LISTNAME', '-F'])
            .catch('Cannot format in both JSON and plain text')
            .it('runs task add --json NAME LISTNAME -F | format JSON and plain text');

        test
            .stderr()
            // @ts-ignore
            .stub(AppData, 'storage', MemoryStorage)
            .do(mockLogin)
            .nock('https://graph.microsoft.com/v1.0', api => {
                api.get('/me/todo/lists').reply(401, listMocks.badTokensResponse[0]);
            })
            .command(['task:add', 'NAME', 'LISTNAME'])
            .catch('Request failed with status code 401')
            .it('runs task add NAME LISTNAME | InvalidAuthenticationToken / no token');
    });
});
