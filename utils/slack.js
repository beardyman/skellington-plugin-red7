/**
 * Created by jnornhold on 11/16/16.
 */
"use strict";

const q = require('q');

let teamsGet
 , teamsSave
 , usersInfo;


module.exports = {

  init: (controller, bot) => {
    teamsGet = q.nbind(controller.storage.teams.get, controller.storage.teams);
    teamsSave = q.nbind(controller.storage.teams.save, controller.storage.teams);
    usersInfo = q.nbind(bot.api.users.info, bot.api.users);
  },

  parseUsername: (username) => {
    return  username.replace('<', '').replace('@', '').replace('>', '');
  },

  getUser: (userId) => {
    return usersInfo({user: userId})
      .then((res) => {
        return res.user;
      });
  },

  respond: (bot, message, promise) => {
    return promise.then((response) => {
      bot.reply(message, response);
    }).catch((err) => {
      console.log(err);
      bot.reply(message, err.toString());
    });
  }
};