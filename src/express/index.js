'use strict';

const express = require(`express`);
const path = require(`path`);

const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const articlesRoutes = require(`./routes/articles-routes`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.use((req, res) => res.status(404).render(`errors/404`));
app.use((err, req, res) => res.status(404).render(`errors/500`));

app.listen(DEFAULT_PORT, () => console.log(`Сервер работает на ${DEFAULT_PORT}`));
