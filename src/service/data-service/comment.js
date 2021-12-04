"use strict";

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  async findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment
    });
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = CommentService;
