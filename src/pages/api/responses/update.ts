import type { NextApiResponse } from "next";
import { sql } from 'drizzle-orm';
import { getDrizzleClient } from "@/infra/db/db";
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';
import { MSG_ERR, STATUS } from "@/consts";
import { debug, noCtrlChar } from "@/utils";
import { Response } from "ApiDataTypes";

type ResType = {
  rows: Response[],
}

export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<ResType | string>
  ) => {
    if (req.method === 'PATCH') {
      try {
        const { user, body } = req;

        let isValid =  typeof body.content === 'string' && noCtrlChar(body.content);
        isValid = isValid && /^[0-9]+$/.test(String(body.lessonId));
        isValid = isValid && /^[0-9]+$/.test(String(body.sentenceId));
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        const content = String(body.content);
        const lessonId = Number(body.lessonId);
        const sentenceId = Number(body.sentenceId);

        let responses: Response[] = [];

        await getDrizzleClient().transaction(async (tx) => {
          const queryStr = sql`
            INSERT 
            INTO responses(content, sentence_id, lesson_id, owner) 
            VALUES (${content}, ${sentenceId}, ${lessonId}, ${user}) 
              ON CONFLICT(sentence_id) DO UPDATE 
            SET
              content = EXCLUDED.content
              , updated_at = now();

          `;
          const { rows } = await tx.execute<Response>(sql`${queryStr}`);
          responses = rows;
        });

        res.send({
          rows: responses,
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