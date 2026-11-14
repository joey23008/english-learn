import type { NextApiResponse } from "next";
import { and, eq, sql } from 'drizzle-orm';
import { getDrizzleClient, tables } from "@/infra/db/db";
import { authHandler } from '@/lib/auth';
import type { AuthenticatedRequest } from '@/lib/auth';
import { STATUS, MSG_ERR } from "@/consts";
import { debug } from "@/utils";
import { OrderedSentences, Phrase, Sentence } from "ApiDataTypes";

type Query = {
  id: string,
}

type Source = {
  lesson_sentence_id: number,
  chapter_id: number | null,
  number: number,
  chapter_name: string | null,
  question_id: number | null,
  user_number: string | null,
  parent: number | null,
  sentences: Sentence[],
  phrases: (Phrase & { qs_ph_id: number, priority: number})[],
}

type QsQueryResult = Omit<Source, 'sentences' | 'phrases'>

type ResponseData = {
  rows: OrderedSentences[],
}

export default authHandler(
  async (
    req: AuthenticatedRequest,
    res: NextApiResponse<ResponseData | string>
  ) => {
    if (req.method === 'GET') {
      try {
        const { user, query } = req;
        const { id } = query as Query;

        const isValid = /^[0-9]+$/.test(id);
        if (!isValid) {
          res.status(STATUS.BAD_REQUEST);
          return res.send(MSG_ERR.REQ_NOT_VALID);
        }

        const qsQuery = sql`
          WITH ls AS ( 
            SELECT
              * 
            FROM
              lesson_sentences 
            WHERE
              owner = ${Number(user)} 
              AND lesson_id = ${Number(id)}
          ) 
          SELECT
            ls.id as lesson_sentence_id,
            ls.chapter_id
            , ls.number
            , ch.name AS chapter_name
            , ls.question_id
            , qs.user_number 
            , CASE
                  WHEN ch.parent_id IS NOT NULL THEN ch.parent_id
                  WHEN qs.chapter_id IS NOT NULL THEN qs.chapter_id
                  ELSE NULL
              END AS parent
          FROM
            ls 
            LEFT JOIN chapters AS ch 
              ON ls.chapter_id = ch.id 
            LEFT JOIN questions AS qs 
              ON ls.question_id = qs.id 
          WHERE
            ch.id IS NOT NULL 
            OR qs.id IS NOT NULL 
          ORDER BY
            number ASC
        `;

        const { rows } = await getDrizzleClient().execute<QsQueryResult>(sql`${qsQuery}`);

        const sources = await Promise.all<Source>(
          rows.map(
            row => {
              return new Promise(async (resolve, reject) => {
                try {
                  
                  const result: Source = JSON.parse(JSON.stringify(row));
                  let sentences: Sentence[] = [];
                  let phrases: (Phrase & { qs_ph_id: number, priority: number })[] = [];
  
                  if (result.question_id) {
                    sentences = await getDrizzleClient()
                      .select()
                      .from(tables.sentences)
                      .where(and(eq(tables.sentences.owner, Number(user)), eq(tables.sentences.question_id, result.question_id)))
                      .orderBy(tables.sentences.id);
                    
                    const psQuery = sql`
                      SELECT
                        qsPh.id as qs_ph_id,
                        qsPh.priority,
                        ph.* 
                      FROM
                        questions_phrases AS qsPh 
                        INNER JOIN phrases AS ph 
                          ON qsPh.phrase_id = ph.id 
                      WHERE
                        qsPh.owner = ${Number(user)}
                        AND qsPh.lesson_id = ${Number(id)}
                        AND qsPh.question_id = ${result.question_id}
                      ORDER BY ph.en ASC;
                    `;
                    const phResult = await getDrizzleClient().execute<(Phrase & { qs_ph_id: number, priority: number })>(sql`${psQuery}`);
                    phrases = phResult.rows;
                  }
  
                  result.sentences = sentences;
                  result.phrases = phrases;
                  resolve(result);
                } catch (e) {
                  reject(e);
                }
              });
            }
          )
        );

        const result = sources.filter(({ parent }) => !parent).map(source => {
          return (
            source.chapter_id ? {
              ...source,
              children: getChildren(source, sources)
            } : source
          );
        });
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

const getChildren = (source: Source, sources: Source[]): OrderedSentences[] => {
  const tmpChildren = sources.filter(({ parent }) => parent && parent === source.chapter_id);
  return tmpChildren.map(child => {
    return child.chapter_id ? {
      ...child,
      children: getChildren(child, sources),
    } : child;
  });
};