import type { NextApiResponse } from "next";
import { and, eq, sql } from 'drizzle-orm';
import { getDrizzleClient, tables } from "@/infra/db/db";
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';
import { MSG_ERR, STATUS } from "@/consts";
import { debug, noCtrlChar } from "@/utils";
import { Sentence } from "ApiDataTypes";


type ResType = {
  rows: Sentence[],
}

export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<ResType | string>
  ) => {
    if (req.method === 'PATCH') {
      try {
        const { user, body } = req;

        let isValid =  typeof body.content === 'string'&& noCtrlChar(body.content);
        isValid = isValid && typeof body.answer === 'string' && noCtrlChar(body.answer);
        isValid = isValid && /^[0-9]+$/.test(String(body.id));
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        const id = Number(body.id);
        const content = String(body.content);
        const answer = String(body.answer);

        const result = await getDrizzleClient()
          .update(tables.sentences)
          .set({
            content,
            answer,
            updated_at: sql`now()`,
          })
          .where(
            and(
              eq(tables.sentences.owner, user),
              eq(tables.sentences.id, id),
            )
          )
          .returning();

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