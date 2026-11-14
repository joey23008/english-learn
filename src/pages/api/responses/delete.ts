import type { NextApiResponse } from "next";
import { and, eq } from 'drizzle-orm';
import { getDrizzleClient, tables } from "@/infra/db/db";
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';
import { STATUS, MSG_ERR } from "@/consts";
import { debug } from "@/utils";

type ReqType = {
  id?: string,
}

export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<{ deletedId: number }[] | string>
  ) => {
    if (req.method === 'DELETE') {
      try {
        const { user } = req;
        const { id }: ReqType = req.body;

        const isValid = /^[0-9]+$/.test(String(id));
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        const result = await getDrizzleClient()
          .delete(tables.responses)
          .where(and(eq(tables.responses.owner, Number(user)), eq(tables.responses.lesson_id, Number(id))))
          .returning({ deletedId: tables.responses.id });

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
