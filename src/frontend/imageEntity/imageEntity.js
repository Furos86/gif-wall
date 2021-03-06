import {createElement, ImagePromise} from '../utils/domUtils';

export default class ImageEntity {
    domElement;
    _modDomElement;
    _modDomDrag;
    _modDomDelete;
    fileHash;
    id;
    _size = {width:0, height:0};
    _depth= 0;
    _scale = 1;

    _position = {x:0, y:0};
    _dragOffset = {x:0, y:0};
    _websocket;
    _parent;
    _isScaleUpdate;
    constructor(entityData, websocket, parent) {
        this._parent = parent;
        this.id = entityData.id;
        this._websocket = websocket;
        this.fileHash = entityData.fileHash;

        this.domElement = createElement('div',{className:'image-entity'});
        this.domElement.onmousedown = this.startDrag;
        this._modDomElement = createElement(
            'div',
            {className:'mod-overlay'},
            createElement('div', {className:'mod-window'})
            );
        this.domElement.appendChild(this._modDomElement);
        this._modDomElement.onclick = this.toTopOfDisplay;

        this._modDomDrag = createElement('div', {className:'drag-icon'});
        this._modDomElement.appendChild(this._modDomDrag);
        this._modDomDrag.onmousedown = this.startScaleDrag;

        this._modDomDelete = createElement('div', {className:'delete-icon'});
        this._modDomElement.appendChild(this._modDomDelete);
        this._modDomDelete.onclick = this.deleteClick;


        this.position = {x:entityData.x, y:entityData.y};
        this.depth = entityData.z;
        this.scale = entityData.scale;
    }

    Load = async() => {
        let image;
        try {
            image = await ImagePromise(`/image/${this.fileHash}`);
        } catch(error) {
            console.log(error)
        }
        this.domElement.style.backgroundImage = `url(${image.src})`;
        this.size = {width:image.width, height:image.height};
        this.show();
    }

    ProcessData(entityData) {
        this.domElement.classList.add('position-ease');
        this.position = {x:entityData.x, y:entityData.y};
        this.scale = entityData.scale;
    }

    set depth(value) {
        this._depth = value;
    }

    set position(value) {
        this._position = value;
        this.domElement.style.top = this._position.y + 'px';
        this.domElement.style.left = this._position.x + 'px';
    }

    get position() {
        return this._position;
    }

    set size(newSize) {
        this._size = newSize;
        this.updateAbsoluteSize();
    }

    set scale(newScale) {
        this._scale = newScale;
        this.updateAbsoluteSize();
    }

    updateAbsoluteSize() {
        const absoluteWidth = this._size.width * this._scale;
        const absoluteHeight = this._size.height * this._scale;
        this.domElement.style.width = `${absoluteWidth}px`;
        this.domElement.style.height = `${absoluteHeight}px`;
    }

    toTopOfDisplay = () => {
        this._websocket.updateEntityDisplayOrder(this.id);
    }

    show() {
        this.domElement.style.opacity = '1';
    }

    enableMod = () => {
        this._modDomElement.style.display = 'block';
    }

    disableMod() {
        this._modDomElement.style.display = 'none';
        this.stopScaleDrag();
    }

    startDrag = (event) => {
        this.domElement.classList.remove('position-ease');
        if(this._parent.isMod) return;

        this._dragOffset.x = event.offsetX + this._parent.domContainer.offsetLeft;
        this._dragOffset.y = event.offsetY + this._parent.domContainer.offsetTop ;
        window.onmousemove = this.drag;
        window.onmouseup = this.stopDrag;
    }

    stopDrag = () => {
        window.onmousemove = null;
        window.onmouseup = null;
        this._dragOffset.x = 0;
        this._dragOffset.y = 0;
        this.update();
    }

    drag = (event) => {
        const newX = event.clientX - this._dragOffset.x;
        const newY = event.clientY - this._dragOffset.y;
        this.position = {x:newX, y:newY};
    }

    _scaleDragStart = {x:0, y:0};
    _scaleStart;
    startScaleDrag = (event) => {
        this._scaleDragStart.x = event.clientX;
        this._scaleDragStart.y = event.clientY;
        this._scaleStart = this._scale;

        window.onmouseup = this.stopScaleDrag;
        window.onmousemove = this.scaleDrag;

    }

    scaleDrag = (event) => {
        this._isScaleUpdate = true;
        let newPos;
        let startPos;
        let scaleVal;

        if(event.clientX < event.clientY) {
            newPos = event.clientX;
            startPos = this._scaleDragStart.x;
        }

        if(event.clientY < event.clientX) {
            newPos = event.clientY;
            startPos = this._scaleDragStart.y;
        }

        scaleVal = this._scaleStart/startPos;
        this.scale = scaleVal * newPos;
    }

    stopScaleDrag = () => {
        window.onmousemove = null;
        window.onmouseup = null;
        if(this._isScaleUpdate){
            this._isScaleUpdate = false;
            this.update();
        }
    }

    update = () => {
        this._websocket.UpdateEntity({...this._position,z:this._depth, scale:this._scale, id:this.id});
    }

    deleteClick = () => {
        this._websocket.DeleteEntity(this.id);
    }

    Destroy() {
        this.domElement.onmousedown = null;
        this._modDomDelete.onclick = null;
        this._modDomDrag.onmousedown = null;
    }
}
