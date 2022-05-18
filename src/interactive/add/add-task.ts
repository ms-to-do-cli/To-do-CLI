import I from '../../commands/i';
import { Task } from '../../helpers/api/ms-graph/task';
import { TaskList } from '../../helpers/api/ms-graph/task-list';
import { Interactive } from '../interactive';

const trimpInput = (input: string): string => input.trim();

async function addTask(this: I): Promise<void> {
    const lists = await TaskList.getTaskLists();
    const listsNames = lists.map(list => list.displayName);

    const res: { title: string, listName: string, addBody: boolean } = await Interactive.prompt([
        {
            type: 'autocomplete',
            name: 'listName',
            suggestOnly: true,
            message: 'In which TaskList do you want to create the Task',
            emptyText: 'No list with that name',
            source: (_: any, input: string) => {
                if (!input)
                    return listsNames;

                return listsNames
                    .filter((listName: string) => listName.toLowerCase().includes(input.toLowerCase()));
            },
        },
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the Task',
            transformer: trimpInput,
            filter: trimpInput,
        },
        {
            type: 'confirm',
            name: 'addBody',
            default: false,
            message: 'Would you like to add a body',
        },
    ]);

    if (!res.title) throw new Error('You have to give a title!');

    const taskList: TaskList | undefined = await TaskList.getTaskListByNameOrId(res.listName);
    if (!taskList)
        throw new Error(`Can not find TaskList with name ${res.listName}`);

    const task: Task = await taskList.createTask({
        title: res.title,

        ...(res.addBody ? {
            body: (await Interactive.prompt([
                {
                    type: 'editor',
                    name: 'content',
                    message: 'Fill in the body of the Task',
                    extension: 'html',
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

    this.log(`Added new Task with title ${task.title} to TaskList ${taskList.displayName}`);
}

export default addTask;
