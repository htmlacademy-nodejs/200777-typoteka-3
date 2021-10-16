'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const api = require(`../api`).getAPI();

const articlesRouter = new Router();

const UPLOAD_DIR = `../upload/img`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  const categoriesList = categories.map((category) => ({
    checked: false,
    ...category
  }));

  res.render(`articles/post`, {categoriesList});
});

articlesRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const newArticleData = {
    title: body.title,
    createdDate: body.date,
    announce: body.announcement,
    fullText: body[`full-text`],
    categories: Object.keys(body.categories),
    picture: file ? file.filename : ``
  };

  try {
    await api.createArticle(newArticleData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
});

articlesRouter.get(`/category/:categoryId`,
    (req, res) => res.render(`articles/articles-by-category`));

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
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

  res.render(`articles/post`, {article, categoriesList});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id, true);

  res.render(`articles/post-detail`, {article});
});

module.exports = articlesRouter;
