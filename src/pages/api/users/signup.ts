import type { NextApiRequest, NextApiResponse } from 'next';
import { eq, sql } from 'drizzle-orm';
import { hash } from "bcrypt";
import { debug } from '@/utils';
import { MSG_ERR, STATUS } from '@/consts';
import { getDrizzleClient, tables } from '@/infra/db/db';
import { Regex } from '@/consts';
import { signJWT } from '@/lib/token';
import Cookies from 'cookies';
import { User } from 'ApiDataTypes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | string>
) {
  if (req.method === 'POST') {
    try {
      const { name, email, password } = req.body;

      let isValid = name && /^(\w|[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf\uff10-\uff19]){1,255}$/.test(name);
      isValid = isValid && Regex.EMAIL.test(email);
      isValid = isValid && Regex.PASS.test(password);
      if (isValid) {
        const [{ count }] = await getDrizzleClient()
          .select({
            count: sql<number>`cast(count(${tables.users.id}) as int)`,
          })
          .from(tables.users)
          .where(
            eq(tables.users.email, email)
          );
        isValid = count === 0;
      }
      
      if (!isValid) {
        res.status(400);
        return res.send(MSG_ERR.REQ_NOT_VALID);
      }

      const hashedPassword = await hash(password, 12);
      const result = await getDrizzleClient().insert(tables.users).values({
        name,
        email,
        password: hashedPassword,
      }).returning();
      
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
  
      res.send({
        id: result[0].id,
        name: result[0].name,
        email: result[0].email,
        created_at: result[0].created_at,
        updated_at: result[0].updated_at,
      });
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