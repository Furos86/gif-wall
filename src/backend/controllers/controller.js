export default class Controller {
    imageEntityService
    fileStoreService
    constructor(gifEntityService, fileStoreService) {
        this.imageEntityService = gifEntityService;
        this.fileStoreService = fileStoreService;
    }
    Upload = async (request, response) => {
        const position = JSON.parse(request.body.position);
        const file = request.files[0];
        const hash = await this.imageEntityService.Create(position, file);
        response.json({hash:hash})
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
