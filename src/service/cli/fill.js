"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {readContent} = require(`../../utils`);
const {generateArticles} = require(`./generate-articles`);

const {
  ArticlesCount,
  TO_SQL_FILE,
  FilePath
} = require(`../../constants`);

const users = require(`./generate-articles/users`);

const FILE_NAME = `fill-db.sql`;


module.exports = {
  name: `--fill`,
  async run(args) {
    const [count] = args;
    const countArticles = Number.parseInt(count, 10) || ArticlesCount.DEFAULT;


    if (countArticles > ArticlesCount.MAX) {
      console.error(chalk.red(`Не больше ${ArticlesCount.MAX} объявлений`));
      return;
    }

    const categories = await readContent(FilePath.CATEGORIES);

    const articles = await generateArticles(
        TO_SQL_FILE.TRUE,
        countArticles
    );

    const comments = articles.flatMap((article) => article.comments);

    const articleCategories = articles.flatMap((article, index) => {
      return article.categories.map((categoryId) => ({
        articleId: index + 1,
        categoryId
      }));
    });

    const userValues = users.map(
        ({email, passwordHash, name, surname, avatar}) => `('${email}', '${passwordHash}', '${name}', '${surname}', '${avatar}')`)
    .join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles.map(
        ({title, publicationDate, picture, fullText, announce, userId}) => `('${title}', '${publicationDate}', '${picture}', '${fullText}', '${announce}', '${userId}')`
    ).join(`,\n`);

    const articleCategoryValues = articleCategories.map(({articleId, categoryId}) => (`('${articleId}', '${categoryId}')`)).join(`,\n`);


    const commentValues = comments.map(({text, userId, articleId}) => `('${text}', '${userId}', '${articleId}')`).join(`,\n`);


    const content = `
    -- Запрос на заполнение users пользователями
    INSERT INTO users(email, password_hash, name, surname, avatar) VALUES
    ${userValues};

    -- Запрос на заполнение categories категориями
    INSERT INTO categories(name) VALUES
    ${categoryValues};

    -- Запрос на заполнение articles статьями
    ALTER TABLE articles DISABLE TRIGGER ALL;
    INSERT INTO articles(title, publication_date, picture, full_text, announce, user_id) VALUES
    ${articleValues};
    ALTER TABLE articles ENABLE TRIGGER ALL;

    -- Запрос на создание связей между каждой статьёй из articles с категориями
    ALTER TABLE article_categories DISABLE TRIGGER ALL;
    INSERT INTO article_categories(article_id, category_id) VALUES
    ${articleCategoryValues};
    ALTER TABLE article_categories ENABLE TRIGGER ALL;

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
