'use strict';

const express = require(`express`);

const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const articlesRoutes = require(`./routes/offers-routes`);

const app = express();

const DEFAULT_PORT = 8080;

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.listen(DEFAULT_PORT, () => console.log(`Сервер работает на ${DEFAULT_PORT}`));
