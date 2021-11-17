'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const {prepareErrors} = require(`../../utils`);

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
  const categories = await getAddArticleData();
  const categoriesList = categories.map((category) => ({
    checked: false,
    ...category
  }));

  res.render(`articles/post`, {categoriesList});
});


articlesRouter.get(`/category/:categoryId`,
    (req, res) => res.render(`articles/articles-by-category`));


articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categoriesList] = await getEditArticleData(id);

  res.render(`articles/post`, {article, categoriesList});
});


articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await getViewArticleData(id, true);

  res.render(`articles/post-detail`, {article, id});
});


articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;

  const newArticleData = {
    title: body.title,
    publicationDate: new Date(body.date),
    announce: body.announcement,
    fullText: body[`full-text`],
    categories: Object.keys(body.categories).map((id) => +id.replace(/'/g, ``)),
    picture: file ? file.filename : ``
  };

  try {
    await api.createArticle(newArticleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categoriesList = await getAddArticleData();

    res.render(`articles/post`, {
      categoriesList,
      validationMessages
    });
  }
});


articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {message} = req.body;

  try {
    await api.createComment(id, {text: message});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const article = await getViewArticleData(id, true);
    res.render(`articles/post-detail`, {article, id, validationMessages});
  }
});


module.exports = articlesRouter;
