'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/articles/:id`, (req, res) => res.send(`/articles/:id`));
articlesRouter.get(`/articles/add`, (req, res) => res.send(`/articles/add`));
articlesRouter.get(`/articles/category/:id`, (req, res) => res.send(`/articles/category/:id`));
articlesRouter.get(`/articles/edit/:id`, (req, res) => res.send(`/articles/edit/:id`));

module.exports = articlesRouter;
