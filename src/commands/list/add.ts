import { Command, Flags } from '@oclif/core';

import { TaskList } from '../../helpers/api/ms-graph/task-list';
import formatLog from '../../helpers/log/format-log';

export default class ListAdd extends Command {
    static description = 'describe the command here';

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

    static args = [{
        name: 'name',
        description: 'the name of the list you want to add',
        required: true,
    }];

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(ListAdd);

        if (flags.json && flags.format)
            throw new Error('Cannot format in both JSON and plain text');

        const taskList: TaskList = await TaskList.create(args.name);

        formatLog(this, taskList, `Added new list named ${taskList.displayName}`, flags);
    }
}
