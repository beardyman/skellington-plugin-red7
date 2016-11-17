/**
 * Created by jnornhold on 11/16/16.
 */

const rules = require('./rules');
const cardProperties = require('./card').properties;
const Deck = require('./deck');

class Game {
  constructor (players) {
    this.players = players;
    this.currentRule = 'red';
    this.deck = new Deck();
  }

  /**
   * Deals 7 cards for each player's hand and puts one inital card
   */
  deal() {
    // fill each player's hand
    for(let cardCount = 1; cardCount <= 7; cardCount++) {
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
      if(index === 0 || rules[this.currentRule](player.palette, this.players[index - 1].palette)) {
        this.currentWinnerIndex = index;
      }
    });
    this.currentPlayerIndex = this.currentWinnerIndex + 1;
  }

  /**
   * Gets current status of the game
   *
   * @returns {{turn: *, winner: *, rule: string}}
   */
  getStatus() {
    return {
      turn: this.players[this.currentPlayerIndex],
      winner: this.players[this.currentWinnerIndex],
      rule: this.currentRule
    };
  }

  /**
   *
   * @param playerIndex - index of the player
   * @param palettePlayIndex {int} - index of the card to play
   * @param rulePlayIndex {int} - index of the card to play
   */
  playTurn(playerIndex, palettePlayIndex, rulePlayIndex) {
    let rulePlay = {}
      , palettePlay
      , evalRule
      , playerPalette;

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
      if (playerCheckIndex !== playerIndex && rules[evalRule](_.union([palettePlay], playerPalette), playerCheck.palette)) {
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

    this.rotateTurn();
  }


  /**
   * Advances indexes to next player
   */
  rotateTurn() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

    if (this.players[this.currentPlayerIndex].hand.length === 0 && this.currentPlayerIndex !== this.currentWinnerIndex) {
      this.eliminatePlayer(this.currentPlayerIndex);
      this.rotateTurn();
    }
  }

  /**
   * Removes a player from the game
   *
   * @param playerIndex
   */
  eliminatePlayer(playerIndex) {
    if (playerIndex < this.currentWinnerIndex) {
      this.currentWinnerIndex--;
    }
    _.pullAt(this.players, playerIndex);
  }

}