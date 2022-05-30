import I from '../commands/i';
import { Task } from '../helpers/api/ms-graph/task';
import { TaskList } from '../helpers/api/ms-graph/task-list';
import { Interactive } from './interactive';

const trimpInput = (input: string): string => input.trim();

async function complete(this: I): Promise<void> {
    const lists = await TaskList.getTaskLists();
    const listsNames = lists.map(list => list.displayName);

    const { listName }: { listName: string } = await Interactive.prompt([{
        type: 'autocomplete',
        name: 'listName',
        suggestOnly: true,
        message: 'From which TaskList do you want to complete a Task',
        emptyText: 'No list with that name',
        transformer: trimpInput,
        source: (_: any, input: string) => {
            if (!input)
                return listsNames;

            return listsNames
                .filter((name: string) => name.toLowerCase().includes(input.toLowerCase()));
        },
    }]);

    if (!listName) throw new Error('You must choose a TaskList!');

    const taskList: TaskList | undefined = await TaskList.getTaskListByNameOrId(listName);

    if (!taskList)
        throw new Error(`Can not find TaskList with name ${listName}`);

    const tasks = (await taskList.getTasks()).filter(t => t.status !== 'completed');

    if (tasks.length === 0)
        throw new Error('No Tasks found to complete');

    const taskNames = tasks.map(task => task.title);

    const { taskName }: { taskName: string } = await Interactive.prompt([{
        type: 'autocomplete',
        name: 'taskName',
        message: 'Choose the Task you want to complete',
        suggestOnly: true,
        emptyText: 'No Task found with that name',
        transformer: trimpInput,
        filter: trimpInput,
        source: (_: any, input: string) => {
            if (!input)
                return taskNames;

            return taskNames
                .filter((name: string) => name.toLowerCase().includes(input.toLowerCase()));
        },
    }]);

    if (!taskName) throw new Error('You must choose a Task!');

    const task: Task | undefined = await taskList.getTaskByNameOrId(taskName);

    if (!task)
        throw new Error(`Can not find Task with name ${taskName} in TaskList ${taskList.displayName}`);

    await task.edit(taskList, {
        status: 'completed',
    });

    this.log(`Task ${task.title} completed`);
}

export default complete;
