import axios from 'axios'

export default class AuthManager {
    webSocketClient;
    sessionId;
    constructor(webSocketClient) {
        this.webSocketClient = webSocketClient;
        this.sessionId = 'none'
    }

    async requestSessionKey(password) {
        this.sessionId = this.webSocketClient.sessionId;
        try {
            const response = await axios.post('/authenticate',{password:password, sessionId:this.sessionId});
            this.sessionKey = response.data.sessionKey;
            return true;
        } catch(error) {
            if(error.response.status === 401) {
            } else {
                console.log(error);
            }
        }
        return false;
    }

}
