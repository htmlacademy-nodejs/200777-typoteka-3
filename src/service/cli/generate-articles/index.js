"use strict";

const {createArticles} = require(`./create-articles`);
const {createComments} = require(`./create-comments`);
const {addCategoriesVariableField, addUserVariableField, addArticleIdField} = require(`./common`);

const {
  getRandomInt,
  shuffle,
  readContent,
  getPictureFileName,
  getRandomDate,
  getRandomNumbersArray
} = require(`../../../utils`);

const {
  FilePath,
  AnnounceRestrict,
  FullTextRestrict,
  PictureRestrict,
  CommentsCountRestrict,
  CommentSentencesMaxCount,
  USER_ID_MIN,
  CATEGORY_MIN_COUNT,
  CATEGORY_ID_MIN
} = require(`../../../constants`);

const users = require(`./users`);

module.exports.generateArticles = async (
  toSqlFile,
  countArticles
) => {
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

  const utilFunctions = {
    getRandomInt,
    shuffle,
    getPictureFileName,
    getRandomDate,
    getRandomNumbersArray
  };

  const restricts = {
    AnnounceRestrict,
    FullTextRestrict,
    PictureRestrict,
    CommentsCountRestrict,
    CommentSentencesMaxCount,
    USER_ID_MIN,
    CATEGORY_MIN_COUNT,
    CATEGORY_ID_MIN
  };


  return createArticles(
      toSqlFile,
      countArticles,
      titles,
      categories,
      sentences,
      users,
      utilFunctions,
      restricts,
      {
        addCategoriesVariableField,
        addUserVariableField
      }
  )
  .map((article, index) => (
    {
      ...article,
      comments: createComments(
          toSqlFile,
          users,
          commentSentences,
          ++index,
          utilFunctions,
          restricts,
          {
            addUserVariableField,
            addArticleIdField
          }
      )
    }));

};
