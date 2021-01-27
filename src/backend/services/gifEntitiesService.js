import crypto from 'crypto'
export default class GifEntitiesService {
    database
    fileStore

    constructor(databaseService, fileStoreService) {
        this.fileStore = fileStoreService;
        this.database = databaseService;
    }

    async Create(position, file) {
        //creates a gif entity
        const hash = this.generateHash(file.buffer);
        const storeFile = await this.HashExists(hash);
        const gifEntity = this.database.models.GifEntity.build({
            fileHash:hash,
            x:position.x,
            y:position.y,
            z:0
        })
        try {
            await gifEntity.save();
        }catch(error) {
            console.log(error)
        }
        if(storeFile) await this.fileStore.Store(hash, file.buffer);
        //after create, emit update event

        return gifEntity.fileHash;
    }

    Remove() {
        //remove gif entity
        //check if entity is duplicate by checking file hash usages
        //after remove. emit remove entity event
    }

    Update() {
        /*
            location (x,y,z)
            after update, emit new location/layer state
         */
    }

    async HashExists(hash) {
        const data = await this.database.models.GifEntity.findOne({
            where: {
                fileHash:hash
            }
        })
        return data === null;
    }

    EntitiesInArea() {
        //retrieves all entities within area on all layers
    }

    generateHash = (file) => crypto.createHash('md5').update(file).digest('hex');
}
