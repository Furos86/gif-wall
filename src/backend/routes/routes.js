import {Router} from 'express';
import Controller from '../controllers/controller';
import {asyncHandler} from '../utils/asyncHandler'

export default class Routes {
    router;

    constructor(gifEntityService) {
        this.router = new Router();
        let controller = new Controller(gifEntityService);
        this.router.post('/upload', asyncHandler(controller.Upload));
    }

}
