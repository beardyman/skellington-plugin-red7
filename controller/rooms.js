/**
 * Created by jnornhold on 11/20/16.
 */

'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const slackUtils = require('../utils/slack');
const cardProperties = require('../model/card').properties;
const rooms = require('../model/rooms');

module.exports.init = () => {
  return rooms.init();
};

module.exports.colorRank = () => {
  let response = {'Color Rank': []};

  _.forEach(cardProperties.colorRank, (color)=>{
    response['Color Rank'].push = cardProperties.getPropertyAttachment(color)
  });

  return Promise.resolve(response);
};

/**
 *
 * @param message
 * @returns {Promise.<TResult>}
 */
module.exports.join = (message) => {
  let table = rooms.getTable(message);

  return slackUtils.getUser(message.user).then((res)=> {
    let user = res.name
      , response;

    if (table.isGameInProgress()) {
      response = `Welcome ${user}!! There's a game in progress right now but you'll be dealt in next hand.`;
    } else if (table.addPlayer(user)) {
      response = `Welcome ${user}!!!`;
    } else {
      response = `WTF ${user}?!? You're already playing!!!`;
    }

    return response;
  });
};

/**
 *
 * @param message
 * @returns {*}
 */
module.exports.players = (message) => {
  return getTableForMessage(message).then((table) => {
    let response;
    if (table.players.length > 0) {
      response = `Players: ${_.map(table.players, 'name')}`;
    } else {
      response = 'There aren\'t any players in this room';
    }
    return response;
  });
};


/**
 *
 * @param message
 * @returns {Promise.<TResult>}
 */
module.exports.kick = (message) => {
  let toKick = slackUtils.parseUsername(message.match[0]);

  return utils.getUser(toKick).then((res) => {
    let user = res.name
      , table = rooms.getTable(message);

    table.game.eliminatePlayerByName(user);
    table.removePlayer(user);

    return `${user} has been elimnated and kicked from the table`;
  });
};

/**
 *
 * @param message
 * @returns {*}
 */
module.exports.startGame = (message) => {
  let table = rooms.getTable(message)
    , gameStatus;

  table.startGame();

  gameStatus = table.game.getStatus();

  return Promise.resolve(`Current Rule: ${_.upperFirst(gameStatus.rule)} - ${cardProperties.cardRuleDescriptions[gameStatus.rule]} \n Current Player: ${gameStatus.turn.name}`);
};

/**
 *
 * @param message
 * @returns {*}
 */
module.exports.getGameStatus = (message) => {

  return getTableForMessage(message).then((table) => {
    let gameStatus;

    if(table) {
      console.log('progress', table.isGameInProgress());

      if (table.isGameInProgress()) {
        gameStatus = table.game.getStatus();
        return `Current Rule: ${cardProperties.getPropertyString(gameStatus.rule)} \n Current Player: ${gameStatus.turn.name}`;
      }
      return `It doesn't look like you're in an active game. Try \`@r7 start\`.`;
    }
    return `Sorry, it doesn't look like you're playing anywhere.  You should join a table`;
  });
};


/**
 * Gets the table depending on if the message came from a dm or a open channel
 *
 * @param message
 * @returns {*}
 */
function getTableForMessage(message) {
  if (message.event === slackUtils.constants.eventTypes.direct_message) {
    return slackUtils.getUser(message.user).then((res)=>rooms.findTableForUser(message, res.name));
  }
  return Promise.resolve(rooms.getTable(message));
}


/**
 * Displays the Current rule and the palette for each player
 *
 * @param message
 * @returns {*}
 */
module.exports.showTable = (message) => {
  return getTableForMessage(message).then((table) => {
    let response;


    if (table && table.isGameInProgress()) {
      response = {
        "Current Rule": table.game.getCurrentRuleAsAttachment()
      };

      _.forEach(table.game.players, (player) => {
        response[player.name] = player.paletteToAttachments();
      });

      return response;
    }
    return 'There isn\'t a game in progress right now';
  });
};