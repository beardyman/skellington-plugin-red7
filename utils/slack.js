
"use strict";

const q = require('q');
const _ = require('lodash');

let teamsGet
  , teamsSave
  , usersInfo
  , channelInfo
  , botId
  , utils = {};


utils.constants = {
  eventTypes: {
    direct_mention: 'direct_mention',
    direct_message: 'direct_message'
  }
};

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
  channelInfo = q.nbind(bot.api.channels.info, bot.api.channels);
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
    let mergedData = _.merge({id: botId}, storedData, data);
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