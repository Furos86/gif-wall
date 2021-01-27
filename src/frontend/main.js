 import './style.css'
import UploadManager from './uploadManager';
 import ImageEntityManager from './imageEntity/imageEntityManager';

window.onload = function () {
    const imageEntityManager = new ImageEntityManager();
    /*let ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = (data) => {
        console.log(data);
    }*/
    new UploadManager(imageEntityManager);
}
