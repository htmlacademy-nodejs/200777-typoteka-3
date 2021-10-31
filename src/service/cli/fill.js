'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {
  getRandomInt,
  shuffle,
  readContent,
  getPictureFileName
} = require(`../../utils`);

const {
  FilePath,
  ArticlesCount,
  AnnounceRestrict,
  FullTextRestrict,
  PictureRestrict,
  CommentsCountRestrict,
  CommentSentencesMaxCount,
  USER_ID_MIN,
  CATEGORY_MIN_COUNT
} = require(`../../constants`);

const users = require(`../../users`);

const {generateArticles} = require(`../../generate-articles`);

const FILE_NAME = `fill-db.sql`;

module.exports = {
  name: `--fill`,
  async run(args) {

    const [
      titles,
      categories,
      sentences,
      commentSentences
    ] = await Promise.all([
      readContent(FilePath.TITLES),
      readContent(FilePath.CATEGORIES),
      readContent(FilePath.SENTENCES),
      readContent(FilePath.COMMENTS)
    ]);

    const [count] = args;
    const countArticles = Number.parseInt(count, 10) || ArticlesCount.DEFAULT;


    if (countArticles > ArticlesCount.MAX) {
      console.error(chalk.red(`Не больше ${ArticlesCount.MAX} объявлений`));
      return;
    }


    const articles = generateArticles(
        countArticles,
        titles,
        sentences,
        commentSentences,
        categories.length,
        users.length,
        {
          getRandomInt,
          shuffle,
          getPictureFileName
        },
        {
          AnnounceRestrict,
          FullTextRestrict,
          PictureRestrict,
          CommentsCountRestrict,
          CommentSentencesMaxCount,
          USER_ID_MIN,
          CATEGORY_MIN_COUNT,
        }
    );

    const comments = articles.flatMap((article) => article.comments);

    const articleCategories = articles.map((article, index) => ({articleId: index + 1, categoryId: article.categories[0]}));

    const userValues = users.map(
        ({email, passwordHash, firstName, lastName, avatar}) => `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`)
    .join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles.map(
        ({title, picture, fullText, announce, userId}) => `('${title}', '${picture}', '${fullText}', '${announce}', ${userId})`
    ).join(`,\n`);

    const articleCategoryValues = articleCategories.map(({articleId, categoryId}) => `(${articleId}, ${categoryId})`).join(`,\n`);

    const commentValues = comments.map(({text, userId, articleId}) => `('${text}', ${userId}, ${articleId})`).join(`,\n`);

    const content = `
    -- Запрос на заполнение users пользователями
    INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
    ${userValues};
    
    -- Запрос на заполнение categories категориями
    INSERT INTO categories(name) VALUES
    ${categoryValues};
    
    -- Запрос на заполнение articles статьями
    ALTER TABLE articles DISABLE TRIGGER ALL;
    INSERT INTO articles(title, created_at, picture, full_text, announce, user_id) VALUES
    ${articleValues};
    ALTER TABLE articles ENABLE TRIGGER ALL;
    
    -- Запрос на создание связей между каждой статьёй из articles с категориями
    ALTER TABLE articles_categories DISABLE TRIGGER ALL;
    INSERT INTO articles_categories(article_id, category_id) VALUES
    ${articleCategoryValues};
    ALTER TABLE articles_categories ENABLE TRIGGER ALL;
    
    -- Запрос на создание комментариев к статьям articles
    ALTER TABLE comments DISABLE TRIGGER ALL;
    INSERT INTO comments(text, user_id, article_id) VALUES
    ${commentValues};
    ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
