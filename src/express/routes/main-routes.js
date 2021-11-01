'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const api = require(`../api`).getAPI();

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const [
    articles,
    categories
  ] = await Promise.all([
    api.getArticles(),
    api.getCategories(true)
  ]);

  res.render(`main`, {articles, categories});
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;
    const results = await api.search(search);
    res.render(`search`, {results});
  } catch (error) {
    switch (error.response.status) {

      case HttpCode.NOT_FOUND:
        res.render(`search`, {results: []});
        break;

      default:
        res.render(`search`, {results: false});
        break;
    }
  }
});

mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = mainRouter;
