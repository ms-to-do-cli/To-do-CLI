/* eslint-disable @typescript-eslint/ban-ts-comment */

import { expect, test } from '@oclif/test';

import { AppData } from '../../src/helpers/config/app-data';
import { MemoryStorage } from '../../src/helpers/storage/memory-storage';
import { appDataFileName } from '../helpers/app-data-file-name';
import { config } from '../../src/helpers/config/config';

import getAppDataPath from 'appdata-path';
import * as Path from 'node:path';

let textByLine = 'asdfdf';
const fs = require('fs');
fs.readFile(getAppDataPath(config.app.name), function (text) {
    textByLine = text.split('\n');
});

describe('logout', () => {
    describe('[GOOD]', () => {
        describe('remove settings.json data', () => {
            test
                .stdout()
            // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .do(() => {
                    MemoryStorage.files.push({
                        name: appDataFileName,
                        data: '{}',
                    });
                })
                .command(['logout'])
                .it('runs logout', ctx => {
                    expect(ctx.stdout).to.contain('You are logged out');
                });
        });
        describe('already logged out', () => {
            test
                .stdout()
            // @ts-ignore
                .stub(AppData, 'storage', MemoryStorage)
                .command(['logout'])
                .it('runs logout', ctx => {
                    expect(textByLine).to.equal('{}');
                    expect(ctx.stdout).to.contain('You are already logged out');
                });
        });
    });
});
