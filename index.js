'use strict';

const slackUtils = require('./utils/slack');
const room = require('./actions/room');
const player = require('./actions/player');

module.exports = {
  init: (controller, bot, expressApp) => {
    slackUtils.init(controller, bot);

    // room commands
    room(controller, bot);


    // player commands
    player(controller, bot);
  },
  help: {
    command: 'red7',
    text: `\`\`\`
   Table / Game Commands
    join        Joins a table
    start       Starts a new game once players have joined.
    
   Gameplay Commands
    show table   
    hand        Shows you your hand, palette and the current rule.
    play 2      Plays the second card to your palette
    play 1 2    Plays a rule card and a card to your palette.  1 is a Rule and 2 is a palette play.
    pass        You have no play and fold your hand and palette
    
    \`\`\``
  }
};