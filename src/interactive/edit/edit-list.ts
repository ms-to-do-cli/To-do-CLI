import I from '../../commands/i';
import { TaskList } from '../../helpers/api/ms-graph/task-list';
import { Interactive } from '../interactive';

const trimpInput = (input: string): string => input.trim();

async function addList(this: I): Promise<void> {
    const lists = await TaskList.getTaskLists();
    const listsNames = lists.map(list => list.displayName);

    const res: { name: string, newname: string } = await Interactive.prompt([{
        type: 'autocomplete',
        name: 'name',
        suggestOnly: true,
        message: 'Which TaskList do you want to edit',
        emptyText: 'No list with that name',
        transformer: trimpInput,
        source: (_: any, input: string) => {
            if (!input)
                return listsNames;

            return listsNames
                .filter((listName: string) => listName.toLowerCase().includes(input.toLowerCase()));
        },
    }, {
        type: 'input',
        name: 'newname',
        message: 'Enter the new desired name for the TaskList',
        transformer: trimpInput,
        filter: trimpInput,
    }]);

    if (!res.name) throw new Error('You must choose a TaskList!');
    if (!res.newname) throw new Error('You must enter a new name!');

    const taskList: TaskList | undefined = await TaskList.getTaskListByNameOrId(res.name);

    if (!taskList)
        throw new Error(`Can not find TaskList with name ${res.name}`);

    const prevName = taskList.displayName;

    await taskList.editDisplayName(res.newname);

    this.log(`Changed TaskList name from ${prevName} to ${taskList.displayName}`);
}

export default addList;
