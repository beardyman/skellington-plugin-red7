/**
 * Created by jnornhold on 11/16/16.
 */
'use strict';

const table = require('../model/table');

module.exports = (controller, bot) => {

  controller.hears('join', 'direct_mention', (bot, message) => {

    if (table.players === table.maxPlayers) {

    }
    else if (table.isGameInProgress()) {
      bot.reply(message, `Welcome ${message.user}!! There's a game in progress right now but you'll be dealt in next hand.`);
    }
    else if (table.addPlayer(message.user)) {
      bot.reply(message, `Welcome ${message.user}!!!`);
    } else {
      bot.reply(message, `WTF ${message.user}?!? You're already playing!!!`);
    }
  });



  controller.hears('kick (.*)', 'direct_mention', (bot, message) => {

  });

  controller.hears('status', 'direct_mention', (bot, message) => {

  });

  controller.hears('players', 'direct_mention', (bot, message) => {

  });

  controller.hears('help', 'direct_mention', (bot, message) => {

  });
};