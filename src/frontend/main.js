import './style.css'
import UploadManager from './uploadManager';
import ImageEntityManager from './imageEntity/imageEntityManager';
import WebSocketClient from './webSocketClient';
import Header from './header/Header'

window.onload = async function () {
    const webSocketClient = new WebSocketClient();
    const imageEntityManager = new ImageEntityManager(webSocketClient);
    new UploadManager(imageEntityManager);
    new Header(webSocketClient);
    await imageEntityManager.start();
}
