import { Router } from 'express';

import api from '../api/properties';

const propertyRoute: Router = Router();

propertyRoute.post('/', api.addProperty);
propertyRoute.get('/', api.getAllProperty);
propertyRoute.get('/:id', api.getPropertyById);
propertyRoute.put('/:id', api.updateProperty);
propertyRoute.delete('/:id', api.deleteProperty);

export default propertyRoute;
