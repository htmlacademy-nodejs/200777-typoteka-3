"use strict";

const express = require(`express`);
const request = require(`supertest`);

const categories = require(`./categories`);
const DataService = require(`../data-service/categories`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `9fs9G4`,
    "title": `Лучшие рок-музыканты 20-века`,
    "createdDate": `2021-7-14 21:28:27`,
    "announce": `Из под его пера вышло 8 платиновых альбомов. Простые ежедневные упражнения помогут достичь успеха.`,
    "fullText": `Достичь успеха помогут ежедневные повторения. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "category": [
      `Кино`,
      `Без рамки`,
      `Железо`
    ],
    "comments": [
      {
        "id": `mYSdvJ`,
        "text": `Хочу такую же футболку :-) Планируете записать видосик на эту тему? Совсем немного...`
      }
    ]
  },
  {
    "id": `ZWY4HT`,
    "title": `Другой пост`,
    "createdDate": `2021-7-14 21:28:27`,
    "announce": `Это один из лучших рок-музыкантов. Он написал больше 30 хитов. Бороться с прокрастинацией несложно.`,
    "fullText": `Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "category": [
      `Кино`,
      `IT`
    ],
    "comments": [
      {
        "id": `uZER1F`,
        "text": `Хочу такую же футболку :-) Согласен с автором! Мне не нравится ваш стиль. Ощущение что вы меня поучаете.`
      },
      {
        "id": `6_7drh`,
        "text": `Хочу такую же футболку :-)`
      },
      {
        "id": `ezAuxH`,
        "text": `Согласен с автором!`
      },
      {
        "id": `pccJUX`,
        "text": `Это где ж такие красоты? Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение что вы меня поучаете.`
      }
    ]
  },
  {
    "id": `nBmWx-`,
    "title": `Что такое золотое сечение`,
    "createdDate": `2021-7-13 21:28:27`,
    "announce": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    "fullText": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "category": [
      `Кино`,
      `Без рамки`,
      `Разное`
    ],
    "comments": [
      {
        "id": `0Sj3nl`,
        "text": `Хочу такую же футболку :-)`
      }
    ]
  },
  {
    "id": `8znBfX`,
    "title": `Борьба с прокрастинацией`,
    "createdDate": `2021-7-13 21:28:27`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Он написал больше 30 хитов.`,
    "fullText": `Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    "category": [
      `За жизнь`
    ],
    "comments": [
      {
        "id": `qsRg6e`,
        "text": `Хочу такую же футболку :-)`
      },
      {
        "id": `yC_1Qa`,
        "text": `Планируете записать видосик на эту тему?`
      }
    ]
  },
  {
    "id": `kK-2hs`,
    "title": `Как начать программировать`,
    "createdDate": `2021-7-13 21:28:27`,
    "announce": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "fullText": `Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко если вы прирожденный герой.`,
    "category": [
      `Деревья`,
      `Разное`
    ],
    "comments": [
      {
        "id": `Q23IIx`,
        "text": `Планируете записать видосик на эту тему? Плюсую но слишком много буквы!`
      }
    ]
  }
];

const app = express();
app.use(express.json());
categories(app, new DataService(mockData));

describe(`API returns categories list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 7 categories`, () => expect(response.body.length).toBe(7));

  test(`Category names are "IT", "Деревья", "Разное", "За жизнь", "Кино", "Без рамки", "Железо"`,
      () => expect(response.body).toEqual(
          expect.arrayContaining([`IT`, `Деревья`, `Разное`, `За жизнь`, `Кино`, `Без рамки`, `Железо`])
      )
  );
});
