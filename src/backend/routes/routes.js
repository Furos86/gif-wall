import multer from 'multer'

import {Router} from 'express';
import Controller from '../controllers/controller';
import {asyncHandler} from '../utils/asyncHandler'

export default class Routes {
    router;

    constructor(gifEntityService) {
        this.router = new Router();
        let controller = new Controller(gifEntityService);

        const uploadMulter = multer().array('file');
        this.router.post('/upload', uploadMulter, asyncHandler(controller.Upload));
    }

}
