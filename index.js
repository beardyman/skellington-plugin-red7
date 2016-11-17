/**
 * Created by jnornhold on 11/16/16.
 */
'use strict';

const room = require('./controller/room');
const player = require('./controller/player');

module.exports = {
  init: (controller, bot, expressApp) => {
    // build your bot logic here!

    // room commands
    room(controller, bot);


    // player commands
    player(controller, bot);



  }
};