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
            const hashExist = await this.fileStore.hashExist(hash);
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
            if (!hashExist) await this.fileStore.Store(hash, file.buffer);
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

    async UpdateDisplayOrder(data) {
        const idIndex = this.displayOrder.indexOf(data.id);
        if(idIndex === -1) return;
        switch(data.action) {
            case 'toBack':
                this.displayOrder.splice(0, 0, data.id);
                break;
            case 'backward':
                if(idIndex-1 < 0) break;
                this.displayOrder.splice(idIndex, 1);
                this.displayOrder.splice(idIndex-1, 0, data.id);
                break;
            case 'forward':
                if(idIndex === this.displayOrder.length -1) break;
                this.displayOrder.splice(idIndex, 1);
                this.displayOrder.splice(idIndex+1, 0, data.id);
                break;
            case 'toTop':
                this.displayOrder.splice(idIndex,1);
                this.displayOrder.push(data.id);
                break;
        }
        await this._storeDisplayOrder();
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
