import multer from 'multer'

import {Router} from 'express';
import Controller from '../controllers/controller';
import {asyncHandler} from '../utils/asyncHandler'

export default class Routes {
    router;

    constructor(gifEntityService, fileStoreService) {
        this.router = new Router();
        let controller = new Controller(gifEntityService, fileStoreService);

        const uploadMulter = multer().array('file');
        this.router.post('/upload', uploadMulter, asyncHandler(controller.Upload));
        this.router.get('/image/:fileHash', asyncHandler(controller.Image))
    }

}
