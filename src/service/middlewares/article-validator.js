'use strict';

const Joi = require(`joi`);

const {HttpCode} = require(`../../constants`);


const ErrorArticleMessage = {
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов`,
  ANNOUNCE_MIN: `Аннонс содержит меньше 30 символов`,
  ANNOUNCE_MAX: `Аннонс не может содержать более 250 символов`,
  FULLTEXT_MAX: `Полный текст не может содержать более 1000 символов`,
  CATEGORIES: `Не выбрана ни одна категория статьи`,
  PUBLICATION_DATE_FORMAT: `Дата публикации не передана или формат некорректен`
};

const schema = Joi.object({
  title: Joi
    .string()
    .min(30)
    .max(250)
    .required()
    .messages({
      'string.min': ErrorArticleMessage.TITLE_MIN,
      'string.max': ErrorArticleMessage.TITLE_MAX
    }),
  publicationDate: Joi
    .date()
    .iso()
    .required()
    .messages({
      'date.format': ErrorArticleMessage.PUBLICATION_DATE_FORMAT
    }),
  announce: Joi
    .string()
    .min(30)
    .max(250)
    .required()
    .messages({
      'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
      'string.max': ErrorArticleMessage.ANNOUNCE_MAX
    }),
  fullText: Joi
    .string()
    .max(1000)
    .messages({
      'string.max': ErrorArticleMessage.FULLTEXT_MAX
    }),
  categories: Joi
    .array()
    .items(
        Joi.number().integer().positive().messages({
          'number.base': ErrorArticleMessage.CATEGORIES
        })
    )
    .min(1)
    .required(),
  picture: Joi
    .string()
});

module.exports = (req, res, next) => {
  const newArticle = req.body;

  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
