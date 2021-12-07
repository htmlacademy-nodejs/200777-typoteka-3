"use strict";

module.exports.createComments = (
    toSqlFile,
    users,
    comments,
    articleId,
    utilFunctions,
    restricts,
    addVariableFieldFunctions
) => {
  const {addUserVariableField, addArticleIdField} = addVariableFieldFunctions;

  let result = Array(
      utilFunctions.getRandomInt(
          restricts.CommentsCountRestrict.MIN,
          restricts.CommentsCountRestrict.MAX)
  )
  .fill({})
  .map(() => ({
    text: utilFunctions
      .shuffle(comments)
      .slice(
          0,
          utilFunctions.getRandomInt(
              restricts.CommentSentencesMaxCount.MIN,
              restricts.CommentSentencesMaxCount.MAX))
      .join(` `)
  }));

  const utilFuntionsForFields = {
    getRandomInt: utilFunctions.getRandomInt
  };
  const restrictsForFields = {
    USER_ID_MIN: restricts.USER_ID_MIN
  };

  result = addUserVariableField(
      toSqlFile,
      result,
      users,
      utilFuntionsForFields,
      restrictsForFields
  );

  result = addArticleIdField(
      toSqlFile,
      result,
      articleId
  );

  return result;
};
