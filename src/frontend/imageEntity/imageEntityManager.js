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
    _dragOffset = {x:0, y:0};
    constructor(websocketClient) {
        this.isMod = false;
        this.websocketClient = websocketClient;
        this.entities = new Map();
        this.center = {x:0, y:0}
        this.domContainer = createElement('div', {id:'image-entity-container'});
        document.body.append(this.domContainer);
        this.CalculatePlacementCenter();
        window.onresize = this.CalculatePlacementCenter;
        document.body.addEventListener('keydown', this.keyPressEventHandler);
        document.body.addEventListener('keyup', this.keyPressEventHandler);
        document.addEventListener('mousedown', this.globalMousePressEventHandler)
        document.addEventListener('mouseup', this.globalMousePressEventHandler)
        websocketClient.on('updateEntity',this.UpdateEntity);
        websocketClient.on('createEntity', this.CreateEntity);
        websocketClient.on('deleteEntity', this.DeleteEntity);
        websocketClient.on('updateEntitiesDisplayOrder', this.UpdateEntitiesDisplayOrder)
    }

    keyPressEventHandler = (event) => {
        if(event.code === 'ControlLeft') {
            if(event.type === 'keydown') {
                this.entities.forEach(entity => entity.enableMod())
                this.isMod = true;
            }
            if(event.type === 'keyup') {
                this.entities.forEach( entity => entity.disableMod())
                this.isMod = false;
            }
        }
    }

    globalMousePressEventHandler = (event) => {
        if(event.button !== 1) return;
        event.preventDefault();
        switch(event.type) {
            case 'mousedown':
                this.startDrag(event);
                break;
            case 'mouseup':
                this.stopDrag();
                break;
            default:
                return;
        }
    }

    startDrag = (event) => {
        this._dragOffset.x = event.clientX - this.domContainer.offsetLeft;
        this._dragOffset.y = event.clientY - this.domContainer.offsetTop;
        window.onmousemove = this.drag;
        window.onmouseup = this.stopDrag;
        document.body.style.cursor = 'grabbing';
    }

    stopDrag = () => {
        window.onmousemove = null;
        window.onmouseup = null;
        this._dragOffset.x = 0;
        this._dragOffset.y = 0;
        this.CalculatePlacementCenter();
        document.body.style.cursor = 'default';
    }

    drag = (event) => {
        this.domContainer.style.left = (event.clientX - this._dragOffset.x) + 'px';
        this.domContainer.style.top  = (event.clientY - this._dragOffset.y) + 'px';
    }

   CreateEntity = async(entityData) => {
        if(this.entities.has(entityData.id)) return;
        const entity = new ImageEntity(entityData, this.websocketClient, this);
        this.entities.set(entity.id, entity);
        this.domContainer.appendChild(entity.domElement);
        await entity.Load();
    }

    CalculatePlacementCenter = () => {
        const containerPosX = this.domContainer.offsetLeft * -1;
        const containerPosY = this.domContainer.offsetTop * -1;
        const x = containerPosX + Math.floor(window.innerWidth/2);
        const y = containerPosY + Math.floor(window.innerHeight/2);
        this.center.x = x;
        this.center.y = y;
    }

    UpdateEntitiesDisplayOrder = (data) => {
        const domElement = this.entities.get(data.id).domElement;
        let beforeTarget = null;
        switch(data.action) {
            case 'toBack':
                beforeTarget = this.domContainer.firstChild;
                break;
            case 'backward':
                beforeTarget = this.findBeforeTarget(domElement, -1);
                break;
            case 'forward':
                beforeTarget = this.findBeforeTarget(domElement, 2);
                break;
            case 'toTop':
                break;
        }


        this.domContainer.insertBefore(domElement, beforeTarget);
    }

    findBeforeTarget(domElement, searchIndex) {
        let arr = Array.from(this.domContainer.childNodes);
        let beforeTargetIndex = arr.indexOf(domElement)+searchIndex;
        if(beforeTargetIndex >= arr.length) return null;
        if(beforeTargetIndex <= 0) return arr[0];
        return arr[beforeTargetIndex];
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
            const order = response.data.order;
            const entitiesData = response.data.entities;
            for(let id of order) {
                let entityData = entitiesData.find(e => e.id === id);
                promises.push(this.CreateEntity(entityData));
            }
        } catch (error) {
            throw error;
        }
        await Promise.allSettled(promises);
    }
}
