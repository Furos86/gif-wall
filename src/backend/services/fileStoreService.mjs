import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path';
import Configuration from '../configuration.mjs';

export default class FileStoreService {
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

    async remove(id) {
        return await fsPromises.unlink(path.join(this.directory, id));
    }
}
