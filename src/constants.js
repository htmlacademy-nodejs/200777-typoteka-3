'use strict';

module.exports.DEFAULT_COMMAND = `--help`;
module.exports.USER_ARGV_INDEX = 2;
module.exports.ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};
module.exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};
module.exports.HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};
module.exports.MAX_ID_LENGTH = 6;
module.exports.API_PREFIX = `/api`;
module.exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`,
};
module.exports.FilePath = {
  TITLES: `./data/titles.txt`,
  CATEGORIES: `./data/categories.txt`,
  SENTENCES: `./data/sentences.txt`,
  COMMENTS: `./data/comments.txt`
};
module.exports.ArticlesCount = {
  DEFAULT: 1,
  MAX: 1000
};
module.exports.AnnounceRestrict = {
  MIN: 1,
  MAX: 2
};
module.exports.FullTextRestrict = {
  MIN: 1,
  MAX: 4
};
module.exports.PictureRestrict = {
  MIN: 1,
  MAX: 3
};
module.exports.CommentsCountRestrict = {
  MIN: 1,
  MAX: 4
};
module.exports.CommentSentencesMaxCount = {
  MIN: 1,
  MAX: 3
};
module.exports.CATEGORY_MIN_COUNT = 1;
module.exports.USER_ID_MIN = 1;
