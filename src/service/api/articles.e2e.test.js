"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const articles = require(`./articles`);
const DataService = require(`../data-service/articles`);
const CommentsService = require(`../data-service/comments`);

const {HttpCode} = require(`../../constants`);
const initDB = require(`../lib/init-db`);

const mockCategories = [
  `Музыка`,
  `Разное`,
  `Без рамки`,
  `Программирование`
];

const mockArticles = [
  {
    "title": `Лучшие рок-музыканты 20-века`,
    "announce": `Из под его пера вышло 8 платиновых альбомов. Простые ежедневные упражнения помогут достичь успеха.`,
    "fullText": `Достичь успеха помогут ежедневные повторения. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "picture": ``,
    "categories": [
      `Музыка`,
      `Разное`,
      `Программирование`
    ],
    "comments": [
      {
        "text": `Хочу такую же футболку :-) Планируете записать видосик на эту тему? Совсем немного...`
      }
    ]
  },
  {
    "title": `Другой пост`,
    "announce": `Это один из лучших рок-музыкантов. Он написал больше 30 хитов. Бороться с прокрастинацией несложно.`,
    "fullText": `Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "picture": `item03.jpg`,
    "categories": [
      `Музыка`,
      `Без рамки`
    ],
    "comments": [
      {
        "text": `Согласен с автором!`
      },
      {
        "text": `Хочу такую же футболку :-) Согласен с автором! Мне не нравится ваш стиль. Ощущение что вы меня поучаете.`
      },
      {
        "text": `Хочу такую же футболку :-)`
      },
      {
        "text": `Это где ж такие красоты? Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение что вы меня поучаете.`
      }
    ]
  },
  {
    "title": `Что такое золотое сечение`,
    "announce": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    "fullText": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "picture": ``,
    "categories": [`Без рамки`],
    "comments": [
      {
        "text": `Хочу такую же футболку :-)`
      }
    ]
  },
  {
    "title": `Борьба с прокрастинацией`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Он написал больше 30 хитов.`,
    "fullText": `Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    "picture": `item02.jpg`,
    "categories": [`Программирование`],
    "comments": [
      {
        "text": `Хочу такую же футболку :-)`
      },
      {
        "text": `Планируете записать видосик на эту тему?`
      }
    ]
  },
  {
    "title": `Как начать программировать`,
    "announce": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "fullText": `Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко если вы прирожденный герой.`,
    "picture": `item01.jpg`,
    "categories": [`Программирование`, `Разное`],
    "comments": [
      {
        "text": `Планируете записать видосик на эту тему? Плюсую но слишком много буквы!`
      }
    ]
  }
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles});
  const app = express();
  app.use(express.json());
  articles(app, new DataService(mockDB), new CommentsService(mockDB));
  return app;
};


describe(`API returns a list of all articles`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));

  test(`Array of article's contains item with title equals "Как начать программировать"`,
      () => expect(response.body.map((item) => item.title).includes(`Как начать программировать`))
      .toBe(true));
});


describe(`API returns an article with given id`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Лучшие рок-музыканты 20-века"`, () => expect(response.body.title).toBe(`Лучшие рок-музыканты 20-века`));
});


test(`API returns status code 404 if articles is not found`, async () => {
  const app = await createAPI();

  return request(app)
    .get(`/articles/20`)
    .expect(HttpCode.NOT_FOUND);
});


describe(`API returns a list of comments to given article`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/2/comments`);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 4 comments`, () => expect(response.body.length).toBe(4));

  test(`First comment's text is "Согласен с автором!`,
      () => expect(response.body[0].text).toBe(`Согласен с автором!`));
});


describe(`API creates an article when data is valid`, () => {
  const newArticle = {
    title: `Валидный артикл`,
    announce: `Новый аннонс`,
    fullText: `Всё валидно`,
    categories: [3, 4],
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code is 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Last added article's title is "Валидный артикл"`,
      () => request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body[0].title).toBe(`Валидный артикл`)));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6)));
});


describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Этот артикл`,
    announce: `не будет`,
    fullText: `валидным`,
    category: [`Пробуем!`],
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`Articles count is not changed`,
      async () => await request(app)
        .get(`/articles`)
        .expect((res) => expect(res.body.length).toBe(5)));
});


describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Комментарий валиден!`
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles/1/comments/`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Comments count is changed`, () => request(app)
    .get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});


test(`API refuses to create a comment to non-existent article and returns code 404`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/100/comments`)
    .send({
      text: `Левый комментарий`
    })
    .expect(HttpCode.NOT_FOUND);
});


test(`API refuses to create a comment when data is invalid and returns status code 400`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/1/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});


describe(`API changes existent article`, () => {
  const newArticleData = {
    title: `Новые данные`,
    announce: `для`,
    fullText: `артикла`,
    categories: [2, 3],
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/1`)
      .send(newArticleData);
  });

  test(`Status code is 201`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/1`)
    .expect((res) => expect(res.body.title).toBe(`Новые данные`))
  );
});


test(`API returns status code 404 when trying to change non-existing article with valid data`, async () => {
  const newArticleData = {
    title: `Новые данные`,
    announce: `для`,
    fullText: `артикла`,
    categories: [2, 4],
  };

  const app = await createAPI();

  return request(app)
    .put(`/articles/100`)
    .send(newArticleData)
    .expect(HttpCode.NOT_FOUND);
});


test(`API returns status code 400 when trying to change non-existing article with invalid data`, async () => {
  const newArticleData = {
    title: `Не хватает полей!`,
    announce: `fulltext'а нет`,
    categories: [4],
  };

  const app = await createAPI();

  return request(app)
    .put(`/articles/100`)
    .send(newArticleData)
    .expect(HttpCode.BAD_REQUEST);
});


describe(`API correctly deletes an article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/5`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Articles count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4)));
});


test(`API refuses to delete non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/100`)
    .expect(HttpCode.NOT_FOUND);
});


describe(`API correctly deletes a comment`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Comments count is 0 now`, () => request(app)
    .get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(0))
  );
});


test(`API refuses to delete non-existing comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/1/comments/100`)
    .expect(HttpCode.NOT_FOUND);
});


test(`API refuses to delete a comment to non-existing article`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/article/100/comments/1`)
    .expect(HttpCode.NOT_FOUND);
});
