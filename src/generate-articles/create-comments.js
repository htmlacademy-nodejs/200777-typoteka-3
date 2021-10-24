'use strict';

module.exports.createComments = (
    comments,
    articleId,
    userCount,
    utilFunctions,
    restricts
) => (
  Array(utilFunctions.getRandomInt(
      restricts.CommentsCountRestrict.MIN,
      restricts.CommentsCountRestrict.MAX)
  )
  .fill({})
  .map(() => ({
    userId: utilFunctions.getRandomInt(
        restricts.USER_ID_MIN,
        userCount
    ),
    articleId,
    text: utilFunctions
      .shuffle(comments)
      .slice(
          restricts.COMMENT_SENTENCES_MIN_COUNT,
          utilFunctions.getRandomInt(
              restricts.CommentSentencesMaxCount.MIN,
              restricts.CommentSentencesMaxCount.MAX))
      .join(` `)
  }))
);
