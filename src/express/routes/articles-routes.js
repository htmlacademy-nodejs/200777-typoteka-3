"use strict";

const {Router} = require(`express`);

const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils`);

const api = require(`../api`).getAPI();

const articlesRouter = new Router();


const getAddArticleData = () => {
  return api.getCategories();
};

const getEditArticleData = async (id) => {
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);

  const categoriesList = categories.map((category) => ({
    checked: article.categories
      .map((item) => item.id)
      .includes(category.id),
    ...category
  }));

  return [article, categoriesList];
};

const getViewArticleData = async (id, needComments) => {
  return await api.getArticle(id, needComments);
};


articlesRouter.get(`/add`, async (req, res) => {
  const {user} = req.session;
  const {url} = req;
  const categories = await getAddArticleData();
  const categoriesList = categories.map((category) => ({
    checked: false,
    ...category
  }));

  res.render(`articles/post`, {categoriesList, url, user});
});


articlesRouter.get(`/category/:categoryId`, (req, res) => {
  const {user} = req.session;

  res.render(`articles/articles-by-category`, {user});
});


articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {user} = req.session;
  const {url} = req;
  const {id} = req.params;
  const [article, categoriesList] = await getEditArticleData(id);

  res.render(`articles/post`, {article, categoriesList, url, user});
});


articlesRouter.get(`/:id`, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const article = await getViewArticleData(id, true);

  res.render(`articles/post-detail`, {article, id, user});
});


articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;

  const newArticleData = {
    title: body.title,
    publicationDate: new Date(body.date),
    announce: body.announcement,
    fullText: body[`full-text`],
    categories: Object.keys(body.categories).map((id) => +id.replace(/'/g, ``)),
    picture: file ? file.filename : ``,
    userId: user.id
  };

  try {
    await api.createArticle(newArticleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categoriesList = await getAddArticleData();

    res.render(`articles/post`, {categoriesList, validationMessages, user});
  }
});


articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {message} = req.body;

  try {
    await api.createComment(id, {text: message, userId: user.id});
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const article = await getViewArticleData(id, true);
    res.render(`articles/post-detail`, {article, id, validationMessages, user});
  }
});

articlesRouter.post(`/edit/:id`, upload.single(`upload`), async (req, res) => {
  const {user} = req.session;
  const {url} = req;
  const {id} = req.params;
  const {body, file} = req;

  const newArticleData = {
    title: body.title,
    publicationDate: new Date(body.date),
    announce: body.announcement,
    fullText: body[`full-text`],
    categories: Object.keys(body.categories).map((categoryId) => +categoryId.replace(/'/g, ``)),
    picture: file ? file.filename : body.photo,
    userId: user.id
  };


  try {
    await api.editArticle(id, newArticleData);
    res.redirect(`/my`);
  } catch (error) {
    const validationMessages = prepareErrors(error);
    const [article, categoriesList] = await getEditArticleData(id);
    res.render(`articles/post`, {article, categoriesList, url, validationMessages, user});
  }
});


module.exports = articlesRouter;
