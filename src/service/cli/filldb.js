"use strict";

const sequelize = require(`../lib/sequelize`);
const {getLogger} = require(`../lib/logger`);
const initDatabase = require(`../lib/init-db`);

const logger = getLogger({});

const {readContent} = require(`../../utils`);

const {
  ExitCode,
  FilePath,
  ArticlesCount,
  TO_SQL_FILE
} = require(`../../constants`);

const users = require(`./generate-articles/users`);

const {generateArticles} = require(`./generate-articles`);

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }
    logger.info(`Connection to database established`);
    const [count] = args;
    const countArticles = Number.parseInt(count, 10) || ArticlesCount.DEFAULT;

    const categories = await readContent(FilePath.CATEGORIES);

    const articles = await generateArticles(
        TO_SQL_FILE.FALSE,
        countArticles
    );

    return initDatabase(sequelize, {categories, articles, users});
  }
};
