'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const articleExists = require(`../middlewares/article-exists`);
const articleValidator = require(`../middlewares/article-validator`);
const commentValidator = require(`../middlewares/comment-validator`);


module.exports = (app, articlesService, commentsService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const articles = await articlesService.findAll();

    res
      .status(HttpCode.OK)
      .json(articles);
  });


  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const {needComments} = req.query;
    const article = await articlesService.findOne(articleId, needComments);

    if (!article) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found article with id ${articleId}`);
    }

    return res
      .status(HttpCode.OK)
      .json(article);
  });


  route.get(`/:articleId/comments`, articleExists(articlesService), async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentsService.findAll(articleId);

    res
      .status(HttpCode.OK)
      .json(comments);
  });


  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articlesService.create(req.body);

    res
      .status(HttpCode.CREATED)
      .json(article);
  });


  route.get(`/category/:categoryId`, async (req, res) => {
    const articles = await articlesService.findAll();

    res
      .status(HttpCode.OK)
      .json(articles);
  });


  route.post(`/:articleId/comments`, [articleExists(articlesService), commentValidator], async (req, res) => {
    const {articleId} = req.params;
    const newComment = commentsService.create(articleId, req.body);

    res
      .status(HttpCode.CREATED)
      .json(newComment);
  });


  route.put(`/:articleId`, articleValidator, async (req, res) => {
    const {articleId} = req.params;

    const updated = await articlesService.update(articleId, req.body);

    if (!updated) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found article with id ${articleId}`);
    }

    return res
      .status(HttpCode.OK)
      .send(`Updated`);
  });


  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const deleted = await articlesService.drop(articleId);

    if (!deleted) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found article with id ${articleId}`);
    }

    return res
      .status(HttpCode.OK)
      .send(`Deleted`);
  });


  route.delete(`/:articleId/comments/:commentId`, articleExists(articlesService), async (req, res) => {
    const {commentId} = req.params;
    const deleted = await commentsService.drop(commentId);

    if (!deleted) {
      return res
        .status(HttpCode.NOT_FOUND)
        .send(`Not found comment with ${commentId}`);
    }

    return res
      .status(HttpCode.OK)
      .json(`Deleted`);
  });
};
