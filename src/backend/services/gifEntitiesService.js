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
        const gifEntity = this.database.models.GifEntity.build({
            hash:hash,
            x:position.x,
            y:position.y,
            layer:0
        })
        try {
            await gifEntity.save();
        }catch(error) {
            console.log(error)
        }
        await this.fileStore.Store(hash, file.buffer);
        //after create, emit update event

        return gifEntity.hash;
    }

    Remove() {
        //remove gif entity
        //after remove. emit remove entity event
    }

    Update() {
        /*
            location
            layer
            after update, emit new location/layer state
         */
    }

    EntitiesInArea() {
        //retrieves all entities within area on all layers
    }

    generateHash = (file) => crypto.createHash('md5').update(file).digest('hex');
}
