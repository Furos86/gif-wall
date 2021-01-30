import multer from 'multer'

import {Router} from 'express';
import Controller from '../controllers/controller.mjs';
import {asyncHandler} from '../utils/asyncHandler.mjs'

export default class Routes {

    constructor(gifEntityService, fileStoreService) {
        this.router = new Router();
        let controller = new Controller(gifEntityService, fileStoreService);

        const uploadMulter = multer().array('file');
        this.router.post('/upload', uploadMulter, asyncHandler(controller.Upload));
        this.router.get('/image/:fileHash', asyncHandler(controller.Image));
        this.router.get('/entities', asyncHandler(controller.Entities))
    }

}
