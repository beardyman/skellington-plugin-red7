/**
 * Created by jnornhold on 11/16/16.
 */

const Rules = require('./rules');
const Deck = require('./deck');
const _ = require('lodash');
const cardProperties = require('../model/card').properties;
const slackUtils = require('../utils/slack');
const rooms = require('./rooms');

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
   * Deals 7 cards for each player's hand and puts one inital card
   */
  deal() {
    // fill each player's hand
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
      if(index === 0 || this.rules[this.currentRule](player.palette, this.players[this.doPlayerIndexMath(index, -1)].palette)) {
        this.currentWinnerIndex = index;
      }
    });

    this.currentPlayerIndex = this.doPlayerIndexMath(this.currentWinnerIndex, 1);

    return this.save();
  }

  /**
   * Gets the index relative to a starting index based on the size of the player list.  Compensates for going around the corner.
   *
   * @param startingIndex - base index - assumed positive or zero
   * @param relativePosition - position to find relative to the startingIndex
   * @returns {*}
   */
  doPlayerIndexMath(startingIndex, relativePosition) {
    let base = startingIndex + relativePosition
      , ret;

    if (base < 0) {
      ret = this.players.length + base;
    } else {
      ret = base % this.players.length;
    }

    return ret;
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
   *
   * @param playerUsername - player's username
   * @param palettePlayIndex {int} - index of the card to play
   * @param rulePlayIndex {int} - index of the card to play
   */
  playTurn(playerUsername, palettePlayIndex, rulePlayIndex) {
    let rulePlay = {}
      , palettePlay
      , evalRule
      , playerPalette
      , playerIndex = this.getPlayerIndex(playerUsername);

    if (playerIndex !== this.currentPlayerIndex) {
      throw new Error('It\'s not your turn silly');
    }

    playerPalette = this.players[playerIndex].palette;

    // get cards from player's hand
    palettePlay = this.players[playerIndex].hand[palettePlayIndex];


    if (rulePlayIndex !== undefined) {
      rulePlay = this.players[playerIndex].hand[rulePlayIndex];
    }

    evalRule = rulePlay.color || this.currentRule;

    // is the play valid? Check against all players
    _.forEach(this.players, (playerCheck, playerCheckIndex)=>{
      if (playerCheckIndex !== playerIndex && this.rules[evalRule](_.union([palettePlay], playerPalette), playerCheck.palette)) {
        throw new Error(`That play doesn't work!! ${playerCheck.name} is beating you with ${playerCheck.paletteToString()}!! If you can't beat them, you'll have to pass.`)
      }
    });

    // passed validation
    if (rulePlayIndex !== undefined) {
      let newRule = this.players[playerIndex].playCard(rulePlayIndex);
      this.currentRule = newRule.color;
    }

    this.players[playerIndex].addCardToPalette(this.players[playerIndex].playCard(palettePlayIndex));

    this.currentWinnerIndex = playerIndex;

    return this.rotateTurn();
  }


  /**
   * Advances indexes to next player
   */
  rotateTurn() {
    this.currentPlayerIndex = this.doPlayerIndexMath(this.currentPlayerIndex, 1);

    if (this.players[this.currentPlayerIndex].hand.length === 0 && this.currentPlayerIndex !== this.currentWinnerIndex) {
      this.eliminatePlayer(this.currentPlayerIndex);
      this.rotateTurn();
    }

    return this.save();
  }

  /**
   *
   * @param username
   * @returns {*|boolean}
   */
  findPlayerByUsername(username) {
    let playerIndex = this.getPlayerIndex(username);
    return this.players[playerIndex] || false;
  }

  /**
   *
   * @param username
   * @returns {number}
   */
  getPlayerIndex(username) {
    return  _.findIndex(this.players, (player) => {
      return player.name === username
    });
  }

  /**
   * Removes a player from the game based on index
   *
   * @param playerIndex
   */
  eliminatePlayer(playerIndex) {
    if (playerIndex < this.currentWinnerIndex) {
      this.currentWinnerIndex = this.doPlayerIndexMath(this.currentPlayerIndex, -1);
    }
    _.pullAt(this.players, playerIndex);
  }

  /**s
   * Removes a player from the game based on username
   *
   * @param playerName
   */
  eliminatePlayerByName(playerName) {
    _.remove(this.players, (p) => p.name === playerName );
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