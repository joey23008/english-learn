import type { NextApiResponse } from "next";
import { sql } from 'drizzle-orm';
import { getDrizzleClient, tables } from "@/infra/db/db";
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';
import { MSG_ERR, STATUS } from "@/consts";
import { debug, noCtrlChar } from "@/utils";
import { Question } from "ApiDataTypes";
import { dbLessonSentences } from "@/lib/server/db";

type ReqType = {
  userNumber: string,
  lessonId: number,
  chapterId?: number,
  number: number,
}

type ResType = {
  rows: Question[],
}

export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<ResType | string>
  ) => {
    if (req.method === 'POST') {
      try {
        const userId = req.user;
        let { userNumber, lessonId, chapterId, number }: ReqType = req.body;

        let isValid = userNumber && userNumber.length > 0 && userNumber.length <= 255 && noCtrlChar(userNumber);
        isValid = isValid && /^[0-9]+$/.test(String(lessonId));
        isValid = isValid && chapterId ? /^[0-9]+$/.test(String(chapterId)) : true;
        isValid = isValid && /^[0-9]+$/.test(String(number));
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        userNumber = String(userNumber);
        lessonId = Number(lessonId);
        chapterId = chapterId ? Number(chapterId) : undefined;
        number = Number(number);

        let question: Question[] = [];

        await getDrizzleClient().transaction(async (tx) => {
          question = await tx.insert(tables.questions).values({
            user_number: userNumber,
            lesson_id: lessonId,
            chapter_id: chapterId ?? null,
            created_at: sql`now()`,
            updated_at: sql`now()`,
            owner: Number(userId),
          }).returning();
          await dbLessonSentences.insert(
            tx,
            {
              lessonId,
              number,
              questionId: question[0].id,
              owner: Number(userId),
            }
          );
        });

        res.send({
          rows: question,
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