import I from '../../../src/commands/i';

/**
 * Causes the 'interactive' command to be terminated when an error is sent
 * @returns a function that changes `I.exitOnError` to `true`
 *
 * @example
 *  test.do(interactiveExitOnError)
 */
const interactiveExitOnError = () => {
    I.exitOnError = true;
};

export default interactiveExitOnError;
