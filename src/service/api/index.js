'use strict';

const {Router} = require(`express`);

const categories = require(`./categories`);
const articles = require(`./articles`);
const search = require(`./search`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const {
  CategoriesService,
  ArticlesService,
  CommentsService,
  SearchService
} = require(`../data-service`);

const app = new Router();

defineModels(sequelize);

(() => {
  categories(app, new CategoriesService(sequelize));
  articles(app, new ArticlesService(sequelize), new CommentsService(sequelize));
  search(app, new SearchService(sequelize));
})();

module.exports = app;
