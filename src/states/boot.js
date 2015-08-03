var game = require('../game'),
  Phaser = require('phaser').Phaser;

var player,
    alien,
    floor,
    cursor;

function loadAssets() {
  game.load.image('player', 'assets/stick-figure.png');
  game.load.image('alien', 'assets/alien.png');
  game.load.image('floor', 'assets/floor.png');
}

function createBootState() {
  cursor = game.input.keyboard.createCursorKeys();

  game.stage.backgroundColor = '#3498db';
  game.physics.startSystem(Phaser.Physics.ARCADE);

  floor = game.add.sprite(0, game.world._height - 20, 'floor');
  game.physics.arcade.enable(floor);
  floor.body.immovable = true;

  player = game.add.sprite(game.world.centerX, game.world._height - 20 - 128, 'player');
  alien = game.add.sprite(200, game.world._height - 20 - 128, 'alien');

  // Add vertical gravity to the player
  [player,alien].forEach(function(thing) {
    game.physics.arcade.enable(thing);
    thing.body.gravity.y = 500;
  });
}

function movePlayer() {
  // If the left arrow key is pressed
  if (cursor.left.isDown) {
    // Move the player to the left
    player.body.velocity.x = -200;
  }

  // If the right arrow key is pressed
  else if (cursor.right.isDown) {
    // Move the player to the right
    player.body.velocity.x = 200;
  }

  // If neither the right or left arrow key is pressed
  else {
    // Stop the player
    player.body.velocity.x = 0;
  }

  // If the up arrow key is pressed and the player is touching the ground
  if (cursor.up.isDown && player.body.touching.down) {
    // Move the player upward (jump)
    player.body.velocity.y = -320;
  }
}

function updateBootState() {
  game.physics.arcade.collide(player, floor);
  game.physics.arcade.collide(alien, floor);
  game.physics.arcade.collide(player, alien);

  movePlayer();
}

var boot = {
  preload: loadAssets,
  create: createBootState,
  update: updateBootState
};

module.exports = boot;
