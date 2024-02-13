import { Router } from 'express';

import api from '../api/auth';

const authRoute: Router = Router();

authRoute.post('/register', api.register);
authRoute.post('/login', api.login);
authRoute.post('/verify', api.verifyOtp);
authRoute.post('/resend', api.resendOtp);
authRoute.post('/resetpassword', api.forgotPassword);

export default authRoute;
