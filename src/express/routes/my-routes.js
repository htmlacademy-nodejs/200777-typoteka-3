'use strict';

const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/my`, (req, res) => res.send(`/my`));
myRouter.get(`/my/comments`, (req, res) => res.send(`/my/comments`));

module.exports = myRouter;
