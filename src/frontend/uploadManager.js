import axios from 'axios';
import {createElement} from './utils/domUtils';

export default class UploadManager {
    isLocked
    dropBox
    gifEntityManager
    constructor(gifEntityManager) {
        this.gifEntityManager = gifEntityManager;
        this.isLocked = false;
        window.addEventListener('dragenter', this.dragEnterEvent);

        this.dropBox = createElement('input', 'dropbox');
        this.dropBox.type = 'file';
        document.body.appendChild(this.dropBox);
        this.dropBox.addEventListener('drop', this.dropEvent);
        this.dropBox.style.display = 'none';

        this.dropBox.addEventListener('dragleave', this.dragExitEvent);
    }

    dragEnterEvent = () => {
        this.showDropBox();
    }

    dragExitEvent = () => {
        if(this.isLocked) return;
        this.hideDropBox();
    }

    dropEvent = async (event) => {
        if(this.isLocked) return;
        this.isLocked = true;
        event.stopPropagation();
        event.preventDefault();

        const dataTransfer = event.dataTransfer;
        const files = dataTransfer.files;
        const file = files[0];
        const form = new FormData();
        form.append('file', file);
        const parsedPosition = JSON.stringify(this.gifEntityManager.center);
        form.append('position', parsedPosition);
        try {
            const response = await axios.post('/upload',form);
            //TODO handle response hashes
        } catch (error) {
            console.log(error);
        }
        this.hideDropBox();
        this.isLocked = false;
    }

    showDropBox() {
        this.dropBox.style.display = 'block';
    }

    hideDropBox() {
        this.dropBox.style.display = 'none';
    }
}
