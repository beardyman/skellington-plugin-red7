/**
 * Created by jnornhold on 11/16/16.
 */
'use strict';

const rooms = require('../controller/rooms');
const slackUtils = require('../utils/slack');

module.exports = (controller) => {

  rooms.init();

  /**
   * Join a table
   */
  controller.hears('join', 'direct_mention', (bot, message) => {
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

  controller.hears('kick (.*)', 'direct_mention', (bot, message) => {
    return slackUtils.respond(bot, message, rooms.kick(message));
  });

  controller.hears('status', ['direct_message','direct_mention'], (bot, message) => {
    return slackUtils.respond(bot, message, rooms.getGameStatus(message));
  });

  controller.hears('players', ['direct_message','direct_mention'], (bot, message) => {
    return slackUtils.respond(bot, message, rooms.players(message));
  });


  controller.hears('start', 'direct_mention', (bot, message) => {
    return slackUtils.respond(bot, message, rooms.startGame(message));
  });

  controller.hears('help', 'direct_mention', (bot, message) => {
    console.log(message);

    // actual rules link: http://asmadigames.com/Red7Rules.pdf

  });
};