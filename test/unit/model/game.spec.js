"use strict";

describe.only('Game', () => {
  require('test/testUtils/suiteBootstrap')(global);
  let Stubber = require('test/testUtils/stubber')
    , Card = require('model/card')
    , Game
    , game
    , roomsMock
    , PlayerMock
    , player1
    , player2
    , player3;

  beforeEach(() => {
    let stubber = new Stubber()
      , playerList;

    stubber.stub('model/rules', './rules');
    stubber.stub('model/deck', './deck');
    roomsMock = stubber.stub('model/rooms', './rooms');
    PlayerMock = stubber.stub('model/player');
    player1 = new PlayerMock();
    player2 = new PlayerMock();
    player3 = new PlayerMock();
    playerList = [player1, player2, player3];


    Game = proxyquire('model/game', stubber.proxyquire);
    game = new Game(playerList);
  });

  describe('Setup', () => {
    it('should setup the player list and a deck and a rule set', () => {
      expect(game.players.length).to.equal(3);
      expect(game.players[0]).to.equal(player1);
      expect(game.deck).to.not.equal(undefined);
      expect(game.rules).to.not.equal(undefined);
    });
  });

  describe('The Deal', () => {

    it('should deal cards to all of the players', () => {
      game.deal();

      expect(player1.addCardToHand.callCount, 'player1 hand count').to.equal(7);
      expect(player1.addCardToPalette.callCount, 'player1 palette count').to.equal(1);
      expect(player2.addCardToHand.callCount).to.equal(7);
      expect(player2.addCardToPalette.callCount).to.equal(1);
      expect(player3.addCardToHand.callCount).to.equal(7);
      expect(player3.addCardToPalette.callCount).to.equal(1);
      expect(game.deck.dealCard.callCount).to.equal(24);
    });

    describe('Who goes first', () => {
      it('should set the correct first player (player 1)', () => {
        game.rules.red.onCall(1).returns(true);

        game.deal();

        expect(game.currentPlayerIndex).to.equal(0); // should be player 1
        expect(game.currentWinnerIndex).to.equal(2); // should be player 3
      });

      it('should set the correct first player (player 2)', () => {
        game.rules.red.returns(false);

        game.deal();

        expect(game.currentPlayerIndex).to.equal(1); // should be player 2
        expect(game.currentWinnerIndex).to.equal(0); // should be player 1
      });
    });
  });

  describe('Play Turn', () => {

    beforeEach(() => {
      player1.name = 'rick';
      player2.name = 'morty';
      player3.name = 'summer';
    });

    it('should stop morty from playing a card', () => {
      game.currentPlayerIndex = 0;

      return game.playTurn('morty', 1).then(()=>{throw new Error('Yo test failed');}).catch((err)=>{
        expect(err.message).to.match(/.*not your turn silly!/);
      });
    });

    it('should stop morty from playing a card because it won\'t win', () => {
      game.currentPlayerIndex = 1;
      game.rules.red.returns(false);

      player2.hand = [{},{}];
      player2.palette = [{}];

      return game.playTurn('morty', 1).then(()=>{throw new Error('Yo test failed');}).catch((err)=>{
        expect(err.message).to.match(/That play doesn\'t work.*have to pass./);
      });
    });


    it('should let morty play a card', () => {
      game.currentPlayerIndex = 1;
      game.rules.red.returns(true);

      player2.hand = [{},{}];
      player2.palette = [{}];

      player2.playCard.returns(player2.hand[0]);

      player3.hand = [{}];

      return game.playTurn('morty', 1).then(() => {
        expect(game.currentWinnerIndex).to.equal(1);
        expect(game.currentPlayerIndex).to.equal(2);
      });
    });

    it('should let morty play a card and a rule', () => {
      game.currentPlayerIndex = 1;
      game.rules.blue.returns(true);

      player2.hand = [{color: 'blue'},{}];
      player2.palette = [{}];

      player2.playCard.returns(player2.hand[0]);

      player3.hand = [{}];

      return game.playTurn('morty', 1, 0).then(() => {
        expect(game.currentWinnerIndex).to.equal(1);
        expect(game.currentPlayerIndex).to.equal(2);
      });
    });

    it('should boot summer since she doesn\'t have any cards left', () => {
      game.currentPlayerIndex = 1;
      game.rules.blue.returns(true);

      player2.hand = [{color: 'blue'},{}];
      player2.palette = [{}];

      player2.playCard.returns(player2.hand[0]);

      player1.hand = [{}];
      player3.hand = [];

      return game.playTurn('morty', 1, 0).then(() => {
        expect(game.currentWinnerIndex).to.equal(1);
        expect(game.currentPlayerIndex).to.equal(0);
      });
    });

    it('should boot summer and rick and declare morty the winner', () => {
      game.currentPlayerIndex = 1;
      game.rules.blue.returns(true);

      player2.hand = [{color: 'blue'}, {}];
      player2.palette = [{}];

      player2.playCard.returns(player2.hand[0]);

      player1.hand = [];
      player3.hand = [];

      return game.playTurn('morty', 1, 0).then((isThereAWinner) => {
        expect(game.currentWinnerIndex).to.equal(0);
        expect(game.currentPlayerIndex).to.equal(0);
        expect(isThereAWinner).to.equal(true);
      });
    });
  });
});