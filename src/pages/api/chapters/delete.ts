import type { NextApiResponse } from "next";
import { and, eq, inArray } from 'drizzle-orm';
import { getDrizzleClient, tables } from "@/infra/db/db";
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';
import { STATUS, MSG_ERR } from "@/consts";
import { debug } from "@/utils";
import { Chapter } from "ApiDataTypes";

export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<Chapter[] | string>
  ) => {
    if (req.method === 'DELETE') {
      try {
        const { user, body } = req;
        const tmpIds: string[] = body.ids ? (Array.isArray(body.ids) ? body.ids : [body.ids]) : [];

        const isValid = tmpIds && tmpIds.every(v => /^[0-9]+$/.test(v));
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        const ids = tmpIds ? tmpIds.map(v => Number(v)) : [];

        const result = await getDrizzleClient()
          .delete(tables.chapters)
          .where(and(eq(tables.chapters.owner, Number(user)), inArray(tables.chapters.id, ids)))
          .returning();

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
