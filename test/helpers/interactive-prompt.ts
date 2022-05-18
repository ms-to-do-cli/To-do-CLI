/**
 * Allows you to mock the interactive prompt
 * with the given responses
 * @param responses The responses the prompt has to return in chronological order
 * @param endWithExit whether it has to add the `exit` command at the end
 * @returns A callback function that returns the responses in order
 */
export const interactivePrompt = (responses: Record<string, string | number | boolean>[], endWithExit = true): () => Record<string, string | number | boolean> => {
    if (endWithExit)
        responses.push({ commandName: 'exit' });

    let i = 0;
    return () => responses[i++];
};
