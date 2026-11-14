import type { NextApiResponse } from "next";
import { and, eq } from 'drizzle-orm';
import { getDrizzleClient, tables } from "@/infra/db/db";
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';
import { STATUS, MSG_ERR } from "@/consts";
import { debug } from "@/utils";
import { Response } from "ApiDataTypes";

type ResType = {
  rows: Response[],
}

export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<ResType | string>
  ) => {
    if (req.method === 'GET') {
      try {
        const { user, query } = req;

        const isValid = query.lessonId && /^[0-9]+$/.test(String(query.lessonId));
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        const lessonId = Number(query.lessonId);

        const result = await getDrizzleClient()
          .select()
          .from(tables.responses)
          .where(and(eq(tables.responses.owner, Number(user)), eq(tables.responses.lesson_id, lessonId)))
          .orderBy(tables.responses.sentence_id);
        
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