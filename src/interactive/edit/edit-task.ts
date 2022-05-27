import I from '../../commands/i';
import { Task } from '../../helpers/api/ms-graph/task';
import { TaskList } from '../../helpers/api/ms-graph/task-list';
import { Interactive } from '../interactive';

const trimpInput = (input: string): string => input.trim();

async function editTask(this: I): Promise<void> {
    const lists = await TaskList.getTaskLists();
    const listsNames = lists.map(list => list.displayName);

    const { listName }: { listName: string } = await Interactive.prompt([{
        type: 'autocomplete',
        name: 'listName',
        suggestOnly: true,
        message: 'From which TaskList do you want to edit the Task of',
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

    const tasks = await taskList.getTasks();
    const taskNames = tasks.map(task => task.title);

    const { taskName }: { taskName: string } = await Interactive.prompt([{
        type: 'autocomplete',
        name: 'taskName',
        message: 'Choose the Task you want to edit',
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

    const editTaskValues: { title: string, addBody: boolean } = await Interactive.prompt([{
        type: 'input',
        name: 'title',
        message: 'Enter a new title',
        transformer: trimpInput,
        filter: (input: string): string => {
            const str = trimpInput(input);
            if (str.length === 0) return task.title;
            return str;
        },
        default: task.title,
    },
    {
        type: 'confirm',
        name: 'addBody',
        default: false,
        message: 'Would you like to add a body',
    }]);

    const prevTitle = task.title;

    await task.edit(taskList, {
        title: editTaskValues.title,
        ...(editTaskValues.addBody ? {
            body: (await Interactive.prompt([
                {
                    type: 'editor',
                    name: 'content',
                    message: 'Fill in the body of the Task',
                    extension: 'html',
                    default: task.body.content,
                },
                {
                    type: 'list',
                    name: 'contentType',
                    message: 'What type is the body',
                    default: 'text',
                    choices: ['text', 'html'],
                },
            ])),
        } : {}),
    });

    this.log(`Changed Task with title ${prevTitle} ${task.title === prevTitle ? '' : `to ${task.title} `}from TaskList ${taskList.displayName}`);
}

export default editTask;
