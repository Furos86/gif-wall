import crypto from 'crypto'
export default class ImageEntitiesService {
    displayOrder = [];

    constructor(databaseService, fileStoreService) {
        this.fileStore = fileStoreService;
        this.database = databaseService;
    }

    async start() {
        const savedDisplayOrder = await this.database.models.DisplayOrder.findByPk(1);
        if(!savedDisplayOrder) {
            const newDisplayOrder = this.database.models.DisplayOrder.build({
                state: this.displayOrder
            })
            await newDisplayOrder.save();
        } else {
            this.displayOrder = savedDisplayOrder.state;
        }
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
            this.displayOrder.push(imageEntity.id);
            await this._storeDisplayOrder();
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

    async UpdateDisplayOrder(id) {
        const idIndex = this.displayOrder.indexOf(id);
        if(idIndex === -1) return;
        this.displayOrder.splice(idIndex,1);
        this.displayOrder.push(id);
        await this._storeDisplayOrder()
    }

    async _storeDisplayOrder() {
        //we always find by primary key 1 because atm we only have one displayOrder
        const savedDisplayOrder = await this.database.models.DisplayOrder.findByPk(1);
        if(savedDisplayOrder === null) return;
        savedDisplayOrder.state = this.displayOrder;
        await savedDisplayOrder.save();
    }

    async Remove(id) {
        const entity = await this.database.models.ImageEntity.findByPk(id);
        if(entity === null) return;
        const hashToDelete = entity.dataValues.fileHash;
        await entity.destroy();

        const idIndex = this.displayOrder.indexOf(id);
        if(idIndex === -1) return;
        this.displayOrder.splice(idIndex, 1);
        this._storeDisplayOrder();

        const duplicateFound = await this.database.models.ImageEntity.findOne({
            raw:true,
            where: {
                fileHash: hashToDelete
            }
        })
        if(!duplicateFound) await this.fileStore.remove(hashToDelete);
    }

    async Update(entityUpdateData) {
        const entity = await this.database.models.ImageEntity.findByPk(entityUpdateData.id);
        if(entity === null) return;
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
        let data = {entities:[], order:this.displayOrder}
        try {
            data.entities = await this.database.models.ImageEntity.findAll({
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
