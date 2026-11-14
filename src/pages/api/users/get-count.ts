import type { NextApiRequest, NextApiResponse } from 'next';
import { eq, sql } from 'drizzle-orm';
import { debug } from '@/utils';
import { MSG_ERR, STATUS } from '@/consts';
import { getDrizzleClient, tables } from '@/infra/db/db';

type Response = {
  count: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response | string>
) {
  if (req.method === 'GET') {
    try {
      const { query: { email } } = req;
      const isValid = typeof email === 'string';
      if (!isValid) {
        res.status(400);
        return res.send(MSG_ERR.REQ_NOT_VALID);
      }
      
      const result = await getDrizzleClient()
        .select({
          count: sql<number>`cast(count(${tables.users.id}) as int)`,
        })
        .from(tables.users)
        .where(
          eq(tables.users.email, email as string)
        );
  
      res.send(result[0]);
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