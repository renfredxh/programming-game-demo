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

    // Load game scripts via AJAX
    Level.scripts = {};
    var baseUrl = "python/level/";
    var scriptFiles = {
      '31,88': { level: "level-2.py", player: "demo-2.py" },
    };
    $.each(scriptFiles, function(name, scriptFile) {
      Level.scripts[name] = {};
      $.get(baseUrl + scriptFile.level, function(file) {
        Level.scripts[name].level = file;
      });
      $.get(baseUrl + scriptFile.player , function(file) {
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
