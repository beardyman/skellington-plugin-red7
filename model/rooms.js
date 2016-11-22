'use strict';

const _ = require('lodash');
const Table = require('./table');
const slackUtils = require('../utils/slack');

let roomsCache = {};

/**
 * Gets a table based on the channel of the current message
 *
 * @param message
 * @returns {*}
 */
module.exports.getTable = (message) => {
  if (!_.get(roomsCache, `[${message.team}][${message.channel}]`)) {
    console.log(`creating new table in [${message.team}][${message.channel}]`);
    _.set(roomsCache, `[${message.team}][${message.channel}]`, new Table());
  }
  return roomsCache[message.team][message.channel];
};


/**
 * Finds a table based on where the user is playing
 *
 * @param message
 */
module.exports.findTableForUser = (message, user) => {
    // does a collection exist for this team?
    if (_.get(roomsCache, `[${message.team}]`)) {
      let table = _.find(roomsCache, (room) => {
        return _.findIndex(room.players, (player) => {
          return player.name === user;
        })
      });
      return table[_.keys(table)[0]]; // dereference room name to return table object
    }
    return false;
};

module.exports.init = () => {
  return slackUtils.load().then((data) => {

    console.log('setting cache to', data);
    roomsCache = data || {};
  });
};

module.exports.save = () => {
  return slackUtils.save(roomsCache);
};


module.exports.roomsCache = roomsCache;