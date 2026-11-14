import type { NextApiResponse } from "next";
import { and, eq, sql } from 'drizzle-orm';
import { getDrizzleClient, tables } from "@/infra/db/db";
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';
import { MSG_ERR, STATUS } from "@/consts";
import { debug, noCtrlChar } from "@/utils";
import { Phrase, QuestionsPhrase } from "ApiDataTypes";


type ResType = {
  phrases: Phrase[],
  questionsPhrases: QuestionsPhrase[],
}

export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<ResType | string>
  ) => {
    if (req.method === 'PATCH') {
      try {
        const { user, body } = req;

        let isValid = /^[0-9]+$/.test(String(body.id));
        isValid = isValid && /^[0-9]+$/.test(String(body.phraseId));
        isValid = isValid && Boolean(body.en) && body.en.length > 0 && body.en.length <= 255 && noCtrlChar(body.en);
        isValid = isValid && Boolean(body.jp) && body.jp.length > 0 && body.jp.length <= 255 && noCtrlChar(body.jp);
        isValid = isValid && /^[0-2]+$/.test(String(body.priority));
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        const id = Number(body.id);
        const phraseId = Number(body.phraseId);
        const en = String(body.en);
        const jp = String(body.jp);
        const priority = Number(body.priority);

        let phrases: Phrase[] = [];
        let questionsPhrases: QuestionsPhrase[] = [];

        await getDrizzleClient().transaction(async (tx) => {
          phrases = await tx
            .update(tables.phrases)
            .set({
              en,
              jp,
              updated_at: sql`now()`,
            })
            .where(
              and(
                eq(tables.phrases.owner, user),
                eq(tables.phrases.id, phraseId),
              )
            )
            .returning();

          questionsPhrases = await tx
            .update(tables.questionsPhrases)
            .set({
              priority,
              updated_at: sql`now()`,
            })
            .where(
              and(
                eq(tables.questionsPhrases.owner, user),
                eq(tables.questionsPhrases.id, id),
              )
            )
            .returning();

        });

        res.send({
          phrases,
          questionsPhrases,
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