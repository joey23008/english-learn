import type { NextApiResponse } from "next";
import { sql } from 'drizzle-orm';
import { getDrizzleClient, tables } from "@/infra/db/db";
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';
import { MSG_ERR, STATUS } from "@/consts";
import { debug, noCtrlChar } from "@/utils";
import { Phrase } from "ApiDataTypes";

type ReqType = {
  phraseId?: number,
  en: string,
  jp: string,
  lessonId?: number,
  questionId?: number,
  priority?: number,
}

type ResType = {
  rows: Phrase[],
}

export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<ResType | string>
  ) => {
    if (req.method === 'POST') {
      try {
        const userId = req.user;
        let { phraseId, en, jp, lessonId, questionId, priority }: ReqType = req.body;
        const isPriorityExist = Number(priority) >= 0;

        let isValid =  phraseId ? /^[0-9]+$/.test(String(phraseId)) : true;
        isValid = isValid && ( !phraseId ? Boolean(en) && en.length > 0 && en.length <= 255 && noCtrlChar(en) : true );
        isValid = isValid && ( !phraseId ? Boolean(jp) && jp.length > 0 && jp.length <= 255 && noCtrlChar(jp) : true );
        isValid = isValid && ( phraseId ? (!en && !jp) : Boolean(en && jp) );
        isValid = isValid && ( lessonId ? /^[0-9]+$/.test(String(lessonId)) : true);
        isValid = isValid && ( questionId ? /^[0-9]+$/.test(String(questionId)) : true);
        isValid = isValid && ( priority ? /^[0-2]+$/.test(String(priority)) : true);
        isValid = isValid && ( lessonId || questionId || isPriorityExist ? Boolean(lessonId && questionId && isPriorityExist) : true);
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        en = String(en);
        jp = String(jp);

        let phrases: Phrase[] = [];

        await getDrizzleClient().transaction(async (tx) => {
          // フレーズIDが存在しなければフレーズマスタに新規作成する
          if (!phraseId) {
            phrases = await tx.insert(tables.phrases).values({
              en,
              jp,
              created_at: sql`now()`,
              updated_at: sql`now()`,
              owner: Number(userId),
            }).returning();
            phraseId = phrases[0].id;
          }
          
          // フレーズID・レッスンID・クエスチョンID・優先順位が存在すればクエスチョンTBLと関連付ける
          if (phraseId && lessonId && questionId && isPriorityExist) {
            lessonId = Number(lessonId);
            questionId = Number(questionId);
            priority = Number(priority);

            await tx.insert(tables.questionsPhrases).values({
              lesson_id: lessonId,
              question_id: questionId,
              phrase_id: phraseId,
              priority,
              created_at: sql`now()`,
              updated_at: sql`now()`,
              owner: Number(userId),
            });
          }
        });

        res.send({
          rows: phrases,
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