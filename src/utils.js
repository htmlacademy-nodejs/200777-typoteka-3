"use strict";

const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const {MAX_DAY_COUNT} = require(`./constants`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.getRandomInt = getRandomInt;

module.exports.shuffle = (someArray) => someArray.sort(() => 0.5 - Math.random());

module.exports.readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content
      .trim()
      .split(`\n`)
      .map((str) => str.trim())
      .filter((str) => str.length);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

module.exports.getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

module.exports.getRandomDate = () => {
  const getOtherDate = () => {
    const date = new Date();
    const diffValue = getRandomInt(0, MAX_DAY_COUNT);

    date.setDate(date.getDate() + diffValue);
    return date;
  };

  const date = Math.random() > 0.5 ? new Date() : getOtherDate();

  return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
};

module.exports.prepareErrors = (errors) => {
  return errors.response.data.split(`\n`);
};

module.exports.getRandomNumbersArray = (count, restricts) => {
  const arr = [];

  for (let i = restricts.MIN; i <= count; i++) {
    const val = getRandomInt(restricts.MIN, restricts.MAX);
    arr.push(val);
  }

  return [...new Set(arr)];
};
