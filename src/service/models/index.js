"use strict";

const {Model} = require(`sequelize`);

const defineCategory = require(`./category`);
const defineArticle = require(`./article`);
const defineComment = require(`./comment`);

const Aliase = require(`./aliase`);

class ArticleCategory extends Model {}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);

  Article.hasMany(Comment, {
    as: Aliase.COMMENTS,
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
    as: Aliase.CATEGORIES
  });

  Category.belongsToMany(Article, {
    through: ArticleCategory,
    as: Aliase.ARTICLES
  });

  return {Category, Comment, Article, ArticleCategory};
};

module.exports = define;
