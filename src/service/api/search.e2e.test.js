"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);
const passwordUtils = require(`../lib/password`);

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
        "user": `ivanov@example.com`,
        "text": `Хочу такую же футболку :-) Согласен с автором! Мне не нравится ваш стиль. Ощущение что вы меня поучаете.`
      },
      {
        "user": `petrov@example.com`,
        "text": `Хочу такую же футболку :-)`
      },
      {
        "user": `petrov@example.com`,
        "text": `Согласен с автором!`
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
    "user": `ivanov@example.com`,
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
    "user": `petrov@example.com`,
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


const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  search(app, new DataService(mockDB));
});


describe(`API returns offer based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `золотое сечение`
      });
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`1 article found`, () => expect(response.body.length).toBe(1));

  test(`Article has correct title`, () => expect(response.body[0].title).toBe(`Что такое золотое сечение`));
});

test(`API returns code 404 if nothing is found`,
    () => request(app)
      .get(`/search`)
      .query({
        query: `Не найдёшь меня!`
      })
      .expect(HttpCode.NOT_FOUND)
);

test(`API returns 400 when query string is absent`,
    () => request(app)
        .get(`/search`)
        .expect(HttpCode.BAD_REQUEST)
);
