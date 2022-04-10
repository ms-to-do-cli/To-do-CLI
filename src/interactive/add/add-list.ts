import I from '../../commands/i';
import { TaskList } from '../../helpers/api/ms-graph/task-list';
import { Interactive } from '../interactive';

const trimpInput = (input: string): string => input.trim();

async function addList(this: I): Promise<void> {
    const res: { name: string } = await Interactive.prompt([{
        type: 'input',
        name: 'name',
        message: 'Enter a name',
        transformer: trimpInput,
        filter: trimpInput,
    }]);

    if (!res.name) throw new Error('You have to give a name!');

    const taskList: TaskList = await TaskList.create(res.name);

    this.log(`Added new list named ${taskList.displayName}`);
}

export default addList;
