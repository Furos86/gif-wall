import './style.css'
import UploadManager from './uploadManager';
import ImageEntityManager from './imageEntity/imageEntityManager';
import WebSocketClient from './webSocketClient';
import Header from './header/Header'

window.onload = async function () {
    const webSocketClient = new WebSocketClient();
    new Header(webSocketClient);
    const imageEntityManager = new ImageEntityManager(webSocketClient);
    await imageEntityManager.start();
    new UploadManager(imageEntityManager);
}
