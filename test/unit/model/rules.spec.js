/**
 * Created by jnornhold on 11/30/16.
 */
"use strict";

describe('rules', () => {
  require('test/testUtils/suiteBootstrap')(global);

  let Card = require('model/card')
    , rules
    , deck
    , emptyPalette = []
    , noQualifying
    , palette1
    , palette2;


  beforeEach(() => {
    const Rules = require('model/rules');
    deck = {
      cardsPerSuit: 7
    };

    rules = new Rules(deck);
  });


  describe('violet - most cards below 4', ()=> {
    beforeEach(() => {
      palette1 = [
        new Card('red', 1, deck.cardsPerSuit),
        new Card('blue', 1, deck.cardsPerSuit)
      ];

      palette2 = [
        new Card('red', 7, deck.cardsPerSuit),
        new Card('green', 1, deck.cardsPerSuit)
      ];

      noQualifying = [
        new Card('red', 5, deck.cardsPerSuit)
      ];
    });

    it('should win against an empty palette', () => {
      expect(rules.violet(palette1, emptyPalette)).to.equal(true);
    });

    it('should win when it has more', () => {
      expect(rules.violet(palette1, palette2)).to.equal(true);
    });

    it('should lose when it has less', () => {
      expect(rules.violet(palette2, palette1)).to.equal(false);
    });

    it('should lose when it has no qualifying cards', () => {
      expect(rules.violet(noQualifying, palette1)).to.equal(false);
    });

    it('should lose when it has no qualifying cards even against an empty palette', () => {
      expect(rules.violet(noQualifying, emptyPalette)).to.equal(false);
    });

    it('should win based on color', () => {
      // green 1 vs a blue 1
      expect(rules.violet(palette2, [palette1[1]])).to.equal(true);
    });
  });

  describe.skip('indigo - Most Cards in a Row Wins', ()=> {
    beforeEach(() => {
      palette1 = [
        new Card('red', 1, deck.cardsPerSuit),
        new Card('blue', 2, deck.cardsPerSuit)
      ];

      palette2 = [
        new Card('red', 7, deck.cardsPerSuit),
        new Card('green', 1, deck.cardsPerSuit)
      ];

      noQualifying = [
        new Card('red', 5, deck.cardsPerSuit)
      ];
    });

    it('should win against an empty palette', () => {
      expect(rules.indigo(palette1, emptyPalette)).to.equal(true);
    });

    it('should win when it has more', () => {
      expect(rules.indigo(palette1, palette2)).to.equal(true);
    });

    it('should lose when it has less', () => {
      expect(rules.indigo(palette2, palette1)).to.equal(false);
    });

    it('should lose when it has no qualifying cards', () => {
      expect(rules.indigo(noQualifying, palette1)).to.equal(false);
    });

    it('should lose when it has no qualifying cards even against an empty palette', () => {
      expect(rules.indigo(noQualifying, emptyPalette)).to.equal(false);
    });

    it('should win based on color', () => {
      // green 1 vs a blue 1
      expect(rules.indigo(palette2, [palette1[1]])).to.equal(true);
    });
  });

  describe('blue - Most Different Colors Wins', ()=> {
    beforeEach(() => {
      palette1 = [
        new Card('indigo', 1, deck.cardsPerSuit),
        new Card('blue', 1, deck.cardsPerSuit)
      ];

      palette2 = [
        new Card('red', 7, deck.cardsPerSuit),
        new Card('red', 1, deck.cardsPerSuit)
      ];

    });

    it('should win against an empty palette', () => {
      expect(rules.blue(palette1, emptyPalette)).to.equal(true);
    });

    it('should win when it has more', () => {
      expect(rules.blue(palette1, palette2)).to.equal(true);
    });

    it('should lose when it has less', () => {
      expect(rules.blue(palette2, palette1)).to.equal(false);
    });

    it('should win based on color', () => {
      // green 1 vs a blue 1
      expect(rules.blue(palette2, [palette1[1]])).to.equal(true);
    });
  });

  describe('green - Most Even Cards Wins', ()=> {
    beforeEach(() => {
      palette1 = [
        new Card('red', 2, deck.cardsPerSuit),
        new Card('blue', 4, deck.cardsPerSuit)
      ];

      palette2 = [
        new Card('red', 6, deck.cardsPerSuit),
        new Card('green', 1, deck.cardsPerSuit)
      ];

      noQualifying = [
        new Card('red', 5, deck.cardsPerSuit)
      ];
    });

    it('should win against an empty palette', () => {
      expect(rules.green(palette1, emptyPalette)).to.equal(true);
    });

    it('should win when it has more', () => {
      expect(rules.green(palette1, palette2)).to.equal(true);
    });

    it('should lose when it has less', () => {
      expect(rules.green(palette2, palette1)).to.equal(false);
    });

    it('should lose when it has no qualifying cards', () => {
      expect(rules.green(noQualifying, palette1)).to.equal(false);
    });

    it('should lose when it has no qualifying cards even against an empty palette', () => {
      expect(rules.green(noQualifying, emptyPalette)).to.equal(false);
    });

    it('should win based on color', () => {
      // green 1 vs a blue 1
      expect(rules.green(palette2, [palette1[1]])).to.equal(true);
    });
  });

  describe('yellow - Most of One Color Wins', ()=> {
    beforeEach(() => {
      palette1 = [
        new Card('blue', 2, deck.cardsPerSuit),
        new Card('blue', 4, deck.cardsPerSuit)
      ];

      palette2 = [
        new Card('red', 6, deck.cardsPerSuit),
        new Card('green', 4, deck.cardsPerSuit)
      ];
    });

    it('should win against an empty palette', () => {
      expect(rules.yellow(palette1, emptyPalette)).to.equal(true);
    });

    it('should win when it has more', () => {
      expect(rules.yellow(palette1, palette2)).to.equal(true);
    });

    it('should lose when it has less', () => {
      expect(rules.yellow(palette2, palette1)).to.equal(false);
    });

    it('should lose when it has no qualifying cards', () => {
      expect(rules.yellow(noQualifying, palette1)).to.equal(false);
    });

    it('should lose when it has no qualifying cards even against an empty palette', () => {
      expect(rules.yellow(noQualifying, emptyPalette)).to.equal(false);
    });

    it('should win based on color', () => {
      // green 4 vs a blue 4
      expect(rules.yellow(palette2, [palette1[1]])).to.equal(true);
    });
  });

});