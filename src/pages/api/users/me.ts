import type { NextApiResponse } from 'next';
import { eq } from 'drizzle-orm';
import { debug } from '@/utils';
import { STATUS } from '@/consts';
import { getDrizzleClient, tables } from '@/infra/db/db';
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';

type Response = {
  token: string
}

export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<Response | string>
  ) => {
    if (req.method === 'GET') {
      try {
        const userId = req.user;
        const result = await getDrizzleClient().select().from(tables.users).where(
          eq(tables.users.id, Number(userId))
        );
        const user = JSON.parse(JSON.stringify(result[0]));
        delete user.password;
    
        res.send(user);
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
);