var game = require('../game'),
  Phaser = require('phaser').Phaser;

var player,
    alien,
    floor;

function loadAssets() {
  game.load.image('player', 'assets/stick-figure.png');
  game.load.image('alien', 'assets/alien.png');
  game.load.image('floor', 'assets/floor.png');
}

function createBootState() {
  game.stage.backgroundColor = '#3498db';
  game.physics.startSystem(Phaser.Physics.ARCADE);

  player = game.add.sprite(0, 0, 'player');
  alien = game.add.sprite(120, 0, 'alien');
  floor = game.add.sprite(0, game.world._height - 20, 'floor');

  // Add vertical gravity to the player
  [player,alien,floor].forEach(function(thing) {
    game.physics.arcade.enable(thing);
  });
  [player,alien].forEach(function(thing) {
    thing.body.gravity.y = 500;
  });
  floor.body.immovable = true;
}

function updateBootState() {
  game.physics.arcade.collide(player, floor);
  game.physics.arcade.collide(alien, floor);
}

var boot = {
  preload: loadAssets,
  create: createBootState,
  update: updateBootState
};

module.exports = boot;
