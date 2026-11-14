import type { NextApiResponse } from "next";
import { and, eq } from 'drizzle-orm';
import { getDrizzleClient, tables } from "@/infra/db/db";
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';
import { STATUS, MSG_ERR } from "@/consts";
import { debug } from "@/utils";
import { Lesson } from "ApiDataTypes";

type Query = {
  id: string,
}

type ResponseData = {
  rows: Lesson[],
}

export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<ResponseData | string>
  ) => {
    if (req.method === 'GET') {
      try {
        const { user, query } = req;
        const { id } = query as Query;

        const isValid = /^[0-9]+$/.test(id);
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        const result = await getDrizzleClient()
          .select()
          .from(tables.lessons)
          .where(and(eq(tables.lessons.owner, Number(user)), eq(tables.lessons.id, Number(id))));
        
        res.send({
          rows: result,
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
);
