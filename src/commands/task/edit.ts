import { Command, Flags } from '@oclif/core';

import { Task, TaskChange } from '../../helpers/api/ms-graph/task';
import { TaskList } from '../../helpers/api/ms-graph/task-list';
import formatLog from '../../helpers/log/format-log';

export default class TaskEdit extends Command {
    static description = 'edit a Task';

    static examples = [
        '<%= config.bin %> <%= command.id %> "Buy bread" "Shopping List" -t "Buy white bread"',
        '<%= config.bin %> <%= command.id %> "Buy bread" "Shopping List" --body "White bread"',
    ];

    static flags = {
        format: Flags.boolean({
            char: 'F', description: 'Format the response in plain text',
        }),
        json: Flags.boolean({
            char: 'J', description: 'Format the response in JSON',
        }),
        title: Flags.string({
            char: 't',
            description: 'Change the title',
            required: false,
        }),
        body: Flags.string({
            char: 'b',
            description: 'Change the body',
            required: false,
        }),
        'body-type': Flags.string({
            char: 'T',
            description: 'Change the type of the body',
            options: ['text', 'html'],
            required: false,
        }),
    };

    static args = [
        {
            name: 'name',
            description: 'The name or id of the Task you want to edit',
            required: true,
        },
        {
            name: 'taskListName',
            description: 'The name or id of the TaskList in which the Task is located',
            required: false,
        },
    ];

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(TaskEdit);

        if (flags.json && flags.format)
            throw new Error('Cannot format in both JSON and plain text');

        if (!flags.title && !flags.body && !flags['body-type'])
            throw new Error('You must change at least 1 value!');

        const taskList: TaskList | undefined = await TaskList.getTaskListByNameOrId(args.taskListName);

        if (!taskList)
            throw new Error(`Can not find TaskList with name or id ${args.taskListName}`);

        const task: Task | undefined = await taskList.getTaskByNameOrId(args.name);

        if (!task)
            throw new Error(`Can not find Task with name or id ${args.name}`);

        const editTask: TaskChange = {};

        if (flags.title) editTask.title = flags.title;
        if (flags.body) editTask.body = {
            content: flags.body,
            contentType: ((flags['body-type'] as 'text' | 'html' | undefined) || task.body.contentType),
        };

        await task.edit(taskList, editTask);

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
            formatLog(this, task, `Changed Task ${task.title} (${task.id})`, flags);
        }
    }
}
