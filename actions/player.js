/**
 * Created by jnornhold on 11/16/16.
 */
"use strict";

const player = require('../controller/player');
const slackUtils = require('../utils/slack');
const eventTypes = slackUtils.constants.eventTypes;
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


  controller.hears('^hand$', _.at(eventTypes, ['direct_message','direct_mention']), (bot, message) => {
    return player.hand(message).then((response)=> {
      bot.startPrivateConversation(message, (err, dm) => {

        _.forEach(response, (attachments, resPart) => {
          dm.say(`*${resPart}:*`);
          dm.say({attachments: attachments});
        });

      });
    });
  });

  controller.hears('^play (\\d)\\s*(\\d)?$', _.at(eventTypes, ['direct_message','direct_mention']), (bot, message) => {
    return player.play(message).then((res) => {
      // todo: respond to player saying their play is successful or not
      bot.startPrivateConversation(message,function(err,dm) {
        dm.say('Nice Play!');
      });


      // todo: if their play is successful, post in room channel with current game status
      bot.startConversation(message,function(err,convo) {
        let status = game.getStatus();

        if (res === true) {
          convo.say(`${status.winner} has won!!!`);
        } else {
          convo.say(`@r7 show table`);
          convo.say(`@${status.turn} its your turn!`);
        }

      });
    });
  });

  controller.hears('^pass$', _.at(eventTypes, ['direct_message','direct_mention']), (bot, message) => {
    return player.pass(message).then((res) => {
      bot.startConversation(message, function(err, convo) {
        let status = game.getStatus();

        if (res === true) {
          convo.say(`${status.winner} has won!!!`);
        } else {
          convo.say(`@r7 show table`);
          convo.say(res);
          convo.say(`@${status.turn} its your turn!`);
        }

      });
    });
  });

  controller.hears(['^sort (color)$', '^sort (value)$'], _.at(eventTypes, ['direct_message','direct_mention']), (bot, message) => {
    return player.sortCards(message).then((res) => {
      bot.startPrivateConversation(message,function(err,dm) {
        if(err) {
          console.log(err);
        }
        dm.say(res);
      });
    }).catch((err) => {
      console.log('model err');
      console.log(err);
    }) ;
  });
}