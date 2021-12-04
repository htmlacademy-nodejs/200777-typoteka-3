"use strict";

const addUserVariableField = (toSqlFile, result, users, utilFunctions, restricts) => {
  const {getRandomInt} = utilFunctions;
  const {USER_ID_MIN} = restricts;

  const addUserId = (items) => items.map((item) => (
    {
      ...item,
      userId: getRandomInt(USER_ID_MIN, users.length)
    }
  ));

  const addUserEmail = (items) => items.map((item) => (
    {
      ...item,
      user: users[getRandomInt(0, users.length - 1)].email
    }
  ));

  return toSqlFile ? addUserId(result)
    : addUserEmail(result);
};

module.exports = addUserVariableField;
