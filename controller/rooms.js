/**
 * Created by jnornhold on 11/20/16.
 */

'use strict';

const Table = require('../model/table');
const _ = require('lodash');
const q = require('q');
const slackUtils = require('../utils/slack');
const cardProperties = require('../model/card').properties;
const rooms = require('../model/rooms');

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
  let response
    , table = rooms.getTable(message);
  if(table.players.length > 0) {
    response = `Players: ${_.map(table.players, 'name')}`;
  } else {
    response = 'There aren\'t any players in this room';
  }
  return q(response);
};


/**
 *
 * @param message
 * @returns {Promise.<TResult>}
 */
module.exports.kick = (message) => {
  let toKick = SlackUtils.parseUsername(message.match[0]);

  return utils.getUser(toKick).then((res) => {
    let user = res.name
      , table = rooms.getTable(message);

    table.game.eliminatePlayerByName(user);
    table.removePlayer(user);

    return `${user} has been elimnated and kicked from the table`;s
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
  return q(`Current Rule: ${_.upperFirst(gameStatus.rule)} - ${cardProperties.cardRuleDescriptions[gameStatus.rule]} \n Current Player: ${gameStatus.turn.name}`);
};

/**
 *
 * @param message
 * @returns {*}
 */
module.exports.getGameStatus = (message) => {
  let table = rooms.getTable(message)
    , gameStatus;

  gameStatus = table.game.getStatus();
  return q(`Current Rule: ${_.upperFirst(gameStatus.rule)} - ${cardProperties.cardRuleDescriptions[gameStatus.rule]} \n Current Player: ${gameStatus.turn.name}`);
};
