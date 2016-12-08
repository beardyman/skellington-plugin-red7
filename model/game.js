/**
 * Created by jnornhold on 11/16/16.
 */

const Rules = require('./rules');
const Deck = require('./deck');
const _ = require('lodash');
const cardProperties = require('./card').properties;
const rooms = require('./rooms');
const Promise = require('bluebird');

class Game {
  constructor (players) {
    this.players = players;
    this.currentRule = 'red';
    this.numCardsPerSuit = 7;
    this.numCardsPerPlayerHand = 7;
    this.deck = new Deck(this.numCardsPerSuit);
    this.rules = new Rules(this.deck);
  }


  /**
   * Gets the players index by their username
   *
   * @param username
   * @returns {number}
   * @private
   */
  _getPlayerIndex(username) {
    return  _.findIndex(this.players, (player) => {
      return player.name === username
    });
  }

  /**
   * Removes a player from the game based on index
   *
   * @param playerIndex
   * @private
   */
  _eliminatePlayer(playerIndex) {
    _.pullAt(this.players, playerIndex);

    if (playerIndex < this.currentWinnerIndex) {
      this.currentWinnerIndex = this._doPlayerIndexMath(this.currentPlayerIndex, -1);
    }

    this.currentPlayerIndex = this._doPlayerIndexMath(this.currentPlayerIndex, 0);
  }


  /**
   * Gets the index relative to a starting index based on the size of the player list.  Compensates for going "around the corner".
   *
   * @param startingIndex - base index - assumed positive or zero
   * @param relativePosition - position to find relative to the startingIndex
   * @returns {*}
   * @private
   */
  _doPlayerIndexMath(startingIndex, relativePosition) {
    let base = startingIndex + relativePosition
      , ret;

    if (base < 0) {
      ret = this._doPlayerIndexMath(this.players.length, this.players.length + base);
    } else {
      ret = base % this.players.length;
    }

    return ret;
  }

  /**
   * Validates a card play against all other players
   *
   * @param playerIndex
   * @param palettePlayIndex
   * @param rulePlayIndex
   * @private
   */
  _validatePlay(playerIndex, palettePlayIndex, rulePlayIndex) {
    let rulePlay = {}
      , palettePlay
      , evalRule
      , playerPalette;

    return this._isItPlayersTurn(playerIndex).then(()=> {

      playerPalette = this.players[playerIndex].palette;

      // get cards from player's hand
      palettePlay = this.players[playerIndex].hand[palettePlayIndex];


      if (rulePlayIndex !== undefined) {
        rulePlay = this.players[playerIndex].hand[rulePlayIndex];
      }

      evalRule = rulePlay.color || this.currentRule;

      // is the play valid? Check against all players.  The play must win.
      _.forEach(this.players, (playerCheck, playerCheckIndex) => {
        if (playerCheckIndex !== playerIndex && !this.rules[evalRule](_.union([palettePlay], playerPalette), playerCheck.palette)) {
          throw new Error(`That play doesn't work!! ${playerCheck.name} is beating you with ${playerCheck.paletteToString()}!! If you can't beat them, you'll have to pass.`);
        }
      });
    });
  }

  /**
   * Checks if the passed in player index is the current player
   *
   * @param playerIndex
   * @private
   */
  _isItPlayersTurn(playerIndex) {
    return new Promise((resolve) => {
      if (playerIndex !== this.currentPlayerIndex) {
        throw new Error('It\'s not your turn silly!');
      }
      resolve();
    });
  }

  /**
   * Advances indexes to next player
   *
   * @returns {*}
   * @private
   */
  _rotateTurn() {
    this.currentPlayerIndex = this._doPlayerIndexMath(this.currentPlayerIndex, 1);

    if (this.players[this.currentPlayerIndex].hand.length === 0 && this.currentPlayerIndex !== this.currentWinnerIndex) {

      this._eliminatePlayer(this.currentPlayerIndex);

      // need to move the cursor back to the current player because it will be rotated again
      this.currentPlayerIndex = this._doPlayerIndexMath(this.currentPlayerIndex, -1);

      // check for winners
      if (this._isThereAWinner()) {
        return true;
      }
      return this._rotateTurn();
    }

    return this.save();
  }

