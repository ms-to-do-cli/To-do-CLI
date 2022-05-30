import { Command, Flags } from '@oclif/core';
import Table from 'cli-table';

import { Task } from '../../helpers/api/ms-graph/task';
import { TaskList } from '../../helpers/api/ms-graph/task-list';
import { splitter } from '../../helpers/string/splitter';

export default class TaskShow extends Command {
    static description = 'Lists the tasks in a TaskList';

    static examples = ['<%= config.bin %> <%= command.id %>'];

    static flags = {
        format: Flags.boolean({
            char: 'F', description: 'Format the response in plain text',
        }), json: Flags.boolean({
            char: 'J', description: 'Format the response in JSON',
        }), body: Flags.boolean({
            char: 'b', description: 'Show the body (details) of the Task',
        }), id: Flags.boolean({
            char: 'd', description: 'Show the ID of the Task',
        }), incomplete: Flags.boolean({
            char: 'i', description: 'Only show the Tasks that are not complete yet',
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

        if (flags.json && flags.format) throw new Error('Cannot format in both JSON and plain text');

        const taskList: TaskList | undefined = await TaskList.getTaskListByNameOrId(args.taskListName);

        if (taskList === undefined) throw new Error('There is no TaskList with the given name');

        let tasks: Task[] = await taskList.getTasks();

        if (flags.incomplete) tasks = tasks.filter(task => task.status !== 'completed');

        if (flags.json) {
            this.log(JSON.stringify(tasks, null, '  '));
        } else if (flags.format) {
            let message = '';

            for (const [i, task] of tasks.entries()) {
                message += `${i}_@odata.etag=${task['@odata.etag']}\n\r`;
                message += `${i}_importance=${task.importance}\n\r`;
                message += `${i}_status=${task.status}\n\r`;
                message += `${i}_title=${task.title}\n\r`;
                message += `${i}_createdDateTime=${task.createdDateTime}\n\r`;
                message += `${i}_lastModifiedDateTime=${task.lastModifiedDateTime}\n\r`;
                message += `${i}_completedDateTime_dateTime=${task.completedDateTime?.dateTime}\n\r`;
                message += `${i}_completedDateTime_timeZone=${task.completedDateTime?.timeZone}\n\r`;

                if (flags.body) {
                    message += `${i}_body_content=${task.body.content}\n\r`;
                    message += `${i}_body_contentType=${task.body.contentType}\n\r`;
                }

                if (flags.id) message += `${i}_id=${task.id}\n\r`;
            }

            this.log(message);
        } else {
            const head = ['Status', 'Name'];

            if (flags.body) head.push('Body');
            if (flags.id) head.push('Id');

            const table = new Table({ head });

            tasks.sort((t1, t2) => Task.statusOrder.indexOf(t1.status) - Task.statusOrder.indexOf(t2.status));

            for (const task of tasks) {
                const arr = [task.status === 'completed' ? 'X' : '', splitter(task.title, 30, 30)];

                if (flags.body) arr.push(splitter(task.body.content, 60, 60));
                if (flags.id) arr.push(splitter(task.id));

                table.push(arr);
            }

            this.log(table.toString());
        }
    }
}
