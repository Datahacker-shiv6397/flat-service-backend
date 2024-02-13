import { Router } from 'express';

import api from '../api/inspections';

const inspectionRoute: Router = Router();

inspectionRoute.post('/', api.addInspection);
inspectionRoute.get('/', api.getAllInspection);
inspectionRoute.get('/:id', api.getInspectionById);
inspectionRoute.put('/:id', api.updateInspection);
inspectionRoute.delete('/:id', api.deleteInspectiion);

export default inspectionRoute;
