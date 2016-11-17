/**
 * Created by jnornhold on 11/16/16.
 */

const slackUtils = require('../utils/slack');
const Player = require('./player');
const Game = require('./game');


class table {

  constructor() {
    this.maxPlayers = 4;
    this.players = [];
  }

  joinTable(username) {
    this.players.push(new Player(slackUtils.parseUsername(username)));
  }


  startGame() {
    this.game = new Game(this.players);
    this.game.deal();
  }

  finishGame() {
    this.game = undefined;
  }

  isGameInProgress() {
    return this.game !== undefined;
  }


}