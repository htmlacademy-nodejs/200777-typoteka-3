'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {getRandomInt, shuffle} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const MAX_COMMENTS_COUNT = 4;
const FILE_NAME = `fill-db.sql`;

const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content
      .trim()
      .split(`\n`)
      .map((str) => str.trim())
      .filter((str) => str.length);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const getRandomDate = () => {
  const date = new Date();

  date.setDate(date.getDate() - getRandomInt(0, 7));

  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const generateComments = (count, comments, articleId, userCount) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    articleId,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `)
  }))
);

const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

const generateArticles = (count, titles, sentences, comments, categoryCount, userCount) => (
  Array(count).fill({}).map((_, index) => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getRandomDate(),
    announce: shuffle(sentences).slice(1, 2).join(` `),
    fullText: shuffle(sentences).slice(1, 4).join(` `),
    category: [getRandomInt(1, categoryCount)],
    picture: Math.random() > 0.5 ? getPictureFileName(getRandomInt(1, 3)) : ``,
    comments: generateComments(getRandomInt(1, MAX_COMMENTS_COUNT), comments, index + 1, userCount),
    userId: getRandomInt(1, userCount)
  }))
);

module.exports = {
  name: `--fill`,
  async run(args) {

    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const users = [
      {
        email: `ivanov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Иван`,
        lastName: `Иванов`,
        avatar: `avatar1.jpg`
      }, {
        email: `petrov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Пётр`,
        lastName: `Петров`,
        avatar: `avatar2.jpg`
      }
    ];


    if (countArticles > MAX_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_COUNT} объявлений`));
      return;
    }

    const articles = generateArticles(countArticles, titles, sentences, commentSentences, categories.length, users.length);

    const comments = articles.flatMap((article) => article.comments);

    const articleCategories = articles.map((article, index) => ({articleId: index + 1, categoryId: article.category[0]}));

    const userValues = users.map(
        ({email, passwordHash, firstName, lastName, avatar}) => `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`)
    .join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles.map(
        ({title, createdDate, picture, fullText, announce, userId}) => `('${title}', '${createdDate}', '${picture}', '${fullText}', '${announce}', ${userId})`
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
