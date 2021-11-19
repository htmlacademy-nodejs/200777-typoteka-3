'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const articleExists = require(`../middlewares/article-exists`);
const articleValidator = require(`../middlewares/article-validator`);
const commentValidator = require(`../middlewares/comment-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);


module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);


  // Get all articles
  route.get(`/`, async (req, res) => {
    const {offset, limit, comments} = req.query;

    let result;
    if (limit || offset) {
      result = await articleService.findPage({limit, offset});
    } else {
      result = await articleService.findAll(comments);
    }

    res
      .status(HttpCode.OK)
      .json(result);
  });


  // Get article by id
  route.get(`/:articleId`, routeParamsValidator, async (req, res) => {
    const {articleId} = req.params;
    const {needComments} = req.query;
    const article = await articleService.findOne(articleId, needComments);

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
  route.get(`/:articleId/comments`, [routeParamsValidator, articleExists(articleService)], async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAll(articleId);

    res
      .status(HttpCode.OK)
      .json(comments);
  });


  // Get articles by category (will be released in next course modules)
  route.get(`/category/:categoryId`, async (req, res) => {
    const articles = await articleService.findAll();

    res
      .status(HttpCode.OK)
      .json(articles);
  });


  // Create article
  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    res
      .status(HttpCode.CREATED)
      .json(article);
  });


  // Create comment for article
  route.post(`/:articleId/comments`, [routeParamsValidator, articleExists(articleService), commentValidator], async (req, res) => {
    const {articleId} = req.params;
    const newComment = await commentService.create(articleId, req.body);

    res
      .status(HttpCode.CREATED)
      .json(newComment);
  });


  // Update article by id
  route.put(`/:articleId`, [routeParamsValidator, articleValidator], async (req, res) => {
    const {articleId} = req.params;

    const updated = await articleService.update(articleId, req.body);

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
    const deleted = await articleService.drop(articleId);

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
  route.delete(`/:articleId/comments/:commentId`, [routeParamsValidator, articleExists(articleService)], async (req, res) => {
    const {commentId} = req.params;
    const deleted = await commentService.drop(commentId);

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
