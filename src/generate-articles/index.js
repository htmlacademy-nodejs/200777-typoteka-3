"use strict";

const {createArticles} = require(`./create-articles`);
const {createComments} = require(`./create-comments`);

module.exports.generateArticles = (
    count,
    titles,
    sentences,
    commentSentences,
    categoryCount,
    userCount,
    utilFunctions,
    restricts
) => createArticles(
    count,
    titles,
    sentences,
    categoryCount,
    userCount,
    utilFunctions,
    restricts)
  .map((article, index) => (
    {
      ...article,
      comments: createComments(
          commentSentences,
          index++,
          userCount,
          utilFunctions,
          restricts
      )
    }
  ));
