import './uploadStyle.css'

export default class UploadManager {
    drop
    constructor() {
        window.addEventListener('dragenter', this.dragEnterEvent)

        const el = document.createElement('input')
        el.id = 'test'
        el.type = 'file'
        document.body.appendChild(el);

        el.addEventListener('drop', this.dropEvent)
        el.style.display = 'none';
        this.drop = el;
    }

    dragEnterEvent = (event) => {
        console.log('enterDetection:', event);
        this.drop.style.display = 'block';
    }

    dropEvent = async (event) => {
        event.stopPropagation();
        event.preventDefault();

        const dataTransfer = event.dataTransfer;
        const files = dataTransfer.files;
        const file = files[0];
        const form = new FormData();
        form.append('file', file);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost/upload", true);
        xhr.send(form);
        this.drop.style.display = 'none';
        console.log('hide');
    }
}
