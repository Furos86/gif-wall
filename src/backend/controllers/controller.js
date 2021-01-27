export default class Controller {
    gifEntityService
    fileStoreService
    constructor(gifEntityService, fileStoreService) {
        this.gifEntityService = gifEntityService;
        this.fileStoreService = fileStoreService;
    }
    Upload = async (request, response) => {
        const position = JSON.parse(request.body.position);
        const file = request.files[0];
        const hash = await this.gifEntityService.Create(position, file);
        response.json({hash:hash})
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
