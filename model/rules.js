/**
 * Created by jnornhold on 11/16/16.
 */
'use strict';

const _ = require('lodash');
const cardProperties = require('./card').properties;

const cardRules = {
  /**
   * Most Cards Below 4 Wins
   *
   * @param currentPalette
   * @param comparePalette
   * @returns {boolean}
   */
  violet: (currentPalette, comparePalette) => {
    let currentQualifying = _.groupBy(currentPalette, (c) => c.value < 4).true
      , compareQualifying = _.groupBy(comparePalette, (c) => c.value < 4).true;

    return decide(currentQualifying, compareQualifying);
  },

  /**
   * Most Cards in a Row Wins
   *
   * @param currentPalette
   * @param comparePalette
   * @returns {boolean}
   */
  indigo: (currentPalette, comparePalette) => {
    let currentQualifying = getConsecutive(currentPalette)
      , compareQualifying = getConsecutive(comparePalette);

    return decide(currentQualifying, compareQualifying);
  },

  /**
   * Most Different Colors Wins
   *
   * @param currentPalette
   * @param comparePalette
   * @returns {boolean}
   */
  blue: (currentPalette, comparePalette) => {
    let currentColorGroups = _.groupBy(currentPalette, 'color')
      , compareColorGroups = _.groupBy(comparePalette, 'color')
      , currentQualifying
      , compareQualifying;

    currentQualifying = _.map(currentColorGroups, (colorGroup) => {
      return getHighestCard(colorGroup);
    });

    compareQualifying = _.map(compareColorGroups, (colorGroup) => {
      return getHighestCard(colorGroup);
    });

    return decide(currentQualifying, compareQualifying);
  },

  /**
   * Most Even Cards Wins
   *
   * @param currentPalette
   * @param comparePalette
   * @returns {boolean}
   */
  green: (currentPalette, comparePalette) => {
    let currentQualifying = _.groupBy(currentPalette, (c) => c.value % 2)['0']
      , compareQualifying = _.groupBy(comparePalette, (c) => c.value % 2)['0'];

    return decide(currentQualifying, compareQualifying);
  },

  /**
   * Most of One Color Wins
   *
   * @param currentPalette
   * @param comparePalette
   * @returns {boolean}
   */
  yellow: (currentPalette, comparePalette) => {
    let currentColorGroups = _.groupBy(currentPalette, 'color')
      , compareColorGroups = _.groupBy(comparePalette, 'color')
      , currentQualifying = _.maxBy(_.values(currentColorGroups), groupRank)
      , compareQualifying = _.maxBy(_.values(compareColorGroups), groupRank);

    return decide(currentQualifying, compareQualifying);
  },

  /**
   * Most of One Number Wins
   *
   * @param currentPalette
   * @param comparePalette
   * @returns {boolean}
   */
  orange: (currentPalette, comparePalette) => {
    let currentValueGroups = _.groupBy(currentPalette, 'value')
      , compareValueGroups = _.groupBy(comparePalette, 'value')
      , currentQualifying = _.maxBy(_.values(currentValueGroups), groupRank)
      , compareQualifying = _.maxBy(_.values(compareValueGroups), groupRank);

    return decide(currentQualifying, compareQualifying);
  },

  /**
   * Highest Card Wins
   *
   * @param currentPalette
   * @param comparePalette
   * @returns {boolean}
   */
  red: (currentPalette, comparePalette) => {
    let currentHighest = getHighestCard(currentPalette)
      , compareHighest = getHighestCard(comparePalette);

    return currentHighest === getHighestCard([currentHighest, compareHighest]);
  }
};

function groupRank (group) {
  return (cardProperties.colorRank.indexOf(group[0].color) * 7) + group.length;
}

/**
 * Gets the highest card first by value then by color rank
 *
 * @param cards
 * @returns {Card | {}}
 */
function getHighestCard (cards) {
  let sortedCards = _.sortBy(cards, 'rank');

  return sortedCards[sortedCards.length - 1];
}

/**
 * Gets longest stretch of consecutive cards favoring highest card where there are dupe values
 *
 * @param cards
 */
function getConsecutive(cards) {
  let sortedCards = _.sortBy(cards, 'rank')
    , cardsToRemove = []
    , currentChain = []
    , longestChain = [];


  // dedupe based on value
  _.forEach(sortedCards, (card, index) => {
    if (index > 0 && card.value === sortedCards[index - 1].value) {
      cardsToRemove.push(index - 1);
    }
  });
  _.pullAt(sortedCards, cardsToRemove);


  // assemble chains and pick the longest
  _.forEach(sortedCards, (card, index) => {
    if (index === 0 || card.value === sortedCards[index - 1].value - 1) {
      currentChain.push(card);
    } else {
      // this chain finished, save it off and start over
      if (currentChain.length >= longestChain.length) {
        longestChain = currentChain;
      }
      currentChain = [card];
    }
  });

  // if the current chain ended in a 7 it would've never been saved to 'longestChain' above
  if (currentChain.length >= longestChain.length) {
    longestChain = currentChain;
  }

  return longestChain;
}

/**
 * Compares lists of qualifying cards or falls back to using the highest card of the qualifying sets.
 *
 * @param currentQualifying
 * @param compareQualifying
 * @returns {boolean}
 */
function decide (currentQualifying, compareQualifying) {
  if (currentQualifying.length > compareQualifying.length) { // win
    return true;
  } else if (currentQualifying.length < compareQualifying.length) { // lose
    return false;
  } else { // tie, find highest card
    let currentQualifyingHighest = getHighestCard(currentQualifying)
      , compareQualifyingHighest = getHighestCard(compareQualifying);

    return currentQualifyingHighest === getHighestCard([currentQualifyingHighest, compareQualifyingHighest]);
  }
}

module.exports = cardRules;