import UploadManager from './uploadManager';

window.onload = function () {
    /*let ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = (data) => {
        console.log(data);
    }*/
    new UploadManager();
}
