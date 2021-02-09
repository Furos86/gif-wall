import FileType from 'file-type';

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
        const file = request.files[0];
        const fileType = await FileType.fromBuffer(file.buffer);
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
}
