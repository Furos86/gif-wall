export default class Controller {
    gifEntityService
    constructor(gifEntityService) {
        this.gifEntityService = gifEntityService;
    }
    Upload = async (request, response) => {
        const data = request.body;
        const file = request.files;
        response.send('got it!');
    }
}
