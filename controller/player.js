/**
 * Created by jnornhold on 11/20/16.
 */
"use strict";

const _ = require('lodash');
const q = require('q');
const rooms = require('../model/rooms');
const slackUtils = require('../utils/slack');
const cardProperties = require('../model/card').properties;

let playerControls = {};


playerControls.hand = (message) => {
  return slackUtils.getUser(message.user).then((res)=> {
    let user = res.name
      , response
      , table = rooms.findTableForUser(message, user)
      , player;


    if (table && table.game) {
      player = table.game.findPlayerByUsername(user);

      if (player) {
        response = {
          "Current Rule": [{
            fallback: table.game.getCurrentRule(),
            color: cardProperties.colorHexMap[table.game.currentRule],
            text: table.game.getCurrentRule()
          }],
          "Hand": player.handToAttachments(),
          "Palette": player.paletteToAttachments()
        };
      }
    }

    if (!response) {
      response = `Sorry ${user}, it doesn't look like you're playing`;
    }

    return response;
  });
};

playerControls.play = (message) => {
  let rule = message.match[1]
    , play = message.match[2];

  if (play === undefined) {
    play = rule;
    rule = undefined;
  }

  return slackUtils.getUser(message.user).then((res)=> {
    let user = res.name
      , table = rooms.findTableForUser(message, user);


    return table.game.playTurn(user, play, rule).then(() => {
      return `${play} haz been dun played`;
    });
  });
};

/**
 *
 * @param message
 * @returns {Promise.<TResult>}
 */
playerControls.pass = (message) => {
  return slackUtils.getUser(message.user).then((res)=> {
    let user = res.name
      , table = rooms.findTableForUser(message, user);


    return table.game.pass(user).then(() => {
      return `${user} has passed like a chump`;
    });
  });
};


/**
 *
 *
 * @param message
 * @returns {Promise.<TResult>}
 */
playerControls.sortCards = (message) => {
  let sortType = message.match[1]
    , preference = _.first(sortType) === 'c' ? 'color' : 'value';

  return slackUtils.getUser(message.user).then((res)=> {
    let user = res.name
      , table = rooms.findTableForUser(message, user)
      , player = table.game.findPlayerByUsername(user);

    player.setSortPreference(preference);
    return `Sorted as ${preference} first`;
  });
};


module.exports = playerControls;