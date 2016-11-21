/**
 * Created by jnornhold on 11/16/16.
 */

const _ = require('lodash');


const cardRuleDescriptions  = {
  'violet': 'Most Cards Below 4 Wins',
  'indigo': 'Most Cards in a Row Wins',
  'blue':   'Most Different Colors Wins',
  'green':  'Most Even Cards Wins',
  'yellow': 'Most of One Color Wins',
  'orange': 'Most of One Number Wins',
  'red':    'Highest Card Wins'
};

const colorHexMap = {
  'violet': '#472B60', // 71, 43, 96
  'indigo': '#293263', // 41, 50, 99
  'blue':   '#308FBA', // 48, 143, 186
  'green':  '#34AF48', // 52, 175, 72
  'yellow': '#B3993E', // 179, 153, 62
  'orange': '#C2AF32', // 194, 75, 50
  'red':    '#8F2529'  // 143, 37, 41
};

const colorRank = [
  'violet',
  'indigo',
  'blue',
  'green',
  'yellow',
  'orange',
  'red'
];


class Card {
  constructor(color, value, cardsPerSuit) {
    this.color = color;
    this.value = value;
    this.rule = cardRuleDescriptions[this.color];
    this.rank = (this.value * cardsPerSuit) + colorRank.indexOf(this.color); // calculate rank based on value first then on color
  }

  toString() {
    return `${_.upperFirst(this.color)} ${this.value} - ${this.rule}`;
  }

  toAttachment() {
    return {
      fallback: this.toString(),
      color: colorHexMap[this.color],
      text: `${this.value} - ${this.rule}`
    }
  }
}


module.exports = Card;

module.exports.properties = { cardRuleDescriptions, colorRank, colorHexMap};