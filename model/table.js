/**
 * Created by jnornhold on 11/16/16.
 */

const slackUtils = require('../utils/slack');
const Player = require('./player');
const Game = require('./game');
const _ = require('lodash');


class Table {

  constructor() {
    this.maxPlayers = 4;
    this.players = [];
  }

  addPlayer(username) {
    username = slackUtils.parseUsername(username);

    if (!this.findPlayerByUsername(username)) {
      this.players.push(new Player(slackUtils.parseUsername(username)));
      return true;
    } else {
      return false;
    }
  }

  removePlayer(playerNames) {
    _.remove(this.players, (p) => p.name === playerName );
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


  findPlayerByUsername(username) {
    _.forEach(this.players, (player) => {
      if(player.name === username) {
        return player;
      }
    });
    return false;
  }

}

module.exports = Table;