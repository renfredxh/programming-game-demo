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
    this.load.spritesheet('door', 'assets/images/door.png', 128, 192);
    this.load.spritesheet('variaball', 'assets/images/variaball.png', 64, 64);

    // Load game scripts via AJAX
    Level.scripts = {};
    var baseUrl = "python/level/";
    $.each(Level.scriptDataset, function(name, scriptData) {
      Level.scripts[name] = { autocomplete: scriptData.autocomplete };
      $.get(baseUrl + scriptData.level, function(file) {
        Level.scripts[name].level = file;
      });
      $.get(baseUrl + scriptData.player , function(file) {
        Level.scripts[name].player = file;
      });
    });
  },

  create: function () {

  },

  update: function () {
    this.state.start('Game');
  }

};
