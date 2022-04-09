import Table from 'cli-table';

import I from '../commands/i';
import { TaskList } from '../helpers/api/ms-graph/task-list';

async function list(this: I): Promise<void> {
    const listsReq = TaskList.getTaskLists();

    const table = new Table({
        head: ['name', 'owner', 'shared'],
    });

    const lists = await listsReq; // optimization

    for (const { displayName, isOwner, isShared } of lists)
        table.push([displayName, isOwner ? 'x' : ' ', isShared ? 'x' : ' ']);

    this.log(table.toString());
}

export default list;
