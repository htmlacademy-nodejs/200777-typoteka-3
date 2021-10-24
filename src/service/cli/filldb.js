'use strict';

const sequelize = require(`../lib/sequelize`);
const {getLogger} = require(`../lib/logger`);
const initDatabase = require(`../lib/init-db`);

const logger = getLogger({});

const {
  getRandomInt,
  shuffle,
  readContent,
  generateComments,
  getPictureFileName
} = require(`../../utils`);

const {
  ExitCode,
  FilePath,
  ArticlesCount,
  AnnounceRestrict,
  FullTextRestrict,
  PictureRestrict,
  CommentsRestrict
} = require(`../../constants`);


const generateArticles = (count, titles, sentences, comments, categoryCount, userCount) => (
  Array(count).fill({}).map((_, index) => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences).slice(AnnounceRestrict.MIN, AnnounceRestrict.MAX).join(` `),
    fullText: shuffle(sentences).slice(FullTextRestrict.MIN, FullTextRestrict.MAX).join(` `),
    categories: [getRandomInt(1, categoryCount)],
    picture: Math.random() > 0.5 ? getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)) : ``,
    comments: generateComments(
        getRandomInt(CommentsRestrict.MIN, CommentsRestrict.MAX),
        comments,
        index + 1,
        userCount,
        {getRandomInt, shuffle}
    ),
    userId: getRandomInt(1, userCount)
  }))
);

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
    const countArticle = Number.parseInt(count, 10) || ArticlesCount.DEFAULT;

    const articles = generateArticles(countArticle, titles, categories, sentences, commentSentences);

    return initDatabase(sequelize, {categories, articles});
  }
};
