"use strict";

const addArticleIdField = (toSqlFile, result, articleId) => {
  const addField = (items) => items.map((item) => (
    {
      ...item,
      articleId
    }
  ));

  return toSqlFile ? addField(result)
    : result;
};

module.exports = addArticleIdField;
