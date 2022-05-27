import I from '../../commands/i';
import { Interactive, InteractiveCommand } from '../interactive';
import editList from './edit-list';
import editTask from './edit-task';

export const editTypes: InteractiveCommand[] = [
    { name: 'list', run: editList },
    { name: 'task', run: editTask },
];

async function edit(this: I): Promise<void> {
    const res: { type: string } = await Interactive.prompt([{
        type: 'autocomplete',
        name: 'type',
        suggestOnly: true,
        message: 'What would you like to edit?',
        emptyText: 'Nothing found!',
        source: (_: any, input: string) => {
            if (!input)
                return editTypes.map(({ name }) => name);

            return editTypes
                .filter(({ name }) => name.includes(input))
                .map(({ name }) => name);
        },
    }]);

    const command: InteractiveCommand | undefined = editTypes.find(({ name }) => name === res.type);
    if (!command) throw new Error('This command does not exist, try `help edit`');

    await command.run.call(this);
}

export default edit;
