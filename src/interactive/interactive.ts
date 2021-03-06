import * as inquirer from 'inquirer';
import { QuestionCollection } from 'inquirer';
import PromptUI from 'inquirer/lib/ui/prompt';
import inquirerPrompt from 'inquirer-autocomplete-prompt';

import I from '../commands/i';
import add from './add/add';
import complete from './complete';
import edit from './edit/edit';
import exit from './exit';
import incomplete from './incomplete';
import list from './list';
import task from './task';

export class Interactive {
    public static commands: InteractiveCommand[] = [
        { name: 'list', run: list },
        { name: 'task', run: task },
        { name: 'add', run: add },
        { name: 'edit', run: edit },
        { name: 'complete', run: complete },
        { name: 'incomplete', run: incomplete },
        { name: 'exit', run: exit },
    ];

    public static prompt = (questions: QuestionCollection<any>): Promise<any> & { ui: PromptUI<any> } => {
        inquirer.registerPrompt('autocomplete', inquirerPrompt);

        return inquirer.prompt(questions);
    };

    public static async requestCommand(): Promise<InteractiveCommand> {
        const res = await Interactive.prompt([
            {
                type: 'autocomplete',
                name: 'commandName',
                suggestOnly: true,
                message: 'td (h for help)',
                emptyText: 'Nothing found!',
                source: (_: any, input: string) => {
                    if (!input)
                        return Interactive.commands
                            .map(({ name }) => name);

                    return Interactive.commands
                        .filter(({ name }) => name.includes(input))
                        .map(({ name }) => name);
                },
            },
        ]);

        const command: InteractiveCommand | undefined = Interactive.commands.find(({ name }) => name === res.commandName);
        if (!command) throw new Error('This command does not exist, try `help`');

        return command;
    }
}

export interface InteractiveCommand {
    name: string;
    run: InteractiveRun;
}

export type InteractiveRun = (this: I) => Promise<any>
