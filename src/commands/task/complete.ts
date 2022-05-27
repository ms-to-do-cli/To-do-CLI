import { Command, Flags } from '@oclif/core';

import { Task } from '../../helpers/api/ms-graph/task';
import { TaskList } from '../../helpers/api/ms-graph/task-list';
import formatLog from '../../helpers/log/format-log';

export default class TaskComplete extends Command {
    static description = 'Complete a task';

    static examples = [
        '<%= config.bin %> <%= command.id %> "Buy bread" "Shopping List"',
        '<%= config.bin %> <%= command.id %> "Buy bread"',
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
        name: 'name', description: 'the name of the Task you want to complete', required: true,
    }, {
        name: 'listName',
        description: 'the name or id of the TaskList to which you want to complete the Task',
        required: false,
        default: 'defaultList',
    }];

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(TaskComplete);

        if (flags.json && flags.format)
            throw new Error('Cannot format in both JSON and plain text');

        const taskList: TaskList | undefined = await TaskList.getTaskListByNameOrId(args.listName);

        if (!taskList)
            throw new Error(`Can not find TaskList with name or id ${args.taskListName}`);

        const task: Task | undefined = await taskList.getTaskByNameOrId(args.name);

        if (!task)
            throw new Error(`Can not find Task with name or id ${args.name}`);

        if (task.status === 'completed')
            return this.print(true, task, flags);

        await task.edit(taskList, {
            status: 'completed',
        });

        this.print(false, task, flags);
    }

    private print(alreadyCompleted: boolean, task: Task, flags: { json: boolean; format: boolean }): void {
        if (flags.format) {
            this.log(`@odata.etag=${task['@odata.etag']}
importance=${task.importance}
status=${task.status}
title=${task.title}
createdDateTime=${task.createdDateTime}
lastModifiedDateTime=${task.lastModifiedDateTime}
completedDateTime_dateTime=${task.completedDateTime?.dateTime}
completedDateTime_timeZone=${task.completedDateTime?.timeZone}
body_content=${task.body.content}
body_contentType=${task.body.contentType}
id=${task.id}
`);
        } else {
            formatLog(this, task, alreadyCompleted ? `Task ${task.title} had already been completed` : `Task ${task.title} completed`, flags);
        }
    }
}
