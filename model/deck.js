/**
 * Created by jnornhold on 11/16/16.
 */

const Card = require('./card');
const cardProperties = Card.properties;
const _ = require('lodash');

class Deck {
  constructor() {
    this.cards = [];

    _.forEach(cardProperties.colorRank, (color) => {
      for(let value = 1; value <= 7; value++) {
        this.cards.push(new Card(color, value));
      }
    });
  }

  /**
   * Returns a random card and removes it from the deck
   *
   * @returns {*}
   */
  dealCard() {
    let randomCard = _.sample(this.cards);

    _.pull(this.cards, randomCard);

    return randomCard;
  }
}