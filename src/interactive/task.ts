import Table from 'cli-table';

import I from '../commands/i';
import { Task } from '../helpers/api/ms-graph/task';
import { TaskList } from '../helpers/api/ms-graph/task-list';
import { splitter } from '../helpers/string/splitter';
import { Interactive } from './interactive';

async function task(this: I): Promise<void> {
    const lists = await TaskList.getTaskLists();
    const listsNames = lists.map(list => list.displayName);

    const res = await Interactive.prompt([
        {
            type: 'autocomplete',
            name: 'listName',
            suggestOnly: true,
            message: 'From which list?',
            emptyText: 'No list with that name',
            source: (_: any, input: string) => {
                if (!input)
                    return listsNames;

                return listsNames
                    .filter((listName: string) => listName.toLowerCase().includes(input.toLowerCase()));
            },
        },
    ]);

    const chosenList: TaskList | undefined = lists.find(list => list.displayName.toLowerCase().includes(res.listName.toLowerCase()));
    if (!chosenList) throw new Error('You have to select a List!');

    const tasksReq: Promise<Task[]> = chosenList.getTasks();

    const table = new Table({
        head: ['Name', 'Status', 'Content'],
    });

    for (const { title, status, body: { content } } of (await tasksReq))
        table.push([title, status, splitter(content, 70)]);

    this.log(table.toString());
}

export default task;
