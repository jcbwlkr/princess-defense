var game = require('../game'),
  Phaser = require('phaser').Phaser;

var player,
    alien,
    eris,
    floor,
    floorPosition,
    cursor,
    fireButton
;

function loadAssets() {
  game.load.image('background', 'assets/tilesets/background.png');
  game.load.image('player', 'assets/stick-figure.png');
  game.load.image('alien', 'assets/alien.png');
  game.load.image('ogre', 'assets/ogre.png');
  game.load.image('scary-eris', 'assets/scary-eris.png');
  game.load.image('fireball', 'assets/fireball.png');
  game.load.image('btn-restart', 'assets/btn-restart.png');
}

function createBootState() {
  game.add.tileSprite(0, 0, game.world.height, game.world.width, 'background');

  floorPosition = game.world.height - 60;

  cursor = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  game.stage.backgroundColor = '#3498db';
  game.physics.startSystem(Phaser.Physics.ARCADE);

  createPlayer();

  // Make an invisible sprite that starts 800 pixels off the left of the world
  // and extends to 800 pixels off the right. It floats 60 pixels off the
  // bottom. This serves as the floor of the level.
  floor = game.add.sprite(-800, floorPosition);
  floor.scale.x = game.world.width + 1600;
  game.physics.arcade.enable(floor);
  floor.body.immovable = true;

  alien = game.add.sprite(-200, floorPosition, 'alien');
  game.physics.arcade.enable(alien);
  alien.body.gravity.y = 500;
  alien.body.velocity.x = 50;
  alien.anchor.set(0.5, 1.0);

  eris = game.add.sprite(game.world.width / 2, -100, 'scary-eris');
  game.physics.arcade.enable(eris);
  eris.body.gravity.y = 50;
  eris.body.velocity.y = 50;
  eris.anchor.set(0.5, 1.0);

  var btn = game.add.button(0, 0, 'btn-restart', function() { game.state.start('boot'); });
}

function createPlayer() {
  var sp = game.add.sprite(game.world.centerX, floorPosition, 'player') 
  game.physics.arcade.enable(sp);
  sp.body.gravity.y = 500;
  sp.anchor.set(0.5, 1.0);

  var bullets = game.add.group()
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(50, 'fireball');
  bullets.setAll('checkWorldBounds', true);
  bullets.setAll('outOfBoundsKill', true);

  var fireRate = 400, // Higher is less frequent
      fireSpeed = 400, // Higher is faster bullets
      nextFire = 0,
      facing = 'left';

  var fire = function() {
    if (game.time.now > nextFire && bullets.countDead() > 0) {
      nextFire = game.time.now + fireRate;
      var bullet = bullets.getFirstDead();
      bullet.reset(sp.x, sp.y - 64);
      bullet.body.velocity.x = (facing === 'left' ? -fireSpeed : fireSpeed);
    }
  };

  player = {
    sprite: sp,
    turnLeft: function() { facing = 'left'; },
    turnRight: function() { facing = 'right'; },
    fire: fire,
    bullets: bullets,
  }
}

function movePlayer() {
  // If the left arrow key is pressed
  if (cursor.left.isDown) {
    // Move the player to the left
    player.sprite.body.velocity.x = -200;
    player.turnLeft();
  }

  // If the right arrow key is pressed
  else if (cursor.right.isDown) {
    // Move the player to the right
    player.sprite.body.velocity.x = 200;
    player.turnRight();
  }

  // If neither the right or left arrow key is pressed
  else {
    // Stop the player
    player.sprite.body.velocity.x = 0;
  }

  // If the up arrow key is pressed and the player is touching the ground
  if (cursor.up.isDown && player.sprite.body.touching.down) {
    // Move the player upward (jump)
    player.sprite.body.velocity.y = -320;
  }

  if (fireButton.isDown) {
    player.fire();
  }
}

function updateBootState() {
  game.physics.arcade.collide(player.sprite, floor);
  game.physics.arcade.collide(alien, floor);
  game.physics.arcade.collide(player.sprite, alien);
  game.physics.arcade.collide(player.bullets, alien);

  movePlayer();
}

var boot = {
  preload: loadAssets,
  create: createBootState,
  update: updateBootState
};

module.exports = boot;
