import { Command, Flags } from '@oclif/core';
import { DevicecodeResponse, getAuthorizationToken, getDevicecode } from '../helpers/api/ms-graph/login';
import { AppData } from '../helpers/config/app-data';
import formatLog from '../helpers/log/format-log';

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

        // check wether is logged in
        if (await AppData.isAuthenticated()) {
            // The previous user is logged off, while the new user can log on
            delete AppData.settings.authorizationToken;
            delete AppData.settings.login;
        }

        if (await AppData.isTryingToAuthenticate() && await getAuthorizationToken()) {
            // AUTHENTICATED
            const message = 'You are logged in';
            formatLog(this, { message }, message, flags);
            return;
        }

        const res: DevicecodeResponse = await getDevicecode();

        res.message += ' After you have logged in, run this command again to validate';

        formatLog(this, res, res.message, flags);
    }
}
