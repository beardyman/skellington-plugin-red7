/**
 * Created by jnornhold on 11/16/16.
 */
'use strict';

const rooms = require('../controller/rooms');
const slackUtils = require('../utils/slack');
const eventTypes = slackUtils.constants.eventTypes;
const _ = require('lodash');

module.exports = (controller) => {

  rooms.init();

  /**
   * Join a table
   */
  controller.hears('^join$', eventTypes.direct_mention, (bot, message) => {
    return slackUtils.respond(bot, message, rooms.join(message));
  });

//  controller.on('channel_joined',function(bot,message) {
//    return slackUtils.respond(bot, message, rooms.join(message));

    // message contains data sent by slack
    // in this case:
    // https://api.slack.com/events/channel_joined

//  });

//  controller.on('channel_leave',function(bot,message) {

    // message format matches this:
    // https://api.slack.com/events/message/channel_leave

//  });

  controller.hears('^kick (.*)$', eventTypes.direct_mention, (bot, message) => {
    return slackUtils.respond(bot, message, rooms.kick(message));
  });

  controller.hears('^status$', _.at(eventTypes, ['direct_message','direct_mention']), (bot, message) => {
    return slackUtils.respond(bot, message, rooms.getGameStatus(message));
  });

  controller.hears('^players$', _.at(eventTypes, ['direct_message','direct_mention']), (bot, message) => {
    return slackUtils.respond(bot, message, rooms.players(message));
  });


  controller.hears('^start$', eventTypes.direct_mention, (bot, message) => {
    return slackUtils.respond(bot, message, rooms.startGame(message));
  });

  controller.hears('help rank', _.at(eventTypes, ['direct_message','direct_mention']), (bot, message) => {
    // actual rules link: http://asmadigames.com/Red7Rules.pdf



  });

  controller.hears('^show table$', _.at(eventTypes, ['direct_message','direct_mention']), (bot, message) => {
    return rooms.showTable(message).then((response) => {

      bot.startConversation(message,function(err, convo) {
        _.forEach(response, (attachments, resPart) => {
          convo.say(`*${resPart}:*`);
          convo.say({attachments: attachments});
        });

      });
    });
  });
};