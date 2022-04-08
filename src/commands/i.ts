import { Command } from '@oclif/core';

import { Interactive } from '../interactive/interactive';

export default class I extends Command {
    /**
     * Mainly for testing.
     * see test/helpers/mock/interactive-exit-on-error.ts
     */
    public static exitOnError = false;

    static description = 'start the interactive CLI';

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ];

    public async run(): Promise<void> {
        let exit = false;
        do {
            try {
                const command = await Interactive.requestCommand();
                await command.run.call(this);
            } catch (error: any | Error) {
                if (error.code === 'EEXIT') {
                    exit = true;
                } else {
                    this.error(error.message, { exit: I.exitOnError as unknown as number });
                }
            }
        } while (!exit);
    }
}
