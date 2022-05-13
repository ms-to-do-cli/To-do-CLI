import { Command, Flags } from '@oclif/core';

import { TaskList } from '../../helpers/api/ms-graph/task-list';
import formatLog from '../../helpers/log/format-log';

export default class ListEdit extends Command {
    static description = 'edit TaskList name';

    static flags = {
        format: Flags.boolean({
            char: 'F', description: 'Format the response in plain text',
        }),
        json: Flags.boolean({
            char: 'J', description: 'Format the response in JSON',
        }),
    };

    static args = [
        {
            name: 'currentName',
            description: 'The current name of the TaskList you want to edit the name of',
            required: true,
        },
        {
            name: 'newName',
            description: 'The new name for the TaskList',
            required: true,
        },
    ];

    static examples = [
        '<%= config.bin %> <%= command.id %> "Grocery List" "Shopping List"',
    ];

    public async run(): Promise<void> {
        const { flags, args } = await this.parse(ListEdit);

        if (flags.json && flags.format)
            throw new Error('Cannot format in both JSON and plain text');

        const taskList: TaskList | undefined = await TaskList.getTaskListByName(args.currentName);

        if (!taskList)
            throw new Error(`Can not find TaskList with name ${args.currentName}`);

        const prevName = taskList.displayName;

        await taskList.editDisplayName(args.newName);
        formatLog(this, taskList, `Changed TaskList name from ${prevName} to ${taskList.displayName}`, flags);
    }
}
