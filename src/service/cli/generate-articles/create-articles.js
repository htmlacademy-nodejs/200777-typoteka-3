"use strict";

module.exports.createArticles = (
    toSqlFile,
    count,
    titles,
    categories,
    sentences,
    users,
    utilFunctions,
    restricts,
    addVariableFieldFunctions) => {
  const {addCategoriesVariableField, addUserVariableField} = addVariableFieldFunctions;

  let result = Array(count)
      .fill({})
      .map(() => ({
        title: titles[
          utilFunctions.getRandomInt(
              0,
              titles.length - 1)
        ],
        announce: utilFunctions
          .shuffle(sentences)
          .slice(
              restricts.AnnounceRestrict.MIN,
              restricts.AnnounceRestrict.MAX
          )
          .join(` `),
        fullText: utilFunctions
          .shuffle(sentences)
          .slice(
              restricts.FullTextRestrict.MIN,
              restricts.FullTextRestrict.MAX
          )
          .join(` `),
        picture: Math.random() > 0.5 ?
          utilFunctions.getPictureFileName(
              utilFunctions.getRandomInt(
                  restricts.PictureRestrict.MIN,
                  restricts.PictureRestrict.MAX
              )
          ) : ``,
        publicationDate: utilFunctions.getRandomDate()
      })
      );


  const utilFuntionsForFields = {
    getRandomNumbersArray: utilFunctions.getRandomNumbersArray,
    getRandomInt: utilFunctions.getRandomInt,
    shuffle: utilFunctions.shuffle
  };
  const restrictsForFields = {
    USER_ID_MIN: restricts.USER_ID_MIN,
    CATEGORY_MIN_COUNT: restricts.CATEGORY_MIN_COUNT
  };

  result = addUserVariableField(
      toSqlFile,
      result,
      users,
      utilFuntionsForFields,
      restrictsForFields
  );

  result = addCategoriesVariableField(
      toSqlFile,
      result,
      categories,
      utilFuntionsForFields,
      restrictsForFields
  );

  return result;
};

