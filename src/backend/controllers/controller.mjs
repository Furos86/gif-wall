import * as FileType from 'file-type';
import Configuration from '../configuration.mjs';

const exceptedFIleTypes = [
    'png',
    'jpg',
    'jpeg',
    'webp',
    'gif'
]

export default class Controller {
    constructor(gifEntityService, webSocketServiceService, fileStoreService) {
        this.imageEntityService = gifEntityService;
        this.webSocketServerService = webSocketServiceService;
        this.fileStoreService = fileStoreService;
    }
    Upload = async (request, response) => {
        const position = JSON.parse(request.body.position);
        const sessionId = request.body.sessionId;
        if(!this.webSocketServerService.isAuth(sessionId)) {
            response.status(401).send('login first');
            return;
        }

        const file = request.files[0];
        const fileType = await FileType.fileTypeFromBuffer(file.buffer);
        if(!fileType || exceptedFIleTypes.indexOf(fileType.ext) === -1) {
            response.status(415).send();
            return;
        }
        const entityData = await this.imageEntityService.Create(position, file);
        await this.webSocketServerService.EmitEntityCreate(entityData);
        response.json(entityData)
    }

    Entities = async(request, response) => {
        const data = await this.imageEntityService.AllEntities();
        response.send(data);
    }

    Image = async(request, response) => {
        const fileHash = request.params.fileHash;
        let buffer;
        try{
            buffer = await this.fileStoreService.retrieve(fileHash);
        } catch(error) {
            throw new Error(`image ${fileHash} does not exist :(`)
        }
        response.send(buffer);
    }

    Authenticate = async(request, response) => {
        if(!request.body) response.status(401).send();
        const loginData = request.body;
        if(loginData.password && loginData.password === Configuration.authPassword) {
            this.webSocketServerService.authSession(loginData.sessionId);
            response.send('Welcome :D');
        } else {
            if(!request.data) response.status(401).send('wrong password >:(');
        }
    }
}
