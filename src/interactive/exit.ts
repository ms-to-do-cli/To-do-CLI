import I from '../commands/i';

async function exit(this: I): Promise<void> {
    this.exit(0);
}

export default exit;
