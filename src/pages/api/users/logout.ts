import type { NextApiRequest, NextApiResponse } from 'next';
import { debug } from '@/utils';
import { STATUS } from '@/consts';
import Cookies from 'cookies';

type Response = {
  token: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response | string>
) {
  if (req.method === 'GET') {
    try {
      const cookies = new Cookies(req, res);
      cookies.set('token', '', { maxAge: -1 });
      cookies.set('logged-in', '', { maxAge: -1 });
  
      res.send('');
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      debug(err);
      res.status(500);
      res.send(err);
    }
  } else {
    res.status(STATUS.NOT_FOUND);
    res.send('');
  }
}