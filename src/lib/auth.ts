import type { NextApiRequest, NextApiResponse } from 'next';
import { STATUS } from '@/consts';
import { verifyJWT } from '@/lib/token';
import { debug } from '@/utils';

export interface AuthenticatedRequest extends NextApiRequest {
  user: number;
}

export const authHandler = (callbackFn: (req: AuthenticatedRequest, res: NextApiResponse<any>) => Promise<void>) => async function handler( // eslint-disable-line @typescript-eslint/no-explicit-any
  req: NextApiRequest,
  res: NextApiResponse<Response | string>
) {
  const token = req.cookies['token'];
  let userId = null;
  try {
    if (token) {
      const { sub } = await verifyJWT<{ sub: string }>(token);
      userId = Number(sub);
    } else {
      throw new Error('require auth');
    }
  } catch (e) {
    debug(e);
    res.status(STATUS.UNAUTHORIZED);
    return res.send("Token is invalid or user doesn't exists");
  }
  (req as AuthenticatedRequest).user = userId;
  return callbackFn(req as AuthenticatedRequest, res);
};