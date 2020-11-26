'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/articles/:id`, (req, res) => res.render(`post`));
articlesRouter.get(`/articles/add`, (req, res) => res.render(`new-post`));
articlesRouter.get(`/articles/category/:id`, (req, res) => res.render(`articles-by-category`));
articlesRouter.get(`/articles/edit/:id`, (req, res) => res.render(`post`));

module.exports = articlesRouter;
