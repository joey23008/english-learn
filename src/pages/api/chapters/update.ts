import type { NextApiResponse } from "next";
import { and, eq, sql } from 'drizzle-orm';
import { getDrizzleClient, tables } from "@/infra/db/db";
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';
import { MSG_ERR, STATUS } from "@/consts";
import { debug, noCtrlChar } from "@/utils";
import { Chapter } from "ApiDataTypes";

type ReqType = {
  name: string,
  lessonId: number,
  chapterId: number,
}

type ResType = {
  rows: Chapter[],
}

export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<ResType | string>
  ) => {
    if (req.method === 'PATCH') {
      try {
        const userId = req.user;
        let { name, lessonId, chapterId }: ReqType = req.body;

        let isValid = name && name.length > 0 && name.length <= 255 && noCtrlChar(name);
        isValid = isValid && /^[0-9]+$/.test(String(lessonId));
        isValid = isValid && /^[0-9]+$/.test(String(chapterId));
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        name = String(name);
        lessonId = Number(lessonId);
        chapterId = Number(chapterId);

        const result = await getDrizzleClient()
          .update(tables.chapters)
          .set({
            name,
            updated_at: sql`now()`,
          })
          .where(
            and(
              eq(tables.chapters.owner, userId),
              eq(tables.chapters.lesson_id, lessonId),
              eq(tables.chapters.id, chapterId),
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