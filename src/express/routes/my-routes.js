"use strict";

const {Router} = require(`express`);
const auth = require(`../middlewares/auth`);
const api = require(`../api`).getAPI();
const myRouter = new Router();

myRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles();

  res.render(`my`, {articles, user});
});

myRouter.get(`/comments`, auth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles();

  res.render(`comments`, {comments: articles[0].comments, user});
});

module.exports = myRouter;
