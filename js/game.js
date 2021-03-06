BasicGame.Game = function(game) {
  this.DEBUG_MODE = false;
  this.PLAYER_ACCELERATION = 400;
  this.PLAYER_VELOCITY = 232;
  this.PLAYER_WALK_SPEED = 10.5;
  this.editing = false;
  this.editor = GameEditor;
  this.level = Level;
  this.dialogTimer = 0;
  this.dialogShowing = false;
  this.completed = false;
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

    // Sfx
    this.sfx = {
      door: this.add.audio('door'),
      edit: this.add.audio('edit', 0.2),
      complete: this.add.audio('complete'),
      pickup: this.add.audio('pickup')
    };

    // Player
    this.player = this.game.add.sprite(this.level.playerStart.x, this.level.playerStart.y, 'player');
    this.player.frame = 1;
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.collideWorldBounds = true;
    this.game.camera.follow(this.player);

    this.player.data = {};
    this.player.data.moving = false;
    this.player.animations.add('walk-down', [0, 4, 8, 0], this.PLAYER_WALK_SPEED, false);
    this.player.animations.add('walk-up', [1, 5, 9, 1], this.PLAYER_WALK_SPEED, false);
    this.player.animations.add('walk-right', [2, 6, 2, 10, 2], 12, false);
    this.player.animations.add('walk-left', [3, 7, 3, 11, 3], 12, false);

    // Scaling
    this.scale.setupScale(1280, 720);
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.refresh();

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.escapeKey = this.input.keyboard.addKey(Phaser.Keyboard.ESC);

    // Variaballs
    this.variaballs = this.add.group();

    // Level
    this.objects = this.add.group();
    this.level.initialize(this);
    // Give brython access to the level object so it can call its functions
    window.level = this.level;

    // Put this down here so upper layer assets overlap the previous sprites.
    this.upperLayer = this.map.createLayer(1);
    this.map.setCollisionByExclusion([33, 34, 35, 44, 45], true, this.upperLayer);
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
    this.physics.arcade.collide(this.player, this.variaballs, this.collectVariable.bind(this));
    this.scrollBackground();
    this.movePlayer();
    this.updateEditMode();
    this.level.update();
    this.checkGoal();
  },

  scrollBackground: function() {
    this.background.tilePosition.x -= 0.75;
  },

  playerCollide: function() {
    this.player.data.moving = false;
  },

  checkGoal: function() {
    var currentTile = this.map.getTileWorldXY(this.player.body.x, this.player.body.y);
    if (currentTile === null) {
      return;
    }
    var onGoalTile = currentTile.properties.goal === '1';
    if (onGoalTile && this.completed === false) {
      $('#overview').slideDown();
      this.sfx.complete.play();
      this.completed = true;
    }
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
        this.sfx.edit.play();
        this.editor.show(currentTile.x, currentTile.y);
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
      this.player.animations.stop();
      this.player.frame = {
        down: 0,
        up: 1,
        right: 2,
        left: 3
      }[this.player.data.facing];
      if (this.cursors.left.isDown) {
        this.player.frame = 3;
        this.player.animations.play('walk-left');
        this.player.data.next = { x: this.player.body.x - 64, y: this.player.body.y };
        this.player.body.velocity.x = -this.PLAYER_VELOCITY;
        delta = 'left';
      } else if (this.cursors.right.isDown) {
        this.player.frame = 2;
        this.player.animations.play('walk-right');
        this.player.data.next = { x: this.player.body.x + 64, y: this.player.body.y };
        this.player.body.velocity.x = this.PLAYER_VELOCITY;
        delta = 'right';
      } else if (this.cursors.down.isDown) {
        this.player.frame = 0;
        this.player.animations.play('walk-down');
        this.player.data.next = { x: this.player.body.x, y: this.player.body.y + 64 };
        this.player.body.velocity.y = this.PLAYER_VELOCITY;
        delta = 'down';
      } else if (this.cursors.up.isDown) {
        this.player.frame = 1;
        this.player.animations.play('walk-up');
        this.player.data.next = { x: this.player.body.x, y: this.player.body.y - 64 };
        this.player.body.velocity.y = -this.PLAYER_VELOCITY;
        delta = 'up';
      }
    }
    if (delta !== null && this.player.data.moving === false) {
      this.player.data.facing = delta;
      this.player.data.moving = true;
      if (this.dialogShowing === true) {
        this.time.events.add(this.dialogTimer - this.game.time.now, this.hideDialog, this);
      }
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

  collectVariable: function(player, variaball) {
    var variables = this.level.variables;
    var newVariable = variaball.variable;
    var scriptId = newVariable.script;
    if (variables[scriptId] === undefined) {
      variables[scriptId] = [];
    }
    variables[scriptId].push(newVariable.name);
    variaball.kill();
    this.sfx.pickup.play();
    this.showDialog("New variable obtained: \"" + newVariable.name + "\"");
  },

  showDialog: function(text) {
    $('#dialog').text(text);
    $('#dialog').slideDown();
    this.dialogTimer = this.time.now + 1200;
    this.dialogShowing = true;
  },

  hideDialog: function() {
    $('#dialog').text("");
    $('#dialog').slideUp();
    this.dialogShowing = false;
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
