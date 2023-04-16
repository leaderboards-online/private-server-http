import { auth } from 'express-oauth2-jwt-bearer';
import { AUTH0_AUDIENCE, AUTH0_DOMAIN } from '../env';
const AuthMiddleware = auth({
  issuerBaseURL: AUTH0_DOMAIN,
  audience: AUTH0_AUDIENCE,
});

export default AuthMiddleware;
