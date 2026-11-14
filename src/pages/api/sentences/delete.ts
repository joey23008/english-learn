import type { NextApiResponse } from "next";
import { and, eq } from 'drizzle-orm';
import { getDrizzleClient, tables } from "@/infra/db/db";
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';
import { STATUS, MSG_ERR } from "@/consts";
import { debug } from "@/utils";
import { Sentence } from "ApiDataTypes";

type ResType = {
  rows: Sentence[],
}

export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<ResType | string>
  ) => {
    if (req.method === 'DELETE') {
      try {
        const { user, body } = req;

        const isValid = /^[0-9]+$/.test(String(body.id));
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        const id = Number(body.id);

        let sentences: Sentence[] = [];

        await getDrizzleClient().transaction(async tx => {
          sentences = await tx
            .delete(tables.sentences)
            .where(
              and(
                eq(tables.sentences.owner, Number(user)),
                eq(tables.sentences.id, id),
              )
            )
            .returning();
        });

        res.send({
          rows: sentences
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
