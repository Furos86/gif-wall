 import './style.css'
import UploadManager from './uploadManager';
 import GifEntityManager from './gifEntity/gifEntityManager';

window.onload = function () {
    const gifEntityManager = new GifEntityManager();
    /*let ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = (data) => {
        console.log(data);
    }*/
    new UploadManager(gifEntityManager);
}
