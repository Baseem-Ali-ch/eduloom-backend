import { OAuth2Client } from 'google-auth-library';
import logger from '../configs/logger';

const client = new OAuth2Client(process.env.CLIENT_ID);

export const verifyGoogleToken = async (token: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (error) {
    console.error('Error verifying Google token:', error);
    logger.error('Middleware : Error verifying google token', error);
    return null;
  }
};