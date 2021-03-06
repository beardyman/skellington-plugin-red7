/**
 * Created by jnornhold on 11/16/16.
 */
'use strict';

const _ = require('lodash');
const cardProperties = require('./card').properties;

class ruleSet {

  constructor (deck) {
    this.deck = deck;
  }


  /**
   * Most Cards Below 4 Wins
   *
   * @param currentPalette
   * @param comparePalette
   * @returns {boolean}
   */
  violet(currentPalette, comparePalette) {
    let currentQualifying = _.groupBy(currentPalette, (c) => c.value < 4).true || []
      , compareQualifying = _.groupBy(comparePalette, (c) => c.value < 4).true || [];

    return this.decide(currentQualifying, compareQualifying);
  }

  /**
   * Most Cards in a Row Wins
   *
   * @param currentPalette
   * @param comparePalette
   * @returns {boolean}
   */
  indigo(currentPalette, comparePalette) {
    let currentQualifying = getConsecutive(currentPalette) || []
      , compareQualifying = getConsecutive(comparePalette) || [];

    return this.decide(currentQualifying, compareQualifying);
  }

  /**
   * Most Different Colors Wins
   *
   * @param currentPalette
   * @param comparePalette
   * @returns {boolean}
   */
  blue (currentPalette, comparePalette) {
    let currentColorGroups = _.groupBy(currentPalette, 'color') || {}
      , compareColorGroups = _.groupBy(comparePalette, 'color') || {}
      , currentQualifying = _.map(currentColorGroups, (colorGroup) => ruleSet.getHighestCard(colorGroup))
      , compareQualifying = _.map(compareColorGroups, (colorGroup) => ruleSet.getHighestCard(colorGroup));

    return this.decide(currentQualifying, compareQualifying);
  }

  /**
   * Most Even Cards Wins
   *
   * @param currentPalette
   * @param comparePalette
   * @returns {boolean}
   */
  green (currentPalette, comparePalette) {
    let currentQualifying = _.groupBy(currentPalette, (c) => c.value % 2)['0'] || []
      , compareQualifying = _.groupBy(comparePalette, (c) => c.value % 2)['0'] || [];

    return this.decide(currentQualifying, compareQualifying);
  }

  /**
   * Most of One Color Wins
   *
   * @param currentPalette
   * @param comparePalette
   * @returns {boolean}
   */
  yellow(currentPalette, comparePalette) {
    let currentColorGroups = _.groupBy(currentPalette, 'color') || {}
      , compareColorGroups = _.groupBy(comparePalette, 'color') || {}
      , currentQualifying = _.maxBy(_.values(currentColorGroups), this.rankColorGroup.bind(this)) || []
      , compareQualifying = _.maxBy(_.values(compareColorGroups), this.rankColorGroup.bind(this)) || [];

    return this.decide(currentQualifying, compareQualifying);
  }

  /**
   * Most of One Number Wins
   *
   * @param currentPalette
   * @param comparePalette
   * @returns {boolean}
   */
  orange(currentPalette, comparePalette) {
    let currentValueGroups = _.groupBy(currentPalette, 'value') || {}
      , compareValueGroups = _.groupBy(comparePalette, 'value') || {}
      , currentQualifying = _.maxBy(_.values(currentValueGroups), this.rankNumberGroup.bind(this)) || []
      , compareQualifying = _.maxBy(_.values(compareValueGroups), this.rankNumberGroup.bind(this)) || [];

    return this.decide(currentQualifying, compareQualifying);
  }

  /**
   * Highest Card Wins
   *
   * @param currentPalette
   * @param comparePalette
   * @returns {boolean}
   */
  red(currentPalette, comparePalette) {
    if (currentPalette.length > 0) {
      if (comparePalette.length === 0) {
        return true;
      }
      let currentHighest = ruleSet.getHighestCard(currentPalette)
        , compareHighest = ruleSet.getHighestCard(comparePalette);

      return currentHighest.rank === ruleSet.getHighestCard([currentHighest, compareHighest]).rank;
    } else {
      return false;
    }
  }

  /**
   * Gives a value to a group of cards based on the number of cards in the group then by color
   *
   * @param group
   * @returns {*}
   */
  rankColorGroup(group) {
    return (group.length * this.deck.cardsPerSuit) + cardProperties.colorRank.indexOf(ruleSet.getHighestCard(group).color);
  }

  rankNumberGroup(group) {
    return (group.length * cardProperties.colorRank.length) + _.get(group, '[0].value') || 0;
  }


  /**
   * Gets the highest card first by value then by color rank
   *
   * @param cards
   * @returns {Card | {}}
   */
  static getHighestCard(cards) {
    let sortedCards = _.sortBy(cards, 'rank');

    return sortedCards[sortedCards.length - 1];
  }


  /**
   * Compares lists of qualifying cards or falls back to using the highest card of the qualifying sets.
   *
   * @param currentQualifying
   * @param compareQualifying
   * @returns {boolean}
   */
  decide (currentQualifying, compareQualifying) {
    if (currentQualifying.length === 0) { // you can never win if you don't have qualifying card. // lose
      return false;
    } else if (currentQualifying.length > compareQualifying.length) { // win
      return true;
    } else if (currentQualifying.length < compareQualifying.length) { // lose
      return false;
    } else { // tie, find highest card / also known as the red rule
      return this.red(currentQualifying, compareQualifying);
    }
  }
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
    if (index === 0 || card.value === sortedCards[index - 1].value + 1) {
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

module.exports = ruleSet;