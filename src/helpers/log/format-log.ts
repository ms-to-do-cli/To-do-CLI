import { jsonToText } from '../json-to-text';
import { Command } from '@oclif/core';

// eslint-disable-next-line valid-jsdoc
/**
 * Prints the data in the given format `json`/`key-value`.
 * <br>
 * If both `json` and `format` are `true`, `json` is chosen
 *
 * @param command the class-object itself
 * @param data the data you want to print in the given format
 * @param dataNoFormat the data you want to print, if no type of format is given
 * @param {json, format} typeOfFormat Set the wanted format to true
 * @param type the name of the log function, (`log`|`warn`|`error`)
 * @return void
 *
 * @example
 *  formatLog(this.log, res, res.message, flags);
 */
export default (command: Command, data: Record<any, any>, dataNoFormat: string, {
    json,
    format,
}: { json: boolean, format: boolean }, type: 'log' | 'warn' | 'error' = 'log') => {
    if (json)
        command[type](JSON.stringify(data, null, '  '));
    else if (format)
        command[type](jsonToText(data));
    else
        command[type](dataNoFormat);
};
