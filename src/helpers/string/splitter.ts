/**
 * Splits the given string with new-lines, every `length` (argument) chars
 * @param str the string you want to split
 * @param length the amount of characters you want in every line
 * @param splitLongText if it is `<= 0`, do nothing, otherwise split long text from this number of characters
 * @returns the new split string
 */
export const splitter = (str: string, length = 50, splitLongText = 0) => {
    return (splitLongText > 0 ? str.replace(new RegExp(`([^ ]{${splitLongText}})`, 'g'), '$1 ') : str).replace(new RegExp(`(.{${length}}\\w*) `, 'g'), '$1\n');
};
