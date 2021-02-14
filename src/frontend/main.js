import './style.css'
import UploadManager from './uploadManager';
import ImageEntityManager from './imageEntity/imageEntityManager';
import WebSocketClient from './webSocketClient';
import Header from './header/Header'
import AuthManager from './authManager';

window.onload = async function () {
    const webSocketClient = new WebSocketClient();
    const authManager = new AuthManager(webSocketClient)
    const imageEntityManager = new ImageEntityManager(webSocketClient);
    new UploadManager(imageEntityManager, authManager);
    new Header(webSocketClient, authManager);
    await imageEntityManager.start();
}
