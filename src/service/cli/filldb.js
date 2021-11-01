'use strict';

const sequelize = require(`../lib/sequelize`);
const {getLogger} = require(`../lib/logger`);
const initDatabase = require(`../lib/init-db`);

const logger = getLogger({});

const {
  getRandomInt,
  shuffle,
  readContent,
  getPictureFileName
} = require(`../../utils`);

const {
  ExitCode,
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

    return initDatabase(sequelize, {categories, articles});
  }
};
