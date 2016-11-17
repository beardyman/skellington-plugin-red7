/**
 * Created by jnornhold on 11/16/16.
 */
'use strict';

const _ = require('lodash');


class Player {
  constructor (playerName) {
    this.name = playerName;
    this.hand = [];
    this.palette = [];
  }

  paletteToString() {
    return _.map(this.palette, (c)=>c.toString()).join('\n');
  }

  addCardToHand(card) {
    this.hand.push(card);
  }

  addCardToPalette(card) {
    this.palette.push(card);
  }

  playCard(cardIndex) {
    return _.pullAt(this.hand, cardIndex);
  }
}



module.exports = Player;