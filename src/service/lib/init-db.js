"use strict";

const defineModels = require(`../models`);
const Alias = require(`../models/alias`);

module.exports = async (sequelize, {categories, articles}) => {
  const {Category, Article} = defineModels(sequelize);
  await sequelize.sync({force: true});

  await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [Alias.COMMENTS]});
    await articleModel.addCategories(article.categories);
  });

  await Promise.all(articlePromises);
};
