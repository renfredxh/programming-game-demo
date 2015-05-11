LevelObjectCollection = function(collection) {
  this.collection = collection;
};

LevelObjectCollection.prototype.get = function(id) {
  return this.collection[id];
};

Level = {
  name: "Demo",
  //playerStart: { x: Util.fromTile(31), y: Util.fromTile(91) },
  playerStart: { x: Util.fromTile(38), y: Util.fromTile(82) },
  tileMap: 'demoLevel',
  scriptDataset: {
    '31,88': {
      level: "level-2.py",
      player: "demo-2.py",
      autocomplete: [
        { caption: 'door', value: 'door'},
        { caption: 'open()', value: 'open()', meta: 'method', className: 'door' },
        { caption: 'close()', value: 'close()', meta: 'method', className: 'door' },
      ]
    },
    '27,81': {
      level: "level-3.py",
      player: "demo-3.py",
      autocomplete: [
        { caption: 'door', value: 'door'},
        { caption: 'open(password)', value: 'open(', meta: 'method', className: 'door' },
        { caption: 'close()', value: 'close()', meta: 'method', className: 'door' },
      ]
    },
    '36,74': {
      level: "level-4.py",
      player: "demo-4.py",
      autocomplete: [
        { caption: "'left'", value: "left'"},
        { caption: "'right'", value: "right'"},
        { caption: "'up'", value: "up'"},
        { caption: "'down'", value: "down'"},
        { caption: 'move(direction, distance)', value: 'move(', meta: 'method', className: 'block' },
      ]
    },
    '22,74': {
      level: "level-5.py",
      player: "demo-5.py",
      autocomplete: [
        { caption: 'open(key)', value: 'open(', meta: 'method', className: 'door' },
      ]
    },
  },
  initialize: function(game) {
    this.game = game;
    this.game.blocks = this.game.add.group();
    this.variables = {};
    this.blocks = new LevelObjectCollection({
      1: new this.Block('black', 2, 2),
      2: new this.Block('black', 9, 2),
      3: new this.Block('black', 2, 6),
      4: new this.Block('black', 9, 6)
    });
    this.doors = new LevelObjectCollection({
      1: new this.Door(31, 84),
      2: new this.Door(27, 77),
      3: new this.Door(36, 67),
      4: new this.Door(22, 70)
    });
    this.largeBlocks = new LevelObjectCollection({
      1: new this.LargeBlock(40, 71),
    });
    new this.Variaball(41, 81, { script: '27,81', name: 'password' });
    new this.Variaball(36, 65, { script: '22,74', name: 'key' });
  },
  update: function() {
    this.game.physics.arcade.collide(this.game.player, this.game.blocks);
  },
  // Level objects
  Block: function(color, x, y) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.moveTween = null;
    this.sprite = Level.game.blocks.create(Util.fromTile(x), Util.fromTile(y), 'block');
    Level.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = true;
    this.update();
  },
  LargeBlock: function(x, y) {
    this.x = x;
    this.y = y;
    this.moveTween = null;
    this.sprite = Level.game.objects.create(Util.fromTile(x), Util.fromTile(y), 'large-block');
    this.sprite.frame = 0;
    Level.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = true;
  },
  Door: function(x, y) {
    this.x = x;
    this.is_open = false;
    this.moveTween = null;
    this.sprite = Level.game.objects.create(Util.fromTile(x), Util.fromTile(y), 'door');
    Level.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = true;
    this.sprite.frame = 0;
    this.sprite.animations.add('default', [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4], 11, true);
    this.sprite.animations.add('open', [0, 0, 5, 5, 0, 0, 5, 0, 5, 0, 5], 25, false);
    this.sprite.animations.play('default');
  },
  Variaball: function(x, y, variable) {
    this.sprite = Level.game.variaballs.create(Util.fromTile(x + 0.5), Util.fromTile(y + 0.5), 'variaball');
    Level.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = false;
    this.sprite.animations.add('digitize', [0, 1, 8, 3, 7, 5, 6, 4, 2, 9], 10, true);
    this.sprite.animations.play('digitize');
    this.sprite.variable = variable;
  }
};

/**
 * Block methods.
 */
Level.Block.prototype.set = function(name, value) {
  this[name] = value;
  this.update();
};

Level.Block.prototype.move = function(direction, distance) {
  var delta = null;
  switch (direction) {
    case 'left':
      this.x -= distance;
      delta = {x: Util.fromTile(this.x)};
      break;
    case 'right':
      this.x += distance;
      delta = {x: Util.fromTile(this.x)};
      break;
    case 'up':
      this.y -= distance;
      delta = {y: Util.fromTile(this.y)};
      break;
    case 'down':
      this.y += distance;
      delta = {y: Util.fromTile(this.y)};
      break;
    default:
      delta = null;
  }
  if (delta !== null) {
    game.add.tween(this.sprite).to(delta, 800, Phaser.Easing.Quadratic.Out, true);
  }
};

Level.Block.prototype.update = function() {
  this.sprite.frame = {
    'red': 0,
    'orange': 1,
    'yellow': 2,
    'green': 3,
    'blue': 4,
    'indigo': 5,
    'purple': 6,
    'violet': 6,
    'pink': 7,
    'grey': 8,
    'black': 9
  }[this.color];
};

/**
 * Door methods.
 */
Level.Door.prototype.open = function() {
  this.sprite.animations.play('open');
  var t = game.add.tween(this.sprite).to({ x: Util.fromTile(this.x) + 128 }, 1000, Phaser.Easing.Quadratic.Out, true, 800);
  t.onComplete.add(function() {
    this.is_open = true;
  }, this);
};

Level.Door.prototype.close = function() {
  var t = game.add.tween(this.sprite).to({ x: Util.fromTile(this.x) }, 1000, Phaser.Easing.Quadratic.In, true);
  t.onComplete.add(function() {
    this.is_open = false;
    this.sprite.animations.play('default');
  }, this);
};

/**
 * Large block methods.
 */
Level.LargeBlock.prototype.move = function(direction, distance) {
  var delta = null;
  switch (direction) {
    case 'left':
      this.x -= distance;
      delta = {x: Util.fromTile(this.x)};
      break;
    case 'right':
      this.x += distance;
      delta = {x: Util.fromTile(this.x)};
      break;
    case 'up':
      this.y -= distance;
      delta = {y: Util.fromTile(this.y)};
      break;
    case 'down':
      this.y += distance;
      delta = {y: Util.fromTile(this.y)};
      break;
    default:
      delta = null;
  }
  if (delta !== null) {
    var t = game.add.tween(this.sprite).to(delta, 1200, Phaser.Easing.Quadratic.Out, true);
    var block = this;
    t.onComplete.add(function() {
      console.log(block.x, block.y);
      if (this.x === 32 && this.y === 71) {
        var door = Level.doors.get(3);
        door.open();
        this.sprite.frame = 1;
      }
    }, this);
  }
};
