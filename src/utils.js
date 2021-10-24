'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;

module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

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
