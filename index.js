/**
 * Created by jnornhold on 11/16/16.
 */
'use strict';

const room = require('./actions/room');
const player = require('./actions/player');
const slackUtils = require('./utils/slack');

module.exports = {
  init: (controller, bot, expressApp) => {
    // build your bot logic here!


    slackUtils.init(controller, bot);

    // room commands
    room(controller, bot);


    // player commands
    player(controller, bot);



  }
};