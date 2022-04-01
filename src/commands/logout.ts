/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
import {Command, Flags} from '@oclif/core';

import { DevicecodeResponse, getAuthorizationToken, getDevicecode } from '../helpers/api/ms-graph/login';

import { AppData } from '../helpers/config/app-data';

import formatLog from '../helpers/log/format-log';



export default class Logout extends Command {

  static flags = {
    format: Flags.boolean({
        char: 'F', description: 'Format the response in plain text',
    }),
    json: Flags.boolean({
        char: 'J', description: 'Format the response in JSON',
    }),
  }

  static description = 'Log out of your microsoft account'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static args = [{name: 'file'}]

  public async run(): Promise<void> {
    const { flags } = await this.parse(Logout);

        if (flags.json && flags.format)
            throw new Error('Cannot format in both JSON and plain text');



      if (await AppData.isAuthenticated()) {
        // The previous user is logged off, while the new user can log on
        delete AppData.settings.authorizationToken;
        delete AppData.settings.login;
        await AppData.storeSettings();
        const message = 'You are logged out.';
        formatLog(this, { message }, message, flags);
      } else {
        const message2 = 'You are already logged out.';
        formatLog(this, { message2 }, message2, flags);
      }
  }
}
