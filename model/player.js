/**
 * Created by jnornhold on 11/16/16.
 */
'use strict';

const _ = require('lodash');
const cardProperties = require('./card').properties;


class Player {
  constructor (playerName) {
    this.name = playerName;
    this._sortPreference = 'color';
    this.resetCardSets();
  }

  /**
   * Sets up a function for order by for hand and palette sort order
   *
   * @returns {*}
   * @private
   */
  _getOrderBy() {
    let colorValue = [(c) => cardProperties.colorRank.indexOf(c.color), 'value'];
    return this._sortPreference === 'color' ? colorValue : _.reverse(colorValue);
  }

  sortCardSets() {
    let orderBy = this._getOrderBy();
    this.hand = _.orderBy(this.hand, orderBy);
    this.palette = _.orderBy(this.palette, orderBy);
  }

  resetCardSets() {
    this.hand = [];
    this.palette = [];
  }

  setSortPreference(preference) {
    this._sortPreference = preference;
    this.sortCardSets();
  }

  handToString() {
    return _.map(this.hand, (c)=>c.toString()).join('\n');
  }

  handToAttachments() {
    return _.map(this.hand, (c)=>c.toAttachment());
  }

  paletteToString() {
    return _.map(this.palette, (c)=>c.toString()).join('\n');
  }

  paletteToAttachments() {
    return _.map(this.palette, (c)=>c.toAttachment());
  }

  addCardToHand(card) {
    this.hand.push(card);
  }

  addCardToPalette(card) {
    this.palette.push(card);
    this.sortCardSets();
  }

  playCard(cardIndex) {
    return _.pullAt(this.hand, cardIndex);
  }
}

module.exports = Player;