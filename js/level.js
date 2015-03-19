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
    this.blocks = new LevelObjectCollection({
      1: new this.Block('blue', 2, 2)
    });
    $.get('python/level/demo.py', function(data) {
      this.script = data;
    }.bind(this));
  },

  Block: function(color, x, y) {
    this.x = x;
    this.y = y;
    this.color = color;
    game = Level.game;
    this.sprite = game.add.sprite(64*x, 64*y, 'block');
    this.update();
  },
}

Level.Block.prototype.move = function(dist) {
  console.log(dist);
  console.log(this.color);
}

Level.Block.prototype.set = function(name, value) {
  this[name] = value;
  this.update();
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
