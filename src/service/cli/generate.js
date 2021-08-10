'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {getRandomInt, shuffle} = require(`../../utils`);
const {ExitCode} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const MAX_COMMENTS_COUNT = 4;
const FILE_NAME = `mocks.json`;
const {MAX_ID_LENGTH} = require(`../../constants`);

const FILE_TITLES_PATH = `./../../data/titles.txt`;
const FILE_CATEGORIES_PATH = `./../../data/categories.txt`;
const FILE_SENTENCES_PATH = `./../../data/sentences.txt`;
const FILE_COMMENTS_PATH = `./../../data/comments.txt`;

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

const getRandomId = (idLenght) => nanoid(idLenght);

const getRandomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - getRandomInt(0, 3));
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: getRandomId(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `)
  }))
);

const generateOffers = (count, {titles, categories, sentences, comments}) => (
  Array(count).fill({}).map(() => ({
    id: getRandomId(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getRandomDate(),
    announce: shuffle(sentences).slice(0, 5).join(` `),
    fullText: shuffle(sentences).slice(0, getRandomInt(1, sentences.length - 1)).join(` `),
    category: shuffle(categories).slice(0, getRandomInt(1, 3)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS_COUNT), comments)
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const mockData = {
      titles: await readContent(FILE_TITLES_PATH),
      categories: await readContent(FILE_CATEGORIES_PATH),
      sentences: await readContent(FILE_SENTENCES_PATH),
      comments: await readContent(FILE_COMMENTS_PATH)
    };


    if (countOffer > MAX_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_COUNT} объявлений`));
      process.exit(ExitCode.error);
    }

    const content = JSON.stringify(generateOffers(countOffer, mockData));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.success);
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.error);
    }
  }
};
