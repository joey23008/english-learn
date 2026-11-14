import type { NextApiResponse } from "next";
import { and, eq, sql } from 'drizzle-orm';
import { getDrizzleClient, tables } from "@/infra/db/db";
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';
import { MSG_ERR, STATUS } from "@/consts";
import { debug, noCtrlChar } from "@/utils";
import { Question } from "ApiDataTypes";

type ReqType = {
  userNumber: string,
  lessonId: number,
  questionId: number,
}

type ResType = {
  rows: Question[],
}

export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<ResType | string>
  ) => {
    if (req.method === 'PATCH') {
      try {
        const userId = req.user;
        let { userNumber, lessonId, questionId }: ReqType = req.body;

        let isValid = userNumber && userNumber.length > 0 && userNumber.length <= 255 && noCtrlChar(userNumber);
        isValid = isValid && /^[0-9]+$/.test(String(lessonId));
        isValid = isValid && /^[0-9]+$/.test(String(questionId));
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        userNumber = String(userNumber);
        lessonId = Number(lessonId);
        questionId = Number(questionId);

        const result = await getDrizzleClient()
          .update(tables.questions)
          .set({
            user_number: userNumber,
            updated_at: sql`now()`,
          })
          .where(
            and(
              eq(tables.questions.owner, userId),
              eq(tables.questions.lesson_id, lessonId),
              eq(tables.questions.id, questionId),
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