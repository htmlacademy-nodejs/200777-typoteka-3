"use strict";

const {Router} = require(`express`);

const upload = require(`../middlewares/upload`);
const {HttpCode} = require(`../../constants`);
const {prepareErrors} = require(`../../utils`);
const api = require(`../api`).getAPI();

const ARTICLES_PER_PAGE = 8;

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;

  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({limit, offset}),
    api.getCategories()
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  res.render(`main`, {articles, page, totalPages, categories, user});
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;

  try {
    const {search} = req.query;
    const results = await api.search(search);
    res.render(`search`, {results});
  } catch (error) {
    switch (error.response.status) {

      case HttpCode.NOT_FOUND:
        res.render(`search`, {results: [], user});
        break;

      default:
        res.render(`search`, {results: false, user});
        break;
    }
  }
});

mainRouter.get(`/categories`, (req, res) => {
  const {user} = req.session;
  res.render(`all-categories`, {user});
});

mainRouter.post(`/register`, upload.single(`upload`), async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const userData = {
    name: body.name,
    surname: body.surname,
    email: body.email,
    password: body.password,
    passwordRepeated: body[`repeat-password`],
    avatar: file.filename
  };

  console.log(`Hello! `, userData);

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    console.log(`Kucha errorov `, errors);
    const validationMessages = prepareErrors(errors);
    res.render(`sign-up`, {validationMessages, user});
  }
});

mainRouter.post(`/login`, async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await api.auth(email, password);
    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {user} = req.session;
    res.render(`login`, {user, validationMessages});
  }
});

module.exports = mainRouter;