  /**
   * Checks for win conditions of the game
   *
   * @returns {boolean}
   * @private
   */
  _isThereAWinner() {
    return this.players.length === 1;
  }


  /**
   * Deals 7 cards for each player's hand and puts one inital card
   */
  deal() {
    // fill each player's hand // Deals in round robin, so each player has 1 card before any player has 2 cards
    for(let cardCount = 1; cardCount <= this.numCardsPerPlayerHand; cardCount++) {
      _.forEach(this.players, (player) => {
        player.addCardToHand(this.deck.dealCard());
      });
    }

    // deal inital card to player's palette
    _.forEach(this.players, (player) => {
      player.addCardToPalette(this.deck.dealCard());
    });

    // figure out who goes first
    _.forEach(this.players, (player, index) => {

      if(index === 0 || this.rules[this.currentRule](player.palette, this.players[this._doPlayerIndexMath(index, -1)].palette)) {
        this.currentWinnerIndex = index;
      }
    });

    this.currentPlayerIndex = this._doPlayerIndexMath(this.currentWinnerIndex, 1);

    return this.save();
  }

  /**
   * Gets current status of the game
   *
   * @returns {{turn: *, winner: *, rule: string}}
   */
  getStatus() {
    let status = {
      turn: this.players[this.currentPlayerIndex],
      winner: this.players[this.currentWinnerIndex],
      rule: this.currentRule
    };

    return status;
  }

  getCurrentRule() {
    return `${_.upperFirst(this.currentRule)} - ${cardProperties.cardRuleDescriptions[this.currentRule]}`;
  }

  /**
   * A player plays a card, this function enforces the game's rules and moves the turn to the next player.
   *
   * @param playerUsername {string} - player's username
   * @param palettePlayIndex {int} - index of the card to play
   * @param rulePlayIndex {int} - index of the card to play
   */
  playTurn(playerUsername, palettePlayIndex, rulePlayIndex) {
    let playerIndex = this._getPlayerIndex(playerUsername);

    // is the play allowed?
    return this._validatePlay(playerIndex, palettePlayIndex, rulePlayIndex).then(() => {

      // passed validation
      this.players[playerIndex].addCardToPalette(this.players[playerIndex].hand[palettePlayIndex]);

      if (rulePlayIndex !== undefined) {
        let newRuleCard = this.players[playerIndex].playCard(rulePlayIndex);
        this.currentRule = newRuleCard.color;
      }

      // need to wait to "play" card because if a play card and a rule card are played, indexes will get messed up
      // this line effectively just removes the card because the line at the top of this func already added it to the palette
      this.players[playerIndex].playCard(palettePlayIndex);

      this.currentWinnerIndex = playerIndex;

      return this._rotateTurn();
    });
  }

  /**
   * A player needs to pass
   *
   * @param playerUsername
   * @returns {Promise.<bool>}
   */
  pass(playerUsername) {
    let playerIndex = this._getPlayerIndex(playerUsername);

    return this._isItPlayersTurn(playerIndex).then(() => {
      this._eliminatePlayer(playerIndex);
      return this._rotateTurn();
    });
  }

  /**
   * Gets the Player by username
   *
   * @param username
   * @returns {*|boolean}
   */
  findPlayerByUsername(username) {
    let playerIndex = this._getPlayerIndex(username);
    return this.players[playerIndex] || false;
  }

  /**s
   * Removes a player from the game based on username
   *
   * @param playerName
   */
  eliminatePlayerByName(playerName) {
    let playerIndex = this._getPlayerIndex(playerName);

    if(playerIndex !== false) {
      this._eliminatePlayer(playerIndex);
    }
    return this.save();
  }

  /**
   * Saves game data
   */
  save() {
    rooms.save();
  }

}

module.exports = Game;