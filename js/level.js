LevelObjectCollection = function(collection) {
  this.collection = collection;
};

LevelObjectCollection.prototype.get = function(id) {
  return this.collection[id];
};

Level = {
  name: "Demo",
  playerStart: { x: Util.fromTile(31), y: Util.fromTile(91) },
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
  },
  initialize: function(game) {
    this.game = game;
    this.game.blocks = this.game.add.group();
    this.blocks = new LevelObjectCollection({
      1: new this.Block('black', 2, 2),
      2: new this.Block('black', 9, 2),
      3: new this.Block('black', 2, 6),
      4: new this.Block('black', 9, 6)
    });
    this.doors = new LevelObjectCollection({
      1: new this.Door(31, 84)
    });
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
  Door: function(x, y) {
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
  game.add.tween(this.sprite).to({ x: this.sprite.x + 128 }, 1000, Phaser.Easing.Quadratic.Out, true, 800);
};

Level.Door.prototype.close = function() {
  var t = game.add.tween(this.sprite).to({ x: this.sprite.x - 128 }, 1000, Phaser.Easing.Quadratic.In, true);
  t.onComplete.add(function() {
    this.sprite.animations.play('default');
  }, this);
};
