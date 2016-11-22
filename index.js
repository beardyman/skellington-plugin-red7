'use strict';

const slackUtils = require('./utils/slack');
const room = require('./actions/room');
const player = require('./actions/player');

module.exports = {
  init: (controller, bot, expressApp) => {
    // build your bot logic here!

    slackUtils.init(controller, bot);

    // room commands
    room(controller, bot);


    // player commands
    player(controller, bot);s

  }
};