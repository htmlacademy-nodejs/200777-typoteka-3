"use strict";

module.exports.createArticles = (
    count,
    titles,
    sentences,
    categoryCount,
    userCount,
    utilFunctions,
    restricts) => (
  Array(count)
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
      categories: utilFunctions.getRandomArray(
          utilFunctions.getRandomInt(
              restricts.CATEGORY_MIN_COUNT,
              categoryCount
          ),
          {
            MIN: restricts.CATEGORY_MIN_COUNT,
            MAX: categoryCount
          }
      ),
      picture: Math.random() > 0.5 ?
        utilFunctions.getPictureFileName(
            utilFunctions.getRandomInt(
                restricts.PictureRestrict.MIN,
                restricts.PictureRestrict.MAX
            )
        ) : ``,
      publicationDate: utilFunctions.getRandomDate(),
      userId: utilFunctions.getRandomInt(
          restricts.USER_ID_MIN,
          userCount
      )
    }))
);
