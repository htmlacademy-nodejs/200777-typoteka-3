'use strict';

const CategoryService = require(`./category`);
const CommentService = require(`./comment`);
const ArticleService = require(`./article`);
const SearchService = require(`./search`);
const UserService = require(`./user`);

module.exports = {
  CategoryService,
  CommentService,
  ArticleService,
  SearchService,
  UserService
};
