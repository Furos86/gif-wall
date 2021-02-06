import crypto from 'crypto'
export default class ImageEntitiesService {

    constructor(databaseService, fileStoreService) {
        this.fileStore = fileStoreService;
        this.database = databaseService;
    }

    async Create(position, file) {
        try {
            const hash = this.generateHash(file.buffer);
            const storeFile = await this.HashExists(hash);
            const imageEntity = this.database.models.ImageEntity.build({
                fileHash: hash,
                x: position.x,
                y: position.y,
                z: 0
            })
            try {
                await imageEntity.save();
            } catch (error) {
                console.log(error)
            }
            if (storeFile) await this.fileStore.Store(hash, file.buffer);
            //after create, emit update event
            return await this.database.models.ImageEntity.findOne({
                raw: true,
                where: {
                    id: imageEntity.id
                }
            })
        } catch(error) {
            throw error;
        }
    }

    async Remove(id) {
        const entity = await this.database.models.ImageEntity.findOne({
            where: {
                id: id
            }
        });

        const hashToDelete = entity.dataValues.fileHash;
        await entity.destroy();
        const duplicateFound = await this.database.models.ImageEntity.findOne({
            raw:true,
            where: {
                fileHash: hashToDelete
            }
        })
        if(!duplicateFound) await this.fileStore.remove(hashToDelete);

    }

    async Update(entityUpdateData) {
        const entity = await this.database.models.ImageEntity.findOne({
            where: {
                id: entityUpdateData.id
            }
        })
        entity.x = entityUpdateData.x;
        entity.y = entityUpdateData.y;
        entity.z = entityUpdateData.z;
        entity.scale = entityUpdateData.scale;
        await entity.save();
    }

    async HashExists(hash) {
        const data = await this.database.models.ImageEntity.findOne({
            where: {
                fileHash:hash
            }
        })
        return data === null;
    }

    EntitiesInArea(position, areaSize) {
        //retrieves all entities within area on all layers
    }

    async AllEntities() {
        let data
        try {
            data = await this.database.models.ImageEntity.findAll({
                raw: true,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            });
        } catch (error) {
            throw error;
        }
        return data;
    }

    generateHash = (file) => crypto.createHash('md5').update(file).digest('hex');
}
