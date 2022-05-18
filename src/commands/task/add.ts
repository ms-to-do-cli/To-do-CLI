import { Command, Flags } from '@oclif/core';

import { Task } from '../../helpers/api/ms-graph/task';
import { TaskList } from '../../helpers/api/ms-graph/task-list';
import formatLog from '../../helpers/log/format-log';

export default class TaskAdd extends Command {
    static description = 'Create a Task';

    static examples = ['<%= config.bin %> <%= command.id %>'];

    static flags = {
        format: Flags.boolean({
            char: 'F', description: 'Format the response in plain text',
        }), json: Flags.boolean({
            char: 'J', description: 'Format the response in JSON',
        }),
    };

    static args = [{
        name: 'name', description: 'the name of the Task you want to add', required: true,
    }, {
        name: 'listName',
        description: 'the name or id of the TaskList to which you want to add the new task',
        required: true,
    }];

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(TaskAdd);

        if (flags.json && flags.format) throw new Error('Cannot format in both JSON and plain text');

        const taskList: TaskList | undefined = await TaskList.getTaskListByNameOrId(args.listName);

        if (!taskList) throw new Error(`Can not find TaskList with name or id ${args.listName}`);

        const task: Task = await taskList.createTask({
            title: args.name,
        });

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
            formatLog(this, task, `Added new Task ${task.title} to ${taskList.displayName}`, flags);
        }
    }
}
