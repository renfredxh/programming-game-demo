BasicGame.Game = function (game) {
  this.game;
  this.add;
  this.camera;
  this.cache;
  this.input;
  this.load;
  this.math;
  this.sound;
  this.stage;
  this.time;
  this.tweens;
  this.state;
  this.world;
  this.particles;
  this.physics;
  this.rnd;

  this.PLAYER_ACCELERATION = 400;
};

BasicGame.Game.prototype = {

  create: function () {
    // Map
    this.map = this.add.tilemap('demoLevel');
    this.map.addTilesetImage('tiles');
    this.map.setCollisionByExclusion([]);
    this.layer = this.map.createLayer(0);
    this.layer.resizeWorld();

    // Player
    this.player = this.game.add.sprite(0, 0, 'player');
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.collideWorldBounds = true;
    this.game.camera.follow(this.player);

    this.player.data = {};
    this.player.data.moving = false;

    // Scaling
    this.scale.setupScale(1280, 720);
    this.scale.refresh();
    //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    // Controls
    this.cursors = this.game.input.keyboard.createCursorKeys();
  },

  update: function () {
    this.movePlayer();
  },

  movePlayer: function() {
    var delta = null;
    if (this.cursors.left.isDown) {
      delta = {x: this.player.body.x - 64};
    } else if (this.cursors.right.isDown) {
      delta = {x: this.player.body.x + 64};
    } else if (this.cursors.down.isDown) {
      delta = {y: this.player.body.y + 64};
    } else if (this.cursors.up.isDown) {
      delta = {y: this.player.body.y - 64};
    }
    if (delta !== null && this.player.data.moving === false) {
      this.player.data.moving = true;
      move = this.add.tween(this.player);
      move.to(delta, 200, Phaser.Easing.Linear.None)
      move.onComplete.addOnce(function() {
        this.player.data.moving = false;
      }, this);
      move.start();
    }
  },

  quitGame: function (pointer) {
    this.state.start('Game');
  }
};
