import {createElement} from '../utils/domUtils';

export default class GifEntity {
    domElement;
    id;
    imageContainer;

    _position = {x:0, y:0};
    _dragOffset = {x:0, y:0};
    constructor(gifEntityData) {
        this.id = gifEntityData.fileHash;
        this.domElement = createElement('div', '')
        this.domElement.classList.add('gif-entity')
        const bgColor = Math.floor(Math.random()*16777215).toString(16);
        this.domElement.style.backgroundColor = '#'+bgColor;
        this.domElement.onmousedown = this.startDrag;

        this.imageContainer = createElement('img')
        this.imageContainer.src = `/image/${this.id}`;
        this.domElement.appendChild(this.imageContainer);
    }

    set position(value) {
        this._position = value;
        this.domElement.style.top = this._position.y + 'px';
        this.domElement.style.left = this._position.x + 'px';

    }

    get position() {
        return this._position;
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
