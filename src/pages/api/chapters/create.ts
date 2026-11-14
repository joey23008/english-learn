import type { NextApiResponse } from "next";
import { sql } from 'drizzle-orm';
import { getDrizzleClient, tables } from "@/infra/db/db";
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';
import { MSG_ERR, STATUS } from "@/consts";
import { debug, noCtrlChar } from "@/utils";
import { Chapter } from "ApiDataTypes";
import { dbLessonSentences } from "@/lib/server/db";

type ReqType = {
  name: string,
  lessonId: number,
  parentId?: number,
  number: number,
}

type ResType = {
  rows: Chapter[],
}

export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<ResType | string>
  ) => {
    if (req.method === 'POST') {
      try {
        const userId = req.user;
        let { name, lessonId, parentId, number }: ReqType = req.body;

        let isValid = name && name.length > 0 && name.length <= 255 && noCtrlChar(name);
        isValid = isValid && /^[0-9]+$/.test(String(lessonId));
        isValid = isValid && parentId ? /^[0-9]+$/.test(String(parentId)) : true;
        isValid = isValid && /^[0-9]+$/.test(String(number));
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        name = String(name);
        lessonId = Number(lessonId);
        parentId = parentId ? Number(parentId) : undefined;
        number = Number(number);

        let chapter: Chapter[] = [];

        await getDrizzleClient().transaction(async (tx) => {
          chapter = await tx.insert(tables.chapters).values({
            name,
            lesson_id: lessonId,
            parent_id: parentId ?? null,
            created_at: sql`now()`,
            updated_at: sql`now()`,
            owner: Number(userId),
          }).returning();
          await dbLessonSentences.insert(
            tx,
            {
              lessonId,
              number,
              chapterId: chapter[0].id,
              owner: Number(userId),
            }
          );
        });

        res.send({
          rows: chapter,
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