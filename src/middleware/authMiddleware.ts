import { auth } from 'express-openid-connect';

const getEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}`
    );
  }

  return value;
};

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: getEnv('SECRET'),
    baseURL: getEnv('BASE_URL'),
    clientID: getEnv('CLIENT_ID'),
    issuerBaseURL: getEnv('ISSUER_BASE_URL')
};

const authMiddleware = auth(config);

export { authMiddleware };
