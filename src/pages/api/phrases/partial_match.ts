import type { NextApiResponse } from "next";
import { and, eq, ilike } from 'drizzle-orm';
import { getDrizzleClient, tables } from "@/infra/db/db";
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';
import { STATUS, MSG_ERR } from "@/consts";
import { debug, noCtrlChar } from "@/utils";
import { Phrase } from "ApiDataTypes";

type ResponseData = {
  rows: Phrase[],
}

/**
 * Query:
 *  keyword: string,
 */
export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<ResponseData | string>
  ) => {
    if (req.method === 'GET') {
      try {
        const { user, query } = req;

        const isValid = query.keyword && typeof query.keyword === 'string' && noCtrlChar(query.keyword);
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        const keyword = String(query.keyword);

        const result = await getDrizzleClient()
          .select()
          .from(tables.phrases)
          .where(
            and(
              eq(tables.phrases.owner, Number(user)),
              ilike(tables.phrases.en, `%${keyword}%`)
            )
          );
        
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
