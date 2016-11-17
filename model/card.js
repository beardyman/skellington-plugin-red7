/**
 * Created by jnornhold on 11/16/16.
 */

const cardRuleDescriptions  = {
  'violet': 'Most Cards Below 4 Wins',
  'indigo': 'Most Cards in a Row Wins',
  'blue':   'Most Different Colors Wins',
  'green':  'Most Even Cards Wins',
  'yellow': 'Most of One Color Wins',
  'orange': 'Most of One Number Wins',
  'red':    'Highest Card Wins'
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
  constructor(color, value) {
    this.color = color;
    this.value = value;
    this.rule = cardRuleDescriptions[this.color];
    this.rank = (colorRank.indexOf(this.color) * 7) + this.value;
  }

  toString() {
    return `${this.color} ${this.value} - ${this.rule}`;
  }
}


module.exports = Card;

module.exports.properties = { cardRuleDescriptions, colorRank };