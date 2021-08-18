"use strict";

const express = require(`express`);
const request = require(`supertest`);

const articles = require(`./articles`);
const DataService = require(`../data-service/articles`);
const CommentsService = require(`../data-service/comments`);

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

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  articles(app, new DataService(cloneData), new CommentsService());
  return app;
};

describe(`API returns a list of articles`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));

  test(`First article's id equals "9fs9G4"`, () => expect(response.body[0].id).toBe(`9fs9G4`));
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/9fs9G4`);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Лучшие рок-музыканты 20-века"`, () => expect(response.body.title).toBe(`Лучшие рок-музыканты 20-века`));
});

test(`API returns status code 404 if articles is not found`, () => {
  const app = createAPI();

  return request(app)
    .get(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given article`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/ZWY4HT/comments`);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 4 comments`, () => expect(response.body.length).toBe(4));

  test(`First comment's id is "uZER1F`, () => expect(response.body[0].id).toBe(`uZER1F`));
});

describe(`API creates an article when data is valid`, () => {
  const newArticle = {
    title: `Валидный артикл`,
    createdDate: `2021-7-14 21:28:27`,
    announce: `Новый аннонс`,
    fullText: `Всё валидно`,
    category: [`Кино`],
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code is 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns created article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6)));
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Этот артикл`,
    createdDate: `2021-7-14 21:28:27`,
    announce: `не будет`,
    fullText: `валидным`,
    category: [`За жизнь`],
  };

  const app = createAPI();

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
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Комментарий валиден!`
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/kK-2hs/comments/`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comments count is changed`, () => request(app)
    .get(`/articles/kK-2hs/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to create a comment to non-existent article and returns code 404`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Левый комментарий`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid and returns status code 400`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/kK-2hs/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API changes existent article`, () => {
  const newArticleData = {
    title: `Новые данные`,
    createdDate: `2021-7-14 21:28:27`,
    announce: `для`,
    fullText: `артикла`,
    category: [`IT`],
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/kK-2hs`)
      .send(newArticleData);
  });

  test(`Status code is 201`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticleData)));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/kK-2hs`)
    .expect((res) => expect(res.body.title).toBe(`Новые данные`))
  );
});

test(`API returns status code 404 when trying to change non-existing article`, () => {
  const newArticleData = {
    title: `Новые данные`,
    createdDate: `2021-7-14 21:28:27`,
    announce: `для`,
    fullText: `артикла`,
    category: [`IT`],
  };

  const app = createAPI();

  return request(app)
    .put(`/articles/NOEXST`)
    .send(newArticleData)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change and article with invalid data`, () => {
  const newArticleData = {
    title: `Не хватает полей!`,
    createdDate: `2021-7-14 21:28:27`,
    announce: `fulltext'а нет`,
    category: [`IT`],
  };

  const app = createAPI();

  return request(app)
    .put(`/articles/NOEXST`)
    .send(newArticleData)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/kK-2hs`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () => expect(response.body.id).toBe(`kK-2hs`));

  test(`Articles count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => {
      console.log(res.body);

      return expect(res.body.length).toBe(4);
    }));
});


test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/ZWY4HT/comments/pccJUX`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted comment`, () => expect(response.body.id).toBe(`pccJUX`));

  test(`Comments count is 3 now`, () => request(app)
    .get(`/articles/ZWY4HT/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});

test(`API refuses to delete non-existing comment`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/ZWY4HT/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existing article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/article/NOEXST/comments/uZER1F`)
    .expect(HttpCode.NOT_FOUND);
});
