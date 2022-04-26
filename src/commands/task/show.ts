import { Command, Flags } from '@oclif/core';
import Table from 'cli-table';

import { Task } from '../../helpers/api/ms-graph/task';
import { TaskList } from '../../helpers/api/ms-graph/task-list';

export default class TaskShow extends Command {
    static description = 'Lists the tasks in a TaskList';

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
        name: 'taskListName',
        required: false,
        description: 'The name of the TaskList from which the tasks are to be taken',
        default: 'defaultList',
    }];

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(TaskShow);

        if (flags.json && flags.format)
            throw new Error('Cannot format in both JSON and plain text');

        const taskList: TaskList | undefined = await TaskList.getTaskListByName(args.taskListName);

        if (taskList === undefined)
            throw new Error('There is no TaskList with the given name');

        const tasks: Task[] = await taskList.getTasks();

        if (flags.json) {
            this.log(JSON.stringify(tasks, null, '  '));
        } else if (flags.format) {
            let message = '';

            for (const [i, task] of tasks.entries()) {
                message += `${i}_@odata.etag=${task['@odata.etag']}\n\r`;
                message += `${i}_id=${task.id}\n\r`;
                message += `${i}_importance=${task.importance}\n\r`;
                message += `${i}_status=${task.status}\n\r`;
                message += `${i}_title=${task.title}\n\r`;
                message += `${i}_createdDateTime=${task.createdDateTime}\n\r`;
                message += `${i}_lastModifiedDateTime=${task.lastModifiedDateTime}\n\r`;
                message += `${i}_completedDateTime_dateTime=${task.completedDateTime?.dateTime}\n\r`;
                message += `${i}_completedDateTime_timeZone=${task.completedDateTime?.timeZone}\n\r`;
            }

            this.log(message);
        } else {
            const table = new Table({
                head: ['Name', 'Id'],
            });

            for (const task of tasks)
                table.push([task.title, task.id]);

            this.log(table.toString());
        }
    }
}
