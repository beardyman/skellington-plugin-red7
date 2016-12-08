/**
 * Created by jnornhold on 11/30/16.
 */
"use strict";

describe('Deck', () => {
  require('test/testUtils/suiteBootstrap')(global);

  let Deck = require('model/deck')
    , deck;

  describe('deal card', () => {
    beforeEach(() => {
      deck = new Deck(1);
    });

    it('should deal a 1', () => {
      expect(deck.dealCard().value).to.equal(1);
      expect(deck.cards.length).to.equal(6);
    });

  });
});