import './imageEntity.css';
import {createElement} from '../utils/domUtils';
import ImageEntity from './imageEntity';

export default class ImageEntityManager {
    center
    domContainer
    entities
    constructor() {
        this.entities = new Map();
        this.center = {x:0, y:0}
        this.domContainer = createElement('div', 'image-entity-container');
        document.body.append(this.domContainer);
        this.calculatePlacementCenter();
        console.log(this.center);

    }

   async addGifEntity(gifEntityData) {
        const entity = new ImageEntity(gifEntityData);
        this.entities.set(entity.fileHash, entity);
        this.domContainer.prepend(entity.domElement);
        entity.position = gifEntityData.position;
        await entity.Load();
    }

    calculatePlacementCenter() {
        const containerPosX = this.domContainer.offsetLeft;
        const containerPosY = this.domContainer.offsetTop;
        const x = containerPosX + Math.floor(window.innerWidth/2);
        const y = containerPosY + Math.floor(window.innerHeight/2);
        this.center.x = x;
        this.center.y = y;
    }
}
