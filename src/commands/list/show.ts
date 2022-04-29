import { Command, Flags } from '@oclif/core';
import Table from 'cli-table';

import { TaskList } from '../../helpers/api/ms-graph/task-list';

export default class ListShow extends Command {
    static description = 'show all the lists';

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ];

    static flags = {
        format: Flags.boolean({
            char: 'F', description: 'Format the response in plain text',
        }),
        json: Flags.boolean({
            char: 'J', description: 'Format the response in JSON',
        }),
    };

    public async run(): Promise<void> {
        const { flags } = await this.parse(ListShow);

        if (flags.json && flags.format)
            throw new Error('Cannot format in both JSON and plain text');

        const lists = (await TaskList.getTaskLists());
        if (flags.json) {
            this.log(JSON.stringify(lists, null, '  '));
        } else if (flags.format) {
            let message = '';

            for (const [i, list] of lists.entries()) {
                message += `${i}_@odata.etag=${list['@odata.etag']}\n\r`;
                message += `${i}_id=${list.id}\n\r`;
                message += `${i}_displayName=${list.displayName}\n\r`;
                message += `${i}_isOwner=${list.isOwner}\n\r`;
                message += `${i}_wellknownListName=${list.wellknownListName}\n\r`;
                message += `${i}_isShared=${list.isShared}\n\r`;
            }

            this.log(message);
        } else {
            const table = new Table({
                head: ['Owner', 'Share', 'Name', 'Id'],
            });

            for (const list of lists)
                table.push([list.isOwner, list.isShared, list.displayName, list.id]);
            this.log(table.toString());
        }
    }
}
