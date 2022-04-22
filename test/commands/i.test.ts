/* eslint-disable @typescript-eslint/ban-ts-comment */
// https://github.com/oclif/oclif/issues/286
import { expect, test } from '@oclif/test';

import { TaskListResponseData } from '../../src/helpers/api/ms-graph/task-list';
import { AppData } from '../../src/helpers/config/app-data';
import { MemoryStorage } from '../../src/helpers/storage/memory-storage';
import { Interactive } from '../../src/interactive/interactive';
import { interactivePrompt } from '../helpers/interactive-prompt';
import listMocks from '../helpers/mock/data/list-mocks';
import interactiveExitOnError from '../helpers/mock/interactive-exit-on-error';
import { mockLogin } from '../helpers/mock/login';
import reset from '../helpers/reset';

describe('[INTERACTIVE] i', () => {
    beforeEach(reset);

    describe('exit', () => {
        test
            .stdout()
            .stub(Interactive, 'prompt', interactivePrompt([]))
            .command(['i'])
            .it('runs exit', ctx => {
                expect(ctx.stdout).to.be.empty;
            });
    });

    describe('list', () => {
        describe('[GOOD]', () => {
            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .stub(Interactive, 'prompt', interactivePrompt([{ commandName: 'list' }]))
                .do(mockLogin)
                .nock('https://graph.microsoft.com', api => {
                    api.get('/v1.0/me/todo/lists').reply(200, {
                        '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#users(\'USER\')/todo/lists',
                        value: [listMocks.taskListResponseData[0]],
                    } as { '@odata.context': string, value: TaskListResponseData[] });
                })
                .command(['i'])
                .it('shows one list', ctx => {
                    expect(ctx.stdout).to.contain(
                        '┌───────┬───────┬────────┐\n' +
                        '│ name  │ owner │ shared │\n' +
                        '├───────┼───────┼────────┤\n' +
                        '│ Taken │ x     │        │\n' +
                        '└───────┴───────┴────────┘\n');
                });

            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .stub(Interactive, 'prompt', interactivePrompt([{ commandName: 'list' }]))
                .do(mockLogin)
                .nock('https://graph.microsoft.com', api => {
                    api.get('/v1.0/me/todo/lists').reply(200, {
                        '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#users(\'USER\')/todo/lists',
                        value: [listMocks.taskListResponseData[0], listMocks.taskListResponseData[1]],
                    } as { '@odata.context': string, value: TaskListResponseData[] });
                })
                .command(['i'])
                .it('shows two lists', ctx => {
                    expect(ctx.stdout).to.contain(
                        '┌───────────────┬───────┬────────┐\n' +
                        '│ name          │ owner │ shared │\n' +
                        '├───────────────┼───────┼────────┤\n' +
                        '│ Taken         │ x     │        │\n' +
                        '├───────────────┼───────┼────────┤\n' +
                        '│ Shopping list │ x     │        │\n' +
                        '└───────────────┴───────┴────────┘\n');
                });

            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .stub(Interactive, 'prompt', interactivePrompt([{ commandName: 'list' }]))
                .do(mockLogin)
                .nock('https://graph.microsoft.com', api => {
                    api.get('/v1.0/me/todo/lists').reply(200, {
                        '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#users(\'USER\')/todo/lists',
                        value: [listMocks.taskListResponseData[0], listMocks.taskListResponseData[1], listMocks.taskListResponseData[2]],
                    } as { '@odata.context': string, value: TaskListResponseData[] });
                })
                .command(['i'])
                .it('shows three lists | test owner & shared', ctx => {
                    expect(ctx.stdout).to.contain(
                        '┌───────────────┬───────┬────────┐\n' +
                        '│ name          │ owner │ shared │\n' +
                        '├───────────────┼───────┼────────┤\n' +
                        '│ Taken         │ x     │        │\n' +
                        '├───────────────┼───────┼────────┤\n' +
                        '│ Shopping list │ x     │        │\n' +
                        '├───────────────┼───────┼────────┤\n' +
                        '│ SCHOOL        │       │ x      │\n' +
                        '└───────────────┴───────┴────────┘\n');
                });
        });

        describe('[BAD]', () => {
            test
                .stderr()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .stub(Interactive, 'prompt', interactivePrompt([{ commandName: 'list' }]))
                .do(mockLogin)
                .do(interactiveExitOnError)
                .nock('https://graph.microsoft.com', api => {
                    api.get('/v1.0/me/todo/lists').reply(401, listMocks.badTokensResponse[0]);
                })
                .command(['i'])
                .catch('Request failed with status code 401')
                .it('status code 401');

            test
                .stderr()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .stub(Interactive, 'prompt', interactivePrompt([{ commandName: 'list' }]))
                .do(interactiveExitOnError)
                .command(['i'])
                .catch('To use this command, you must be logged in')
                .it('must be logged in');
        });
    });

    describe('add', () => {
        describe('list', () => {
            describe('[GOOD]', () => {
                test
                    .stdout()
                    // @ts-ignore
                    .stub(AppData, 'storage', MemoryStorage)
                    .stub(Interactive, 'prompt', interactivePrompt([{ commandName: 'add' }, { type: 'list' }, { name: 'Shopping list' }]))
                    .do(mockLogin)
                    .nock('https://graph.microsoft.com/v1.0', api => {
                        api.post('/me/todo/lists').reply(201, listMocks.taskListResponseData[1]);
                    })
                    .command(['i'])
                    .it('add new list', ctx => {
                        expect(ctx.stdout).to.contain('Added new list named Shopping list');
                    });
            });
        });

        describe('[BAD]', () => {
            test
                .stderr()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .stub(Interactive, 'prompt', interactivePrompt([{ commandName: 'add' }, { type: 'list' }, { name: 'Shopping list' }]))
                .do(mockLogin)
                .do(interactiveExitOnError)
                .nock('https://graph.microsoft.com', api => {
                    api.post('/v1.0/me/todo/lists').reply(401, listMocks.badTokensResponse[0]);
                })
                .command(['i'])
                .catch('Request failed with status code 401')
                .it('status code 401');

            test
                .stderr()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .stub(Interactive, 'prompt', interactivePrompt([{ commandName: 'add' }, { type: 'list' }, { name: 'Shopping list' }]))
                .do(interactiveExitOnError)
                .command(['i'])
                .catch('To use this command, you must be logged in')
                .it('must be logged in');
        });
    });
});
