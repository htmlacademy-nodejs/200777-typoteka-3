'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {
  getRandomInt,
  shuffle
} = require(`../../utils`);
const {
  ExitCode
} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const FILE_NAME = `mocks.json`;

const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const getRandomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - getRandomInt(0, 3));
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const generateOffers = (count, titles, categories, sentences) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getRandomDate(),
    announce: shuffle(sentences).slice(0, 5),
    fullText: shuffle(sentences).slice(0, getRandomInt(1, sentences.length - 1)),
    category: shuffle(categories).slice(0, getRandomInt(1, 3)),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);

    if (countOffer > MAX_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_COUNT} объявлений`));
      process.exit(ExitCode.error);
    }

    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences));

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
