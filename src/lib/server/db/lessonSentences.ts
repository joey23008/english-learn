import { tables } from "@/infra/db/db";
import { and, eq, ExtractTablesWithRelations, sql } from 'drizzle-orm';
import { NodePgDatabase, NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgTransaction } from "drizzle-orm/pg-core";

type InsertProps = {
  lessonId: number,
  number: number,
  chapterId?: number,
  questionId?: number,
  owner: number,
}
type DbInst = NodePgDatabase | PgTransaction<NodePgQueryResultHKT, typeof import("/var/www/html/src/infra/db/schema"), ExtractTablesWithRelations<typeof import("/var/www/html/src/infra/db/schema")>>

export const dbLessonSentences = {
  async insert(tx: DbInst, { lessonId, number, chapterId, questionId, owner }: InsertProps) { // eslint-disable-line @typescript-eslint/no-explicit-any
    const [{ count }] = await tx
      .select({
        count: sql<number>`cast(count(${tables.lessonSentences.id}) as int)`,
      })
      .from(tables.lessonSentences)
      .where(
        and(
          eq(tables.lessonSentences.owner, owner),
          eq(tables.lessonSentences.lesson_id, lessonId),
          eq(tables.lessonSentences.number, number),
        )
      );
    if (count > 0) {
      let queryStr = sql`
        -- 一時的に負の値を設定
        WITH gte_ls AS (
          SELECT id, number
          FROM lesson_sentences
          WHERE lesson_id = ${lessonId} AND number >= ${number}
        )
        UPDATE lesson_sentences ls
        SET number = -ls.number
        FROM gte_ls ls2
        WHERE ls.id = ls2.id;
      `;
      await tx.execute(sql`${queryStr}`);

      queryStr = sql`
        -- 負の値を最終的な値に変更
        WITH gte_ls AS (
          SELECT id, number
          FROM lesson_sentences
          WHERE lesson_id = ${lessonId} AND number < 0
        )
        UPDATE lesson_sentences ls
        SET number = -ls.number + 1
        FROM gte_ls ls2
        WHERE ls.id = ls2.id;
      `;
      await tx.execute(sql`${queryStr}`);
    }
    return await tx.insert(tables.lessonSentences).values({
      lesson_id: lessonId,
      number,
      chapter_id: chapterId ?? null,
      question_id: questionId ?? null,
      created_at: sql`now()`,
      updated_at: sql`now()`,
      owner,
    }).returning();
  },
};