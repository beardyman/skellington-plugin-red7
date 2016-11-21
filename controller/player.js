/**
 * Created by jnornhold on 11/20/16.
 */
"use strict";

const _ = require('lodash');
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
  let rule = message.match[0]
    , play = message.match[1];

  play = play || rule;
};

playerControls.pass = () => {

};


module.exports = playerControls;