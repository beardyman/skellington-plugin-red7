/**
 * Created by jnornhold on 11/16/16.
 */
"use strict";

const player = require('../controller/player');
const slackUtils = require('../utils/slack');
const _ = require('lodash');

module.exports = (controller, bot)=> {

  controller.hears(['dm me'],['direct_message','direct_mention'],function(bot,message) {

    console.log(message);

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

  controller.hears('play (\\d)\\s*(\\d)?', ['direct_message','direct_mention'], (bot, message) => {
    return player.play(message).then((res) => {
      // todo: respond to player saying their play is successful or not
      bot.startPrivateConversation(message,function(err,dm) {
        dm.say('Nice Play!');
      });


      // todo: if their play is successful, post in room channel with current game status
      bot.startConversation(message,function(err,convo) {
        if (res === true) {
          convo.say(`${game.getStatus().winner} has won!!!`);
        }
      });
    });
  });

  controller.hears('pass', ['direct_message','direct_mention'], (bot, message) => {
    console.log(message);

    return player.pass(message).then((res) => {
      bot.startConversation(message,function(err, convo) {
        convo.say(res);

        if (res === true) {
          convo.say(`${game.getStatus().winner} has won!!!`);
        }
      });
    });



    // todo: Post in room channel with current game status stating that the current player couldn't stand the heat.
  });
}