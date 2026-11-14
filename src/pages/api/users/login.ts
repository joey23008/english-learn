import type { NextApiRequest, NextApiResponse } from 'next';
import { compare } from "bcrypt";
import { eq } from 'drizzle-orm';
import { debug } from '@/utils';
import { MSG_ERR, STATUS } from '@/consts';
import { getDrizzleClient, tables } from '@/infra/db/db';
import { signJWT } from '@/lib/token';
import Cookies from 'cookies';

type Response = {
  token: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response | string>
) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      const isValid = email.length > 0 && password.length > 0;
      if (!isValid) {
        res.status(STATUS.BAD_REQUEST);
        return res.send(MSG_ERR.REQ_NOT_VALID);
      }

      const result = await getDrizzleClient().select().from(tables.users).where(
        eq(tables.users.email, email)
      );
      if (result.length === 0 || !(await compare(password, result[0].password))) {
        res.status(STATUS.BAD_REQUEST);
        return res.send('Invalid email or password');
      }
      const token = await signJWT({ sub: String(result[0].id) }, { exp: `${process.env.JWT_EXPIRES_IN_MIN}m` });
      const tokenMaxAge = parseInt(String(process.env.JWT_EXPIRES_IN_MIN)) * 60 * 1000;
      const cookieOptions = {
          httpOnly: true,
          path: "/",
          // secure: process.env.NODE_ENV !== "development",
          secure: false,
          maxAge: tokenMaxAge,
      };
      const cookies = new Cookies(req, res);
      cookies.set('token', token, cookieOptions);
      cookies.set('logged-in', 'true', { maxAge: tokenMaxAge, httpOnly: false });
      const user = JSON.parse(JSON.stringify(result[0]));
      delete user.password;
  
      res.send(user);
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      debug(err);
      res.status(STATUS.INTERNAL_SERVER_ERROR);
      res.send(err);
    }
  } else {
    res.status(STATUS.NOT_FOUND);
    res.send('');
  }
}