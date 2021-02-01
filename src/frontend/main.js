 import './style.css'
import UploadManager from './uploadManager';
 import ImageEntityManager from './imageEntity/imageEntityManager';
 import WebSocketClient from './webSocketClient';

window.onload = async function () {
    const webSocketClient = new WebSocketClient();
    const imageEntityManager = new ImageEntityManager(webSocketClient);
    await imageEntityManager.start();
    new UploadManager(imageEntityManager);
}
