import './imageEntity.css';
import {createElement} from '../utils/domUtils';
import ImageEntity from './imageEntity';
import axios from 'axios';

export default class ImageEntityManager {
    center;
    domContainer;
    entities;
    websocketClient;
    isMod;
    _dragOverlay;
    _dragOffset = {x:0, y:0};
    constructor(websocketClient) {
        this.isMod = false;
        this.websocketClient = websocketClient;
        this.entities = new Map();
        this.center = {x:0, y:0}
        this._dragOverlay = createElement('div', 'drag-overlay');
        document.body.append(this._dragOverlay);
        this._dragOverlay.onmousedown = this.startDrag;
        this.domContainer = createElement('div', 'image-entity-container');
        document.body.append(this.domContainer);
        this.CalculatePlacementCenter();
        document.body.addEventListener('keydown', this.keyPressEventHandler);
        document.body.addEventListener('keyup', this.keyPressEventHandler);
        websocketClient.on('updateEntity',this.UpdateEntity);
        websocketClient.on('createEntity', this.CreateEntity);
        websocketClient.on('deleteEntity', this.DeleteEntity);
    }

    keyPressEventHandler = (event) => {
        if(event.code === 'Space') {
            if (event.type === 'keydown') this.activeContainerDrag();
            if (event.type === 'keyup') this.stopContainerDrag();
            return null;
        }
        if(event.code === 'ControlLeft') {
            if(event.type === 'keydown') {
                this.isMod = true;
            }
            if(event.type === 'keyup') {
                this.isMod = false;
            }
        }
    }

    activeContainerDrag() {
        this._dragOverlay.style.display = 'block';
    }

    startDrag = (event) => {
        this._dragOffset.x = event.offsetX - this.domContainer.offsetLeft;
        this._dragOffset.y = event.offsetY - this.domContainer.offsetTop;
        window.onmousemove = this.drag;
        window.onmouseup = this.stopDrag;
    }

    stopDrag = () => {
        window.onmousemove = null;
        window.onmouseup = null;
        this._dragOffset.x = 0;
        this._dragOffset.y = 0;
    }

    drag = (event) => {
        console.log(this._dragOffset.x);
        this.domContainer.style.left = (event.clientX - this._dragOffset.x) + 'px';
        this.domContainer.style.top  = (event.clientY - this._dragOffset.y) + 'px';
    }

    stopContainerDrag() {
        this._dragOverlay.style.display = 'none';
        this.stopDrag();
    }

   CreateEntity = async(entityData) => {
        if(this.entities.has(entityData.id)) return;
        const entity = new ImageEntity(entityData, this.websocketClient, this);
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

    DeleteEntity = (id) => {
        const entity = this.entities.get(id);
        this.entities.delete(id);
        this.domContainer.removeChild(entity.domElement);
        entity.Destroy();
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
