import {createElement, ImagePromise} from '../utils/domUtils';

export default class ImageEntity {
    domElement;
    id;
    _size = {width:0, height:0};
    _scale = {width:1, height:1};

    _position = {x:0, y:0};
    _dragOffset = {x:0, y:0};
    constructor(gifEntityData) {
        this.id = gifEntityData.fileHash;
        this.domElement = createElement('div', '')
        this.domElement.classList.add('image-entity')
        const bgColor = Math.floor(Math.random()*16777215).toString(16);
        this.domElement.style.backgroundColor = '#'+bgColor;
        this.domElement.onmousedown = this.startDrag;
    }

    Load = async() => {
        let image;
        try {
            image = await ImagePromise(`/image/${this.id}`);
        } catch(error) {
            console.log(error)
        }
        this.domElement.style.backgroundImage = `url(${image.src})`;
        this.size = {width:image.width, height:image.height};
        this.show();
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
        const absoluteWidth = this._size.width * this._scale.width;
        const absoluteHeight = this._size.height * this._scale.height;
        this.domElement.style.width = `${absoluteWidth}px`
        this.domElement.style.height = `${absoluteHeight}px`
    }

    show() {
        this.domElement.style.opacity = '1';
    }

    startDrag = (event) => {
       this._dragOffset.x = event.offsetX;
       this._dragOffset.y = event.offsetY;
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
        const newX = event.clientX - this._dragOffset.x;
        const newY = event.clientY - this._dragOffset.y;
        console.log({x:event.clientX, y:event.clientY});
        this.position = {x:newX, y:newY};
    }


}
