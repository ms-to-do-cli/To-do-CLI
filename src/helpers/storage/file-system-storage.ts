// https://macprotricks.com/test-driven-development-with-the-oclif-testing-library-part-one/
import { constants, PathLike, promises as fs } from 'node:fs';
import { Stream } from 'node:stream';

export class FileSystemStorage {
    public static access(fileName: string): Promise<void> {
        return fs.access(fileName, constants.R_OK | constants.W_OK);
    }

    public static mkdir(dirname: string): Promise<string | undefined> {
        return fs.mkdir(dirname, { recursive: true });
    }

    public static writeFile(file: PathLike | fs.FileHandle, data: string | NodeJS.ArrayBufferView | Iterable<string | NodeJS.ArrayBufferView> | AsyncIterable<string | NodeJS.ArrayBufferView> | Stream) {
        return fs.writeFile(file, data, 'utf8');
    }

    public static readFile(path: PathLike | fs.FileHandle): Promise<string> {
        return fs.readFile(path, 'utf8');
    }
}
