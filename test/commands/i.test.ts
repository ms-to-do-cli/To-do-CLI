/* eslint-disable @typescript-eslint/ban-ts-comment */
// https://github.com/oclif/oclif/issues/286
import { expect, test } from '@oclif/test';

import { ListTasksResponse } from '../../src/helpers/api/ms-graph/task';
import { TaskListResponseData } from '../../src/helpers/api/ms-graph/task-list';
import { AppData } from '../../src/helpers/config/app-data';
import { MemoryStorage } from '../../src/helpers/storage/memory-storage';
import { Interactive } from '../../src/interactive/interactive';
import { interactivePrompt } from '../helpers/interactive-prompt';
import listMocks from '../helpers/mock/data/list-mocks';
import taskMocks from '../helpers/mock/data/task-mocks';
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

    describe('task', () => {
        describe('[GOOD]', () => {
            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .stub(Interactive, 'prompt', interactivePrompt([{ commandName: 'task' }, { listName: 'Taken' }]))
                .do(mockLogin)
                .nock('https://graph.microsoft.com', api => {
                    api.get('/v1.0/me/todo/lists').reply(200, {
                        '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#users(\'USER\')/todo/lists',
                        value: [listMocks.taskListResponseData[0]],
                    } as { '@odata.context': string, value: TaskListResponseData[] });

                    api.get(/\/v1.0\/me\/todo\/lists\/.*\/tasks/i).reply(200, {
                        value: [taskMocks.taskResponseData[0]],
                    } as ListTasksResponse);
                })
                .command(['i'])
                .it('shows one task', ctx => {
                    expect(ctx.stdout).to.contain(
                        '┌───────────┬───────────┬─────────┐\n' +
                        '│ Name      │ Status    │ Content │\n' +
                        '├───────────┼───────────┼─────────┤\n' +
                        '│ Buy bread │ completed │         │\n' +
                        '└───────────┴───────────┴─────────┘');
                });

            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .stub(Interactive, 'prompt', interactivePrompt([{ commandName: 'task' }, { listName: 'Taken' }]))
                .do(mockLogin)
                .nock('https://graph.microsoft.com', api => {
                    api.get('/v1.0/me/todo/lists').reply(200, {
                        '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#users(\'USER\')/todo/lists',
                        value: [listMocks.taskListResponseData[0]],
                    } as { '@odata.context': string, value: TaskListResponseData[] });

                    api.get(/\/v1.0\/me\/todo\/lists\/.*\/tasks/i).reply(200, {
                        value: [taskMocks.taskResponseData[0], taskMocks.taskResponseData[1]],
                    } as ListTasksResponse);
                })
                .command(['i'])
                .it('shows two tasks', ctx => {
                    expect(ctx.stdout).to.contain(
                        '┌───────────┬────────────┬────────────────────┐\n' +
                        '│ Name      │ Status     │ Content            │\n' +
                        '├───────────┼────────────┼────────────────────┤\n' +
                        '│ Buy bread │ completed  │                    │\n' +
                        '├───────────┼────────────┼────────────────────┤\n' +
                        '│ Antivirus │ notStarted │ Download antivirus │\n' +
                        '└───────────┴────────────┴────────────────────┘');
                });

            test
                .stdout()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .stub(Interactive, 'prompt', interactivePrompt([{ commandName: 'task' }, { listName: 'Taken' }]))
                .do(mockLogin)
                .nock('https://graph.microsoft.com', api => {
                    api.get('/v1.0/me/todo/lists').reply(200, {
                        '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#users(\'USER\')/todo/lists',
                        value: [listMocks.taskListResponseData[0]],
                    } as { '@odata.context': string, value: TaskListResponseData[] });

                    api.get(/\/v1.0\/me\/todo\/lists\/.*\/tasks/i).reply(200, {
                        value: [taskMocks.taskResponseData[0], taskMocks.taskResponseData[1], taskMocks.taskResponseData[2]],
                    } as ListTasksResponse);
                })
                .command(['i'])
                .it('shows 3 tasks + body split new-line', ctx => {
                    expect(ctx.stdout).to.contain(
                        '┌─────────────┬────────────┬───────────────────────────────────────────────────────────────────────────────┐\n' +
                        '│ Name        │ Status     │ Content                                                                       │\n' +
                        '├─────────────┼────────────┼───────────────────────────────────────────────────────────────────────────────┤\n' +
                        '│ Buy bread   │ completed  │                                                                               │\n' +
                        '├─────────────┼────────────┼───────────────────────────────────────────────────────────────────────────────┤\n' +
                        '│ Antivirus   │ notStarted │ Download antivirus                                                            │\n' +
                        '├─────────────┼────────────┼───────────────────────────────────────────────────────────────────────────────┤\n' +
                        '│ Lorem ipsum │ notStarted │ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel tellus      │\n' +
                        '│             │            │ eget felis dapibus condimentum non ut eros. Nam sodales ornare bibendum.      │\n' +
                        '│             │            │ Etiam molestie ut nisl sit amet blandit. Morbi pretium consectetur quam,      │\n' +
                        '│             │            │ id ornare arcu. Nulla ornare, sem vitae rhoncus feugiat, odio est tristique   │\n' +
                        '│             │            │ magna, nec volutpat elit enim id tellus. Donec venenatis sollicitudin tellus, │\n' +
                        '│             │            │ et maximus dui semper vitae. Maecenas laoreet lectus vitae ex sagittis        │\n' +
                        '│             │            │ vestibulum. Mauris posuere metus eget erat egestas, quis viverra tortor       │\n' +
                        '│             │            │ porta. Fusce egestas aliquet justo, in tempus ligula rutrum at. Sed aliquet   │\n' +
                        '│             │            │ ornare lorem et ultricies. Mauris quis orci viverra, mattis arcu quis,        │\n' +
                        '│             │            │ gravida nisl. Aliquam semper sapien nunc, et lacinia lectus sollicitudin      │\n' +
                        '│             │            │ in.                                                                           │\n' +
                        '└─────────────┴────────────┴───────────────────────────────────────────────────────────────────────────────┘');
                });
        });

        describe('[BAD]', () => {
            test
                .stderr()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .stub(Interactive, 'prompt', interactivePrompt([{ commandName: 'task' }, { listName: 'notAValidName' }]))
                .do(mockLogin)
                .do(interactiveExitOnError)
                .nock('https://graph.microsoft.com', api => {
                    api.get('/v1.0/me/todo/lists').reply(200, {
                        '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#users(\'USER\')/todo/lists',
                        value: [listMocks.taskListResponseData[0], listMocks.taskListResponseData[1], listMocks.taskListResponseData[2]],
                    } as { '@odata.context': string, value: TaskListResponseData[] });
                })
                .command(['i'])
                .catch('You have to select a List!')
                .it('no list with given name');

            test
                .stderr()
                // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .stub(Interactive, 'prompt', interactivePrompt([{ commandName: 'task' }]))
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
                .stub(Interactive, 'prompt', interactivePrompt([{ commandName: 'task' }]))
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
