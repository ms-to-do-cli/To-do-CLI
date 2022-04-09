/* eslint-disable @typescript-eslint/ban-ts-comment */

import { expect, test } from '@oclif/test';

import { AppData } from '../../src/helpers/config/app-data';
import { MemoryStorage } from '../../src/helpers/storage/memory-storage';
import { appDataFileName } from '../helpers/app-data-file-name';
import { mockLogin } from '../helpers/mock/login';
import reset from '../helpers/reset';

describe('logout', () => {
    beforeEach(reset);
    describe('[GOOD]', () => {
        describe('remove settings.json data', () => {
            test
                .stdout()
            // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(mockLogin)
                .command(['logout'])
                .it('runs logout', ctx => {
                    const file = MemoryStorage.files.find(f => f.name === appDataFileName);
                    expect(file).to.not.be.undefined;
                    expect(file?.data).to.eq('{}');
                    expect(ctx.stdout).to.contain('You are logged out');
                });
        });
        describe('already logged out', () => {
            test
                .stdout()
            // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .command(['logout'])
                .it('runs logout without being logged in', ctx => {
                    const file = MemoryStorage.files.find(f => f.name === appDataFileName);
                    expect(file?.data).to.eq('{}');
                    expect(ctx.stdout).to.contain('You are already logged out');
                });
        });
    });
});
