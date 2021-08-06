'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const articleExists = require(`../middlewares/article-exists`);
const articleValidator = require(`../middlewares/article-validator`);
const commentValidator = require(`../middlewares/comment-validator`);


module.exports = (app, articlesService, commentsService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = articlesService.findAll();

    return res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articlesService.findOne(articleId);

    if (!article) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found article with id ${articleId}`);
    }

    return res
      .status(HttpCode.OK)
      .json(article);
  });

  route.get(`/:articleId/comments`, articleExists(articlesService), (req, res) => {
    const {article} = res.locals;
    const comments = commentsService.findAll(article);

    return res
      .status(HttpCode.OK)
      .json(comments);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = articlesService.create(req.body);

    return res
      .status(HttpCode.CREATED)
      .json(article);
  });

  route.post(`/:articleId/comments`, [articleExists(articlesService), commentValidator], (req, res) => {
    const {article} = res.locals;
    const newComment = commentsService.create(article, req.body);

    return res
      .status(HttpCode.CREATED)
      .json(newComment);
  });

  route.put(`/:articleId`, articleValidator, (req, res) => {
    const {articleId} = req.params;
    const existsArticle = articlesService.findOne(articleId);

    if (!existsArticle) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found article with id ${articleId}`);
    }

    const updatedArticle = articlesService.update(articleId, req.body);

    return res
      .status(HttpCode.OK)
      .json(updatedArticle);
  });

  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = articlesService.drop(articleId);

    if (!deletedArticle) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found article with id ${articleId}`);
    }

    return res
      .status(HttpCode.OK)
      .json(deletedArticle);
  });

  route.delete(`/:articleId/comments/commentId`, articleExists(articlesService), (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentsService.drop(article, commentId);

    if (!deletedComment) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res
      .status(HttpCode.OK)
      .json(deletedComment);
  });
};
