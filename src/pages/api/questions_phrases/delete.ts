import type { NextApiResponse } from "next";
import { and, eq, inArray } from 'drizzle-orm';
import { getDrizzleClient, tables } from "@/infra/db/db";
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';
import { STATUS, MSG_ERR } from "@/consts";
import { debug } from "@/utils";
import { Phrase, QuestionsPhrase } from "ApiDataTypes";

type ResType = {
  questionsPhrases: QuestionsPhrase[],
  phrases: Phrase[],
}

/**
 * ReqType
 *  lessonId: number
 *  questionId: number
 *  qsPhrIds: number | number[]
 */
export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<ResType | string>
  ) => {
    if (req.method === 'DELETE') {
      try {
        const { user, body } = req;
        const tmpQsPhrIds: string[] = Array.isArray(body.qsPhrIds) ? body.qsPhrIds : [body.qsPhrIds];

        let isValid = tmpQsPhrIds.every(v => v && /^[0-9]+$/.test(v));
        isValid = isValid && /^[0-9]+$/.test(String(body.lessonId));
        isValid = isValid && /^[0-9]+$/.test(String(body.questionId));
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        const lessonId = Number(body.lessonId);
        const questionId = Number(body.questionId);
        const qsPhrIds = tmpQsPhrIds.map(v => Number(v));
        const deleteMasterData = body.deleteMasterData !== undefined;

        let questionsPhrases: QuestionsPhrase[] = [];
        let phrases: Phrase[] = [];

        await getDrizzleClient().transaction(async tx => {
          questionsPhrases = await tx
            .delete(tables.questionsPhrases)
            .where(
              and(
                eq(tables.questionsPhrases.owner, Number(user)),
                eq(tables.questionsPhrases.lesson_id, lessonId),
                eq(tables.questionsPhrases.question_id, questionId),
                inArray(tables.questionsPhrases.id, qsPhrIds)),
            )
            .returning();
          
          if (deleteMasterData) {
            const qsIds = questionsPhrases.map(v => v.phrase_id);
            phrases = await tx
              .delete(tables.phrases)
              .where(
                and(
                  eq(tables.phrases.owner, Number(user)),
                  inArray(tables.phrases.id, qsIds)),
              )
              .returning();
          }
        });

        res.send({
          questionsPhrases,
          phrases,
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
