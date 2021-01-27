import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path';
import Configuration from '../configuration';

export default class FileStoreService {
    directory
    constructor() {

        this.directory = Configuration.localFileStoreLocation
        if(!fs.existsSync(this.directory)) {
            fs.mkdirSync(this.directory);
        }

    }
    async Store(id, file) {
        await fsPromises.writeFile(path.join(this.directory, id),file);
    }

    async retrieve(id) {
        return await fsPromises.readFile(path.join(this.directory, id));
    }
}
