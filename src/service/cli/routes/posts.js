'use strict';

const fs = require(`fs`).promises;
const {Router} = require(`express`);
const postsRouter = new Router();

const FILE_NAME = `mocks.json`;
const {HttpCode} = require(`../../../constants`);


postsRouter.get(`/`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILE_NAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
  }
});

module.exports = postsRouter;
