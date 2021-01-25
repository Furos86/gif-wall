export default class Controller {
    gifEntityService
    constructor(gifEntityService) {
        this.gifEntityService = gifEntityService;
    }
    Upload = async (request, response) => {
        const position = JSON.parse(request.body.position);
        const file = request.files[0];
        const hash = await this.gifEntityService.Create(position, file);
        response.json({hash:hash})
    }
}
