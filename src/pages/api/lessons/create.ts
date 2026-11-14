import type { NextApiResponse } from "next";
import { sql } from 'drizzle-orm';
import { getDrizzleClient, tables } from "@/infra/db/db";
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';
import { MSG_ERR, STATUS } from "@/consts";
import { debug, noCtrlChar } from "@/utils";
import { Lesson } from "ApiDataTypes";

type ReqType = {
  name?: string,
}

export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<Lesson | string>
  ) => {
    if (req.method === 'POST') {
      try {
        const userId = req.user;
        const { name }: ReqType = req.body;

        const isValid = name && name.length > 0 && name.length <= 255 && noCtrlChar(name);
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        const result = await getDrizzleClient().insert(tables.lessons).values({
          name,
          created_at: sql`now()`,
          updated_at: sql`now()`,
          owner: Number(userId),
        }).returning();

        res.send(result[0]);
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