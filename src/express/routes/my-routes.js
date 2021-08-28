'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();

  res.render(`my`, {articles});
});

myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();

  res.render(`comments`, {comments: articles[1].comments});
});

module.exports = myRouter;
