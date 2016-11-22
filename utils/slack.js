
"use strict";

const q = require('q');
const _ = require('lodash');

let teamsGet
  , teamsSave
  , usersInfo
  , botId
  , utils = {};

/**
 *
 * @param controller
 * @param bot
 */
utils.init = (controller, bot) => {
  botId = bot.identity.id;

  teamsGet = q.nbind(controller.storage.teams.get, controller.storage.teams);
  teamsSave = q.nbind(controller.storage.teams.save, controller.storage.teams);
  usersInfo = q.nbind(bot.api.users.info, bot.api.users);
};

/**
 *
 * @param bot
 * @param message
 * @param promise
 * @returns {Promise.<TResult>}
 */
utils.respond = (bot, message, promise) => {
  return promise.then((response) => {
    bot.reply(message, response);
  }).catch((err) => {
    console.log(err);
    bot.reply(message, err.toString());
  });
};

/**
 *
 * @param username
 * @returns {XML|string}
 */
utils.parseUsername = (username) => {
  return  username.replace('<', '').replace('@', '').replace('>', '');
};


/**
 *
 * @param userId
 * @returns {Promise.<TResult>}
 */
utils.getUser = (userId) => {
  return usersInfo({user: userId})
    .then((res) => {
      return res.user;
    });
};


/**
 *
 * @param data
 * @returns {Promise.<TResult>}
 */
utils.save = (data) => {
  return teamsGet(botId).then((storedData) => {
    var mergedData = _.merge({id: botId}, storedData, data);
    return teamsSave(mergedData);
  });
};

/**
 *
 * @returns {*}
 */
utils.load = () => {
  return teamsGet(botId);
};

module.exports = utils;