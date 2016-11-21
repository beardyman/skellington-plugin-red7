/**
 * Created by jnornhold on 11/16/16.
 */
"use strict";

const player = require('../controller/player');
const slackUtils = require('../utils/slack');
const _ = require('lodash');

module.exports = (controller, bot)=> {

  controller.hears(['dm me'],['direct_message','direct_mention'],function(bot,message) {
    bot.startConversation(message,function(err,convo) {
      convo.say('Heard ya');
    });

    bot.startPrivateConversation(message,function(err,dm) {
      dm.say('Private reply!');
    });

  });


  controller.hears('hand', ['direct_message','direct_mention'], (bot, message) => {
    return player.hand(message).then((response)=> {
      bot.startPrivateConversation(message, (err, dm) => {

        _.forEach(response, (attachments, resPart) => {
          dm.say(`*${resPart}:*`);
          dm.say({attachments: attachments});
        });

      });
    });
  });

  controller.hears('play (\d) (\d)', ['direct_message','direct_mention'], (bot, message) => {
    return slackUtils.respond(bot, message, player.play(message));
  });

  controller.hears('pass', ['direct_message','direct_mention'], (bot, message) => {
    return slackUtils.respond(bot, message, player.pass(message));
  });
}