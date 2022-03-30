// https://macprotricks.com/test-driven-development-with-the-oclif-testing-library-part-one/
import { constants, promises as fs } from 'node:fs';

export class FileSystemStorage {
    public static access(fileName: string): Promise<void> {
        return fs.access(fileName, constants.R_OK | constants.W_OK);
    }

    public static mkdir(dirname: string): Promise<string | undefined> {
        return fs.mkdir(dirname, { recursive: true });
    }

    public static writeFile(file: string, data: string) {
        return fs.writeFile(file, data, 'utf8');
    }

    public static readFile(path: string): Promise<string> {
        return fs.readFile(path, 'utf8');
    }
}
