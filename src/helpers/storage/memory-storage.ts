// https://macprotricks.com/test-driven-development-with-the-oclif-testing-library-part-one/

export class MemoryStorage {
    public static files: { name: string, data: string }[] = [];
    public static storageSettings = {
        canMkdir: true,
        canWriteFile: true,
    };

    public static async access(fileName: string): Promise<void> {
        if (!MemoryStorage.files.some(f => f.name === fileName))
            throw new FsError(`ENOENT: no such file or directory, access '${fileName}'`, -4058, 'ENOENT', 'access', fileName);
    }

    public static async mkdir(dirname: string): Promise<string | undefined> {
        if (!MemoryStorage.storageSettings.canMkdir)
            throw new FsError(`EPERM: operation not permitted, mkdir '${dirname}'`, -4048, 'EPERM', 'mkdir', dirname);

        return dirname;
    }

    public static async writeFile(file: string, data: string) {
        if (!MemoryStorage.storageSettings.canWriteFile)
            throw new FsError(`ENOENT: no such file or directory, open '${file}'`, -4058, 'ENOENT', 'open', file);

        const f = MemoryStorage.files.find(fi => fi.name === file);
        if (f)
            f.data = data;
        else
            MemoryStorage.files.push({ name: file, data });
    }

    public static async readFile(path: string): Promise<string> {
        const file = MemoryStorage.files.find(f => f.name === path);

        if (!file)
            throw new FsError(`ENOENT: no such file or directory, open '${path}'`, -4058, 'ENOENT', 'open', path);

        return file.data;
    }

    public static reset(): void {
        MemoryStorage.storageSettings = {
            canMkdir: true,
            canWriteFile: true,
        };
        MemoryStorage.files = [];
    }
}

export class FsError extends Error implements NodeJS.ErrnoException {
    constructor(message: string, public errno: number, public code: 'ENOENT' | 'EPERM', public syscall: 'open' | 'access' | 'mkdir', public path: string) {
        super(message);
    }
}
