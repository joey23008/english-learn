import type { NextApiResponse } from "next";
import { sql } from 'drizzle-orm';
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
    if (req.method === 'POST') {
      try {
        const { user, body } = req;

        let isValid =  typeof body.content === 'string' && body.content.length <= 255 && noCtrlChar(body.content);
        isValid = isValid && typeof body.answer === 'string' && body.answer.length <= 255 && noCtrlChar(body.answer);
        isValid = isValid && /^[0-9]+$/.test(String(body.lessonId));
        isValid = isValid && /^[0-9]+$/.test(String(body.questionId));
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        const content = String(body.content);
        const answer = String(body.answer);
        const lessonId = Number(body.lessonId);
        const questionId = Number(body.questionId);

        let sentences: Sentence[] = [];

        await getDrizzleClient().transaction(async (tx) => {
          sentences = await tx.insert(tables.sentences).values({
            content,
            answer,
            lesson_id: lessonId,
            question_id: questionId,
            created_at: sql`now()`,
            updated_at: sql`now()`,
            owner: Number(user),
          })
          .returning();
        });

        res.send({
          rows: sentences,
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