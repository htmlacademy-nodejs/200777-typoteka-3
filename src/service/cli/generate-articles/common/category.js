"use strict";

const addCategoriesVariableField = (toSqlFile, result, categories, utilFunctions, restricts) => {
  const {shuffle, getRandomInt, getRandomNumbersArray} = utilFunctions;
  const {CATEGORY_MIN_COUNT} = restricts;

  const addCategoriesName = (articles) => articles.map((item) => (
    {
      ...item,
      categories: shuffle(categories).slice(0, getRandomInt(CATEGORY_MIN_COUNT, categories.length))
    }
  ));

  const addCategoriesId = (articles) => articles.map((item) => (
    {
      ...item,
      categories: getRandomNumbersArray(
          getRandomInt(
              CATEGORY_MIN_COUNT,
              categories.length
          ),
          {
            MIN: CATEGORY_MIN_COUNT,
            MAX: categories.length
          }
      )}
  ));

  return toSqlFile ? addCategoriesId(result)
    : addCategoriesName(result);
};

module.exports = addCategoriesVariableField;
