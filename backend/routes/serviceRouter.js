import express from 'express';
import multer from 'multer';
import { createService, getServices, getServiceById, updateService, deleteService } from '../controllers/serviceController.js';

const upload = multer({ dest: 'temp/' });

const serviceRouter = express.Router();

serviceRouter.post('/', upload.single('image'), createService);
serviceRouter.get('/', getServices);
serviceRouter.get('/:id', getServiceById);
serviceRouter.put('/:id', upload.single('image'), updateService);
serviceRouter.delete('/:id', deleteService);

export default serviceRouter;