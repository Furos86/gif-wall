export default class UploadManager {
    constructor() {
        window.addEventListener('dragenter', this.enterDetection)
    }

    enterDetection = (event) => {
        console.log('enterDetection:', event);
    }

}
