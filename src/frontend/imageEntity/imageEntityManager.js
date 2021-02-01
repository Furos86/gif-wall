import './imageEntity.css';
import {createElement} from '../utils/domUtils';
import ImageEntity from './imageEntity';
import axios from 'axios';

export default class ImageEntityManager {
    center;
    domContainer;
    entities;
    websocketClient;
    constructor(websocketClient) {
        this.websocketClient = websocketClient;
        this.entities = new Map();
        this.center = {x:0, y:0}
        this.domContainer = createElement('div', 'image-entity-container');
        document.body.append(this.domContainer);
        this.CalculatePlacementCenter();
        websocketClient.on('updateEntity',this.UpdateEntity);
        websocketClient.on('createEntity', this.CreateEntity)
    }

   CreateEntity = async(entityData) => {
        const entity = new ImageEntity(entityData, this.websocketClient);
        this.entities.set(entity.id, entity);
        this.domContainer.prepend(entity.domElement);
        await entity.Load();
    }

    CalculatePlacementCenter() {
        const containerPosX = this.domContainer.offsetLeft;
        const containerPosY = this.domContainer.offsetTop;
        const x = containerPosX + Math.floor(window.innerWidth/2);
        const y = containerPosY + Math.floor(window.innerHeight/2);
        this.center.x = x;
        this.center.y = y;
    }

    UpdateEntity = (entityData) => {
        this.entities.get(entityData.id).ProcessData(entityData);
    }

    async start() {
        const promises = []
        try {
            const response = await axios.get('/entities');
            response.data.forEach(entityData => {
                promises.push(this.CreateEntity(entityData));
            })
        } catch (error) {
            throw error;
        }
        await Promise.allSettled(promises);
    }
}
