import axios from 'axios';
import {createElement} from './utils/domUtils';

export default class UploadManager {
    isLocked;
    dropBox;
    wrapper;
    imageEntityManager;
    authManager;
    constructor(imageEntityManager, authManager) {
        this.authManager = authManager;
        this.imageEntityManager = imageEntityManager;
        this.isLocked = false;
        window.addEventListener('dragenter', this.dragEnterEvent);
        this.wrapper = createElement('div', {id: 'dropbox-wrapper'});

        let wrapText = createElement('p')
        wrapText.innerHTML = 'Upload image';
        this.wrapper.appendChild(wrapText);

        this.dropBox = createElement('input', {id:'dropbox'});
        this.dropBox.type = 'file';
        this.wrapper.appendChild(this.dropBox);

        this.dropBox.addEventListener('drop', this.dropEvent);
        this.dropBox.addEventListener('dragleave', this.dragExitEvent);
        document.body.appendChild(this.wrapper);
        this.hideDropBox();
    }

    dragEnterEvent = () => {
        window.removeEventListener('dragenter', this.dragEnterEvent);
        this.showDropBox();

    }

    dragExitEvent = () => {
        window.addEventListener('dragenter', this.dragEnterEvent);
        if(this.isLocked) return;
        this.hideDropBox();
    }

    dropEvent = async (event) => {
        if(this.isLocked) return;
        this.isLocked = true;
        event.preventDefault();

        const dataTransfer = event.dataTransfer;
        const files = dataTransfer.files;
        const file = files[0];
        const form = new FormData();
        form.append('file', file);
        const parsedPosition = JSON.stringify(this.imageEntityManager.center);
        form.append('position', parsedPosition);
        console.log(this.authManager.sessionId);
        form.append('sessionId', this.authManager.sessionId);
        try {
            const response = await axios.post('/upload',form);
            await this.imageEntityManager.CreateEntity(response.data)
        } catch (error) {
            if(error.response.status === 415) {
                console.log("the server doesn't like that filetype :(");
            } else {
                console.log(error);
            }
            this.resetDropBox();
        }
        this.resetDropBox();
    }

    resetDropBox() {
        this.isLocked = false;
        this.hideDropBox();
        window.addEventListener('dragenter', this.dragEnterEvent);
    }

    showDropBox() {
        this.wrapper.style.display = 'block';
    }

    hideDropBox() {
        this.wrapper.style.display = 'none';
    }
}
