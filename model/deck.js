/**
 * Created by jnornhold on 11/16/16.
 */

const Card = require('./card');
const cardProperties = Card.properties;
const _ = require('lodash');

class Deck {
  constructor(cardsPerSuit) {
    this.cards = [];
    this.cardsPerSuit = cardsPerSuit;

    _.forEach(cardProperties.colorRank, (color) => {
      for(let value = 1; value <= this.cardsPerSuit; value++) {
        this.cards.push(new Card(color, value, cardsPerSuit));
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


module.exports = Deck;