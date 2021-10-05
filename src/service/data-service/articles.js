'use strict';

const Aliase = require(`../models/aliase`);

class ArticlesService {
  constructor(sequelize) {
    this._Article = sequelize.model.Article;
    this._Comment = sequelize.model.Comment;
    this._Category = sequelize.model.Category;
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES];

    if (needComments) {
      include.push(Aliase.COMMENTS);
    }

    const articles = this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return articles.map((article) => article.get());
  }

  findOne(id) {
    return this._Article.findByPk(id, {include: Aliase.CATEGORIES});
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async drop(id) {
    const deletedRows = this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });
    return !!affectedRows;
  }
}

module.exports = ArticlesService;
