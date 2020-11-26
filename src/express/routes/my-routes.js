'use strict';

const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/my`, (req, res) => res.render(`my`));
myRouter.get(`/my/comments`, (req, res) => res.render(`comments`));

module.exports = myRouter;
