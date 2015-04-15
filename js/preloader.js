BasicGame.Preloader = function (game) {
  this.background = null;
  this.preloadBar = null;

  this.ready = false;
};

BasicGame.Preloader.prototype = {

  preload: function () {
    this.load.image('player', 'assets/images/player.png');
    this.load.tilemap('demoLevel', 'assets/levels/demoLevel.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles', 'assets/images/tiles.png');
    this.load.image('hexground', 'assets/images/background.png');
    this.load.spritesheet('block', 'assets/images/blocks.png', 64, 64);
  },

  create: function () {

  },

  update: function () {
    this.state.start('Game');
  }

};
