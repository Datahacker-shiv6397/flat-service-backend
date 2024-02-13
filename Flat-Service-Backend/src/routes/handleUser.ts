import { Router } from 'express';

import api from '../api/handleUser';

const userRoute: Router = Router();

userRoute.get('/', api.getAllUsers);

export default userRoute;
