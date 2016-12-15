'use strict';

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
  'yellow': '#C4AE3F', // 196, 174, 63
  'orange': '#CE7113', //'#C2AF32', // 191, 82, 51
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

function getPropertyString(color) {
  return `${_.upperFirst(color)} - ${cardRuleDescriptions[color]}`;
}

function getPropertyAttachment (color) {
  return {
    fallback: getPropertyString(color),
    color: colorHexMap[color],
    text: getPropertyString(color)
  };
}

/**
 * Generates a SVG fragment depicting the card.
 *
 * TODO: this will be useful someday: https://github.com/beardyman/skellington-plugin-red7/issues/1
 *
 * @param value
 * @param color
 * @returns {string}
 */
//function createSvgFragment (value, color) {
//  return `<g id="${color}${value}-card" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
//      <rect id="${color}${value}-bkgrd" fill="${colorHexMap[color]}" x="0" y="0" width="265" height="375" rx="8"></rect>
//      <text id="${color}${value}-num" font-family="Bauhaus93, Bauhaus 93" font-size="288" font-weight="normal" fill="#FFFFFF">
//          <tspan x="50.65625" y="265.5">${value}</tspan>
//      </text>
//      <text id="${color}${value}-rule" font-family="Helvetica-Bold, Helvetica" font-size="18" font-weight="bold" fill="#FFFFFF">
//          <tspan x="20.0791016" y="318">${cardRuleDescriptions[color]}</tspan>
//      </text>
//  </g>`;
//}


class Card {
  constructor(color, value, cardsPerSuit) {
    this.color = color;
    this.value = value;
    this.rule = cardRuleDescriptions[this.color];
    this.rank = ((this.value - 1) * cardsPerSuit) + colorRank.indexOf(this.color) + 1; // calculate rank based on value first then on color
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

module.exports.properties = { cardRuleDescriptions, colorRank, colorHexMap, getPropertyString, getPropertyAttachment};