import I from '../../commands/i';
import { Interactive, InteractiveCommand } from '../interactive';
import addList from './add-list';
import addTask from './add-task';

export const addTypes: InteractiveCommand[] = [
    { name: 'list', run: addList },
    { name: 'task', run: addTask },
];

async function add(this: I): Promise<void> {
    const res: { type: string } = await Interactive.prompt([{
        type: 'autocomplete',
        name: 'type',
        suggestOnly: true,
        message: 'What would you like to create?',
        emptyText: 'Nothing found!',
        source: (_: any, input: string) => {
            if (!input)
                return addTypes.map(({ name }) => name);

            return addTypes
                .filter(({ name }) => name.includes(input))
                .map(({ name }) => name);
        },
    }]);

    const command: InteractiveCommand | undefined = addTypes.find(({ name }) => name === res.type);
    if (!command) throw new Error('This command does not exist, try `help add`');

    await command.run.call(this);
}

export default add;
