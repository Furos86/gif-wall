export default class Controller {
    gifEntityService
    constructor(gifEntityService) {
        this.gifEntityService = gifEntityService;
    }
    Upload = async (request, response) => {
        const file = request.files;
    }
}
