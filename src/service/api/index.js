"use strict";

const {Router} = require(`express`);

const categories = require(`./category`);
const articles = require(`./article`);
const search = require(`./search`);
const user = require(`./user`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService,
  UserService
} = require(`../data-service`);

const app = new Router();

defineModels(sequelize);

(() => {
  categories(app, new CategoryService(sequelize));
  articles(app, new ArticleService(sequelize), new CommentService(sequelize));
  search(app, new SearchService(sequelize));
  user(app, new UserService(sequelize));
})();

module.exports = app;
