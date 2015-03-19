LevelObjectCollection = function(collection) {
  this.collection = collection;
}

LevelObjectCollection.prototype.get = function(id) {
  return this.collection[id];
}

Level = {
  name: "Demo",
  initialize: function(game) {
    this.game = game;
    this.game.blocks = this.game.add.group();
    this.blocks = new LevelObjectCollection({
      1: new this.Block('blue', 2, 2)
    });
    $.get('python/level/demo.py', function(data) {
      this.script = data;
    }.bind(this));
  },
  update: function() {
    this.game.physics.arcade.collide(this.game.player, this.game.blocks);
  },

  Block: function(color, x, y) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.moveTween = null;
    this.sprite = Level.game.blocks.create(64*x, 64*y, 'block');
    Level.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = true;
    this.update();
  },
}

Level.Block.prototype.set = function(name, value) {
  this[name] = value;
  this.update();
}

Level.Block.prototype.move = function(direction, distance) {
  var delta = null;
  switch (direction) {
    case 'left':
      this.x -= distance
      delta = {x: this.x*64};
      break;
    case 'right':
      this.x += distance
      delta = {x: this.x*64};
      break;
    case 'up':
      this.y -= distance
      delta = {y: this.y*64};
      break;
    case 'down':
      this.y += distance
      delta = {y: this.y*64};
      break;
    default:
      delta = null;
  }
  if (delta !== null) {
    //debugger;
    game.add.tween(this.sprite).to(delta, 800, Phaser.Easing.Quadratic.Out, true);
  }
}

Level.Block.prototype.update = function() {
  this.sprite.frame = {
    'red': 0,
    'orange': 2,
    'yellow': 3,
    'green': 3,
    'blue': 4,
    'indigo': 5,
    'purple': 6,
    'violet': 6,
    'pink': 7,
    'grey': 8,
    'black': 9
  }[this.color];
}
