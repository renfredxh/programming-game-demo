BasicGame.Game = function(game) {
  this.DEBUG_MODE = false;
  this.PLAYER_ACCELERATION = 400;
  this.editing = false;
};

BasicGame.Game.prototype = {

  create: function() {
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
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // Debug
    this.debug = new Phaser.Utils.Debug(window.game);
    this.debug.context = this.game.context;
  },

  update: function() {
    this.movePlayer();
    if (this.spacebar.isDown && this.editing === false) {
      this.editing = true;
      GameEditor.show();
    }
  },

  movePlayer: function() {
    var delta = null;
    var blocked = this.player.body.blocked;
    if (this.cursors.left.isDown && blocked.left !== true) {
      delta = {x: this.player.body.x - 64};
    } else if (this.cursors.right.isDown && blocked.right !== true) {
      delta = {x: this.player.body.x + 64};
    } else if (this.cursors.down.isDown && blocked.down !== true) {
      delta = {y: this.player.body.y + 64};
    } else if (this.cursors.up.isDown && blocked.up !== true) {
      delta = {y: this.player.body.y - 64};
    }
    if (delta !== null && this.player.data.moving === false) {
      this.player.data.moving = true;
      move = this.add.tween(this.player);
      move.to(delta, 200, Phaser.Easing.Linear.None);
      move.onComplete.addOnce(function() {
        this.player.data.moving = false;
      }, this);
      move.start();
    }
  },

  quitGame: function(pointer) {
    this.state.start('Game');
  },

  render: function() {
    if (this.DEBUG_MODE === true) {
      this.debug.body(this.player);
      this.debug.bodyInfo(this.player, 16, 24);
    }
  }
};
