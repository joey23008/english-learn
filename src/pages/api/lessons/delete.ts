import type { NextApiResponse } from "next";
import { and, eq, inArray } from 'drizzle-orm';
import { getDrizzleClient, tables } from "@/infra/db/db";
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';
import { STATUS, MSG_ERR } from "@/consts";
import { debug } from "@/utils";

type ReqType = {
  ids?: string | string[],
}

export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<{ deletedId: number }[] | string>
  ) => {
    if (req.method === 'DELETE') {
      try {
        const { user } = req;
        const { ids: tmpIds }: ReqType = req.body;
        const ids = tmpIds ? (Array.isArray(tmpIds) ? tmpIds : [tmpIds]) : null;

        const isValid = ids && ids.every(v => /^[0-9]+$/.test(v));
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        const result = await getDrizzleClient()
          .delete(tables.lessons)
          .where(and(eq(tables.lessons.owner, Number(user)), inArray(tables.lessons.id, ids.map(v => Number(v)))))
          .returning({ deletedId: tables.lessons.id });

        res.send(result);
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
