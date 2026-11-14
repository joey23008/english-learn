import type { NextApiResponse } from "next";
import { eq, sql } from 'drizzle-orm';
import { getDrizzleClient, tables } from "@/infra/db/db";
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';
import { STATUS, ORD_ASC, MSG_ERR, SORT_DIRECTIONS } from "@/consts";
import { debug } from "@/utils";
import { Lesson } from "ApiDataTypes";

type Query = {
  page?: string,
  sortField?: string,
  sortDirection?: string,
}

type ResponseData = {
  rows: Lesson[],
  total: number,
}

export const SORT_FIELDS = ['id', 'name', 'created_at', 'updated_at'] as const;
const LIMIT = '10';

export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<ResponseData | string>
  ) => {
    if (req.method === 'GET') {
      try {
        const { user, query } = req;
        const { page, sortField, sortDirection } = query as Query;

        let isValid = page ? /^[0-9]+$/.test(page) : true;
        isValid = isValid && (sortField ? SORT_FIELDS.some(v => v === sortField) : true);
        isValid = isValid && (sortDirection ? SORT_DIRECTIONS.some(v => v === sortDirection) : true);
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        let queryStr = sql`
          SELECT
            * 
          FROM
            lessons 
          WHERE
            owner = ${user} 
        `;

        const field = sortField ?? 'created_at';
        const direction = sortDirection ?? ORD_ASC;
        queryStr = sql`${queryStr} ORDER BY ${sql.raw(`${field}`)} ${sql.raw(`${direction}`)}`;

        let limit = 'ALL';
        let offset = 0;
        if (page) {
          limit = LIMIT;
          offset = (Number(page) - 1) * Number(limit);
        }
        queryStr = sql`${queryStr} LIMIT ${sql.raw(`${limit}`)} OFFSET ${sql.raw(`${offset}`)};`;

        const { rows } = await getDrizzleClient().execute<Lesson>(sql`${queryStr}`);
        const result = await getDrizzleClient()
          .select({
            count: sql<number>`cast(count(${tables.lessons.id}) as int)`,
          })
          .from(tables.lessons)
          .where(eq(tables.lessons.owner, Number(user)));
        
        res.send({
          rows,
          total: result[0].count,
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
