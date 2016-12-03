/**
 * Created by jnornhold on 11/30/16.
 */
"use strict";

describe('Deal Card', () => {
  require('test/testUtils/suiteBootstrap')(global);

  let Deck = require('model/deck')
    , deck;

  beforeEach(() => {
    deck = new Deck(1);
  });

  it('should deal a 1', () => {
    expect(deck.deal().value).to.equal(1);
    expect(deck.cards.length).to.equal(6);
  });

});