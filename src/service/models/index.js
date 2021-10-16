"use strict";

const {Model} = require(`sequelize`);

const defineCategory = require(`./category`);
const defineArticle = require(`./article`);
const defineComment = require(`./comment`);

const Alias = require(`./alias`);

class ArticleCategory extends Model {}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);

  Article.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: `articleId`,
    onDelete: `cascade`
  });

  Comment.belongsTo(Article, {
    foreignKey: `articleId`
  });

  ArticleCategory.init({}, {
    sequelize,
    tableName: `article_categories`
  });

  Article.belongsToMany(Category, {
    through: ArticleCategory,
    as: Alias.CATEGORIES
  });

  Category.belongsToMany(Article, {
    through: ArticleCategory,
    as: Alias.ARTICLES
  });

  Category.hasMany(ArticleCategory, {
    as: Alias.ARTICLE_CATEGORIES
  });

  return {Category, Comment, Article, ArticleCategory};
};

module.exports = define;
