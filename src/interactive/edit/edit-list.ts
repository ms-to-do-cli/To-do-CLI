import I from '../../commands/i';
import { TaskList } from '../../helpers/api/ms-graph/task-list';
import { Interactive } from '../interactive';

const trimpInput = (input: string): string => input.trim();

async function addList(this: I): Promise<void> {
    const res: { name: string, newname: string } = await Interactive.prompt([{
        type: 'input',
        name: 'name',
        message: 'Which TaskList do you want to edit',
        transformer: trimpInput,
        filter: trimpInput,
    }, {
        type: 'input',
        name: 'newname',
        message: 'Enter the new desired name for the TaskList',
        transformer: trimpInput,
        filter: trimpInput,
    }]);

    if (!res.name) throw new Error('You must choose a TaskList!');
    if (!res.newname) throw new Error('You must enter a new name!');

    const taskList: TaskList | undefined = await TaskList.getTaskListByName(res.name);

    if (!taskList)
        throw new Error(`Can not find TaskList with name ${res.name}`);

    const prevName = taskList.displayName;

    await taskList.editDisplayName(res.newname);

    this.log(`Changed TaskList name from ${prevName} to ${taskList.displayName}`);
}

export default addList;
