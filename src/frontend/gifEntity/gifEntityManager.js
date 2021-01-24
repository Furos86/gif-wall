import './gifEntity.css';
import {createElement} from '../utils/domUtils';
import GifEntity from './gifEntity';

export default class GifEntityManager {
    center
    domContainer
    entities
    constructor() {
        this.entities = new Map();
        this.center = {x:0, y:0}
        this.domContainer = createElement('div', 'gif-entity-container');
        document.body.append(this.domContainer);
        this.calculatePlacementCenter();
        console.log(this.center);

    }

    addGifEntity = (gifEntityData) => {
        const entity = new GifEntity(gifEntityData);
        this.entities.set(entity.id, entity);
        this.domContainer.prepend(entity.domElement);
        entity.position = gifEntityData.position;
    }

    calculatePlacementCenter = () => {
        const containerPosX = this.domContainer.offsetLeft;
        const containerPosY = this.domContainer.offsetTop;
        const x = containerPosX + Math.floor(window.innerWidth/2);
        const y = containerPosY + Math.floor(window.innerHeight/2);
        this.center.x = x;
        this.center.y = y;
    }
}
