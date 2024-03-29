"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const passwordUtils = require(`../lib/password`);

const {HttpCode} = require(`../../constants`);
const initDB = require(`../lib/init-db`);

const mockCategories = [
  `Музыка`,
  `Разное`,
  `Без рамки`,
  `Программирование`
];

const mockUsers = [
  {
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`),
    name: `Иван`,
    surname: `Иванов`,
    avatar: `avatar1.jpg`
  }, {
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    name: `Пётр`,
    surname: `Петров`,
    avatar: `avatar2.jpg`
  }
];

const mockArticles = [
  {
    "user": `ivanov@example.com`,
    "title": `Лучшие рок-музыканты 20-века`,
    "publicationDate": `2021-11-17T15:53:11.237Z`,
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
        "user": `petrov@example.com`,
        "text": `Хочу такую же футболку :-) Планируете записать видосик на эту тему? Совсем немного...`
      }
    ]
  },
  {
    "user": `petrov@example.com`,
    "title": `Другой пост`,
    "publicationDate": `2021-11-17T15:53:11.237Z`,
    "announce": `Это один из лучших рок-музыкантов. Он написал больше 30 хитов. Бороться с прокрастинацией несложно.`,
    "fullText": `Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "picture": `item03.jpg`,
    "categories": [
      `Музыка`,
      `Без рамки`
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Согласен с автором!`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Хочу такую же футболку :-) Согласен с автором! Мне не нравится ваш стиль. Ощущение что вы меня поучаете.`
      },
      {
        "user": `petrov@example.com`,
        "text": `Хочу такую же футболку :-)`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Это где ж такие красоты? Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение что вы меня поучаете.`
      }
    ]
  },
  {
    "user": `petrov@example.com`,
    "title": `Что такое золотое сечение`,
    "publicationDate": `2021-11-17T15:53:11.237Z`,
    "announce": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    "fullText": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "picture": ``,
    "categories": [`Без рамки`],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Хочу такую же футболку :-)`
      }
    ]
  },
  {
    "user": `petrov@example.com`,
    "title": `Борьба с прокрастинацией`,
    "publicationDate": `2021-11-17T15:53:11.237Z`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Он написал больше 30 хитов.`,
    "fullText": `Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    "picture": `item02.jpg`,
    "categories": [`Программирование`],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Хочу такую же футболку :-)`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Планируете записать видосик на эту тему?`
      }
    ]
  },
  {
    "user": `ivanov@example.com`,
    "title": `Как начать программировать`,
    "publicationDate": `2021-11-17T15:53:11.237Z`,
    "announce": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "fullText": `Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко если вы прирожденный герой.`,
    "picture": `item01.jpg`,
    "categories": [`Программирование`, `Разное`],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Планируете записать видосик на эту тему? Плюсую но слишком много буквы!`
      }
    ]
  }
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  const app = express();
  app.use(express.json());
  article(app, new DataService(mockDB), new CommentService(mockDB));
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
    title: `Валидный артикл. Нужно очень много слов.`,
    publicationDate: `2021-11-17T15:53:11.237Z`,
    announce: `Новый аннонс. Но будет валиден, если будет побольше букв.`,
    fullText: `Всё валидно. Пост будет создан и отображён при проверке :)`,
    categories: [3, 4],
    userId: 1
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

  test(`Last added article's title is "Валидный артикл. Нужно очень много слов."`,
      () => request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body[0].title).toBe(`Валидный артикл. Нужно очень много слов.`)));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6)));
});


describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Этот артикл. Много-много слов. Целых 30+`,
    publicationDate: `2021-11-17T15:53:11.237Z`,
    announce: `не будет здесь много слов. Но больше 30 точно`,
    categories: [2, 3],
    userId: 2
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

  test(`When field type is wrong response code is 400`, async () => {
    const badOffers = [
      {...newArticle, title: false},
      {...newArticle, publicationDate: 345},
      {...newArticle, categories: `Нечто новое`}
    ];

    for (const badOffer of badOffers) {
      await request(app)
        .post(`/articles`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badOffers = [
      {...newArticle, title: `Короткий`},
      {...newArticle, publicationDate: `2010 год, 30 февраля`},
      {...newArticle, categories: []}
    ];

    for (const badOffer of badOffers) {
      await request(app)
        .post(`/articles`)
        .send(badOffer)
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
    text: `Комментарий валиден! К лотку приучен`,
    userId: 1
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

  const invalidComment = {
    text: `Нет поля userId, поэтому приложение не создаст этот комментарий.`
  };

  return request(app)
    .post(`/articles/1/comments`)
    .send(invalidComment)
    .expect(HttpCode.BAD_REQUEST);
});


describe(`API changes existent article`, () => {
  const newArticleData = {
    title: `Новые данные. Нужно побольше текста`,
    publicationDate: `2021-11-17T15:53:11.237Z`,
    announce: `Аннонс! Это длинный текст. Очень! Много слов`,
    fullText: `артикла`,
    categories: [2, 3],
    userId: 2
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/1`)
      .send(newArticleData);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/1`)
    .expect((res) => expect(res.body.title).toBe(`Новые данные. Нужно побольше текста`))
  );
});

test(`API returns status code 404 when trying to change non-existing article with valid data`, async () => {
  const newArticleData = {
    title: `Новые данные для старой статьи`,
    publicationDate: `2021-11-17T15:53:11.237Z`,
    announce: `Нужно, чтобы здесь было более 30 символов. Мы это сделали!`,
    categories: [2, 4],
    userId: 1
  };

  const app = await createAPI();

  return request(app)
    .put(`/articles/100`)
    .send(newArticleData)
    .expect(HttpCode.NOT_FOUND);
});


test(`API returns status code 400 when trying to change non-existing article with invalid data`, async () => {
  const newArticleData = {
    title: `Не хватает полей! But we will try to change it!`,
    announce: `publicationDate field is not existent! But we can try`,
    categories: [4],
    userId: 1
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

