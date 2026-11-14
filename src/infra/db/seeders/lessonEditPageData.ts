import { getDrizzleClient, tables } from "../db";
import { sql } from 'drizzle-orm';

(async () => {
  try {
    await getDrizzleClient().delete(tables.lessons);
    await getDrizzleClient().delete(tables.chapters);
    await getDrizzleClient().delete(tables.questions);
    await getDrizzleClient().delete(tables.sentences);
    await getDrizzleClient().delete(tables.phrases);
    await getDrizzleClient().delete(tables.questionsPhrases);
    await getDrizzleClient().delete(tables.responses);
    await getDrizzleClient().delete(tables.lessonSentences);

    await getDrizzleClient().transaction(async (tx) => {
      const users = await tx
        .select({
          id: tables.users.id
        })
        .from(tables.users);
      
      await Promise.all<void>(
        users.map(({ id: owner }) => {
          return new Promise(async (usrRes, usrRej) => {
            try {
              const phrases = [...Array(5)].map((_, i) => ({
                en: `Bite the bullet${i + 1}`,
                jp: `辛いことや避けられない困難に立ち向かう。${i + 1}`,
              }));
              const phraseIds = await Promise.all<number>(
                phrases.map(phrase => {
                  return new Promise(async (resolve, reject) => {
                    try {
                      const [{phraseId}] = await tx.insert(tables.phrases).values({
                        en: phrase.en,
                        jp: phrase.jp,
                        created_at: sql`now()`,
                        updated_at: sql`now()`,
                        owner: owner,
                      }).returning({ phraseId: tables.phrases.id });
                      resolve(phraseId);
                    } catch (e) {
                      reject(e);
                    }
                  });
                })
              );
              const lessons = [...Array(30)].map((_, i) => ({
                name: `マイレッスン${i + 1}`
              }));
              await Promise.all<number>(
                lessons.map(lesson => {
                  return new Promise(async (lessRes, lessRej) => {
                    try {
                      const [{lessonId}] = await tx.insert(tables.lessons).values({
                        name: lesson.name,
                        created_at: sql`now()`,
                        updated_at: sql`now()`,
                        owner: owner,
                      }).returning({ lessonId: tables.lessons.id });
              
                      const chapters = [...Array(5)].map((_, i) => ({
                        name: `マイチャプター${i + 1}`
                      }));
                      await Promise.all<number>(
                        chapters.map((chapter, chapIdx) => {
                          return new Promise(async (chapRes, chapReject) => {
                            try {
                              const [{chapterId}] = await tx.insert(tables.chapters).values({
                                name: chapter.name,
                                lesson_id: lessonId,
                                created_at: sql`now()`,
                                updated_at: sql`now()`,
                                owner: owner,
                              }).returning({ chapterId: tables.chapters.id });
                
                              const questionLength = 5;
                              const questions = [...Array(questionLength)].map((_, i) => ({
                                user_number: `マイクエスチョン${(chapIdx * questionLength) + i + 1}`,
                              }));
              
                              const tmpChapNumber = chapIdx + 1;
                              const chapNumber = chapIdx === 0 ? tmpChapNumber : (questionLength * chapIdx) + tmpChapNumber;
                              await tx.insert(tables.lessonSentences).values({
                                lesson_id: lessonId,
                                number: chapNumber,
                                chapter_id: chapterId,
                                created_at: sql`now()`,
                                updated_at: sql`now()`,
                                owner: owner,
                              });
              
                              await Promise.all<number>(
                                questions.map((question, questionIdx) => {
                                  return new Promise(async (questionRes, questionRej) => {
                                    try {
                                      const [{questionId}] = await tx.insert(tables.questions).values({
                                        user_number: question.user_number,
                                        lesson_id: lessonId,
                                        created_at: sql`now()`,
                                        updated_at: sql`now()`,
                                        owner: owner,
                                        chapter_id: chapterId,
                                      }).returning({ questionId: tables.questions.id });
                
                                      const tmpQuesNumber = questionIdx + 1;
                                      const quesNumber = chapNumber + tmpQuesNumber;
                                      await tx.insert(tables.lessonSentences).values({
                                        lesson_id: lessonId,
                                        number: quesNumber,
                                        question_id: questionId,
                                        created_at: sql`now()`,
                                        updated_at: sql`now()`,
                                        owner: owner,
                                      });
                  
                                      const sentences = [...Array(2)].map((_, i) => ({
                                        content: `今日は朝からスタバで勉強したり銀行取引があったり大変だったが、明日はもっとやることがありそうだ。${i + 1}}`,
                                        answer: `Today was a busy day, studying at Starbucks and doing some banking this morning, but it looks like I'll have even more to do tomorrow.${i + 1}}`,
                                      }));
                                      await Promise.all<number>(
                                        sentences.map(sentence => {
                                          return new Promise(async (sentenceRes, sentenceRej) => {
                                            try {
                                              const [{sentenceId}] = await tx.insert(tables.sentences).values({
                                                content: sentence.content,
                                                answer: sentence.answer,
                                                lesson_id: lessonId,
                                                question_id: questionId,
                                                created_at: sql`now()`,
                                                updated_at: sql`now()`,
                                                owner: owner,
                                              }).returning({ sentenceId: tables.sentences.id });
                                              await tx.insert(tables.responses).values({
                                                content: sentence.answer,
                                                lesson_id: lessonId,
                                                sentence_id: sentenceId,
                                                created_at: sql`now()`,
                                                updated_at: sql`now()`,
                                                owner: owner,
                                              }).returning({ responseId: tables.responses.id });
                                              sentenceRes(sentenceId);
                                            } catch (e) {
                                              sentenceRej(e);
                                            }
                                          });
                                        })
                                      );
                                      await Promise.all<number>(
                                        phraseIds.map(phraseId => {
                                          return new Promise(async (phraseRes, phraseRej) => {
                                            try {
                                              const [{ qPId }] = await tx.insert(tables.questionsPhrases).values({
                                                lesson_id: lessonId,
                                                question_id: questionId,
                                                phrase_id: phraseId,
                                                created_at: sql`now()`,
                                                updated_at: sql`now()`,
                                                owner: owner,
                                              }).returning({ qPId: tables.questionsPhrases.id });
                                              phraseRes(qPId);
                                            } catch (e) {
                                              phraseRej(e);
                                            }
                                          });
                                        })
                                      );
                                      questionRes(questionId);
                                    } catch (e) {
                                      questionRej(e);
                                    }
                                  });
                                })
                              );
                              chapRes(chapterId);
                            } catch (e) {
                              chapReject(e);
                            }
                          });
                        })
                      );
                      lessRes(lessonId);
                    } catch (e) {
                      lessRej(e);
                    }
                  });
                })
              );
              usrRes();
            } catch (e) {
              usrRej(e);
            }
          });
        })
      );
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  process.exit();
})();



