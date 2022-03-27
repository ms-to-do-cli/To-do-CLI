import { Command, Flags } from '@oclif/core';
import { DevicecodeResponse, getDevicecode } from '../helpers/api/ms-graph/login';
import { jsonToText } from '../helpers/json-to-text';

export default class Login extends Command {
    static description = 'login into the graph api';

    static flags = {
        format: Flags.boolean({
            char: 'F', description: 'Format the response in plain text',
        }),
        json: Flags.boolean({
            char: 'J', description: 'Format the response in JSON',
        }),
    };

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ];

    public async run(): Promise<void> {
        const { flags } = await this.parse(Login);

        if (flags.json && flags.format)
            throw new Error('Cannot format in both JSON and plain text');

        const res: DevicecodeResponse | undefined = await getDevicecode();

        if (!res)
            throw new Error('Did not recieve a reply back');

        if (flags.json)
            this.log(JSON.stringify(res, null, '  '));
        else if (flags.format)
            this.log(jsonToText(res));
        else
            this.log(res.message);

        // TODO: Store device_code in application data
    }
}
