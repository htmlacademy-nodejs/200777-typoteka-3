"use strict";

const passwordUtils = require(`../../lib/password`);

module.exports = [
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
