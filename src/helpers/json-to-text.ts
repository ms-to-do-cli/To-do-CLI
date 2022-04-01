/**
 * Converts a {@link Record} to a 'key-value' format
 * @param data the data to be processed into a "key-value" format
 * @param join how each key-value should be divided
 * @returns the given data in "key-value" format
 */
export const jsonToText = (data: Record<any, any>, join = '\n\r'): string => {
    const arr = [];

    for (const i of Object.keys(data))
        arr.push(`${i}=${data[i]}`);

    return arr.join(join);
};
