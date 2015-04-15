BasicGame.Game = function(game) {
  this.DEBUG_MODE = false;
  this.PLAYER_ACCELERATION = 400;
  this.PLAYER_VELOCITY = 256;
  this.editing = false;
  this.editor = GameEditor;
  this.level = Level;
};

BasicGame.Game.prototype = {

  create: function() {
    // Background
    this.background = this.add.tileSprite(0, 0, Util.fromTile(100), Util.fromTile(100), 'hexground');

    // Map
    this.map = this.add.tilemap(this.level.tileMap);
    this.map.addTilesetImage('tiles');
    this.lowerLayer = this.map.createLayer(0);
    this.lowerLayer.resizeWorld();

    // Player
    this.player = this.game.add.sprite(this.level.playerStart.x, this.level.playerStart.y, 'player');
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.collideWorldBounds = true;
    this.game.camera.follow(this.player);

    this.player.data = {};
    this.player.data.moving = false;

    // Scaling
    this.scale.setupScale(1280, 720);
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.refresh();

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.escapeKey = this.input.keyboard.addKey(Phaser.Keyboard.ESC);

    // Level
    this.objects = this.add.group();
    this.level.initialize(this);
    // Give brython access to the level object so it can call its functions
    window.level = this.level;

    // Put this down here so upper layer assets overlap the previous sprites.
    this.upperLayer = this.map.createLayer(1);
    this.map.setCollisionByExclusion([11], true, this.upperLayer);
    this.upperLayer.resizeWorld();

    // Editor
    this.editReady = true;
    this.editKeyTimer = this.time.now;

    // Debug
    this.debug = new Phaser.Utils.Debug(window.game);
    this.debug.context = this.game.context;
  },

  update: function() {
    this.physics.arcade.collide(this.player, this.upperLayer, this.playerCollide.bind(this));
    this.physics.arcade.collide(this.player, this.objects, this.playerCollide.bind(this));
    this.scrollBackground();
    this.movePlayer();
    this.updateEditMode();
    this.level.update();
  },

  scrollBackground: function() {
    this.background.tilePosition.x -= 0.75;
  },

  playerCollide: function() {
    this.player.data.moving = false;
  },

  updateEditMode: function() {
    var currentTile = this.map.getTileWorldXY(this.player.body.x, this.player.body.y);
    if (currentTile === null) {
      return;
    }
    var onEditorTile = currentTile.properties.editor === '1';
    if (this.escapeKey.isDown && this.time.now > this.editKeyTimer) {
      this.editing = false;
      this.editor.hide();
      this.editReady = false;
      this.editKeyTimer = this.time.now + 500;
    }
    if (onEditorTile) {
      if (this.editing === false && this.editReady === true) {
        this.editing = true;
        this.editor.show();
        this.editReady = false;
      }
    } else {
      this.editing = false;
      this.editor.hide();
    }
  },

  movePlayer: function() {
    var delta = null;
    var blocked = this.player.body.blocked;
    if (this.player.body.onWall()) {
      this.playerCollide();
    }
    if (this.player.data.moving === false) {
      if (this.cursors.left.isDown) {
        this.player.data.next = { x: this.player.body.x - 64, y: this.player.body.y };
        this.player.body.velocity.x = -this.PLAYER_VELOCITY;
        delta = 'left';
      } else if (this.cursors.right.isDown) {
        this.player.data.next = { x: this.player.body.x + 64, y: this.player.body.y };
        this.player.body.velocity.x = this.PLAYER_VELOCITY;
        delta = 'right';
      } else if (this.cursors.down.isDown) {
        this.player.data.next = { x: this.player.body.x, y: this.player.body.y + 64 };
        this.player.body.velocity.y = this.PLAYER_VELOCITY;
        delta = 'down';
      } else if (this.cursors.up.isDown) {
        this.player.data.next = { x: this.player.body.x, y: this.player.body.y - 64 };
        this.player.body.velocity.y = -this.PLAYER_VELOCITY;
        delta = 'up';
      }
    }
    if (delta !== null && this.player.data.moving === false) {
      this.player.data.facing = delta;
      this.player.data.moving = true;
    }
    if (this.player.data.moving === true) {
      if ({
        up: this.player.body.y <= this.player.data.next.y,
        down: this.player.body.y >= this.player.data.next.y,
        left: this.player.body.x <= this.player.data.next.x,
        right: this.player.body.x >= this.player.data.next.x,
      }[this.player.data.facing]) {
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.player.body.x = this.player.data.next.x;
        this.player.body.y = this.player.data.next.y;
        this.player.data.moving = false;
        this.editReady = true;
      }
    }
  },

  quitGame: function(pointer) {
    this.state.start('Game');
  },

  render: function() {
    if (this.DEBUG_MODE === true) {
      this.upperLayer.debug = true;
      this.debug.body(this.player);
      this.debug.body(this.blocks.getAt(0));
      this.debug.bodyInfo(this.player, 16, 24);
    }
  }
};
