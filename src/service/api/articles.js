'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const articleExists = require(`../middlewares/article-exists`);
const articleValidator = require(`../middlewares/article-validator`);
const commentValidator = require(`../middlewares/comment-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);


module.exports = (app, articlesService, commentsService) => {
  const route = new Router();

  app.use(`/articles`, route);


  // Get all articles
  route.get(`/`, async (req, res) => {
    const {offset, limit, comments} = req.query;

    let result;
    if (limit || offset) {
      result = await articlesService.findPage({limit, offset});
    } else {
      result = await articlesService.findAll(comments);
    }

    res
      .status(HttpCode.OK)
      .json(result);
  });


  // Get article by id
  route.get(`/:articleId`, routeParamsValidator, async (req, res) => {
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


  // Get article's comments
  route.get(`/:articleId/comments`, [routeParamsValidator, articleExists(articlesService)], async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentsService.findAll(articleId);

    res
      .status(HttpCode.OK)
      .json(comments);
  });


  // Get articles by category (will be released in next course modules)
  route.get(`/category/:categoryId`, async (req, res) => {
    const articles = await articlesService.findAll();

    res
      .status(HttpCode.OK)
      .json(articles);
  });


  // Create article
  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articlesService.create(req.body);

    res
      .status(HttpCode.CREATED)
      .json(article);
  });


  // Create comment for article
  route.post(`/:articleId/comments`, [routeParamsValidator, articleExists(articlesService), commentValidator], async (req, res) => {
    const {articleId} = req.params;
    const newComment = await commentsService.create(articleId, req.body);

    res
      .status(HttpCode.CREATED)
      .json(newComment);
  });


  // Update article by id
  route.put(`/:articleId`, [routeParamsValidator, articleValidator], async (req, res) => {
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


  // Delete article by id
  route.delete(`/:articleId`, routeParamsValidator, async (req, res) => {
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


  // Delete article's comment by id
  route.delete(`/:articleId/comments/:commentId`, [routeParamsValidator, articleExists(articlesService)], async (req, res) => {
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
