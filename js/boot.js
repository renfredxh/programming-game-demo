var BasicGame = {};

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

  init: function () {
    //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
    this.input.maxPointers = 1;
    //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
    this.stage.disableVisibilityChange = true;
  },

  preload: function () {
    //this.load.image('preloaderBackground', 'images/preloader_background.jpg');
    //this.load.image('preloaderBar', 'images/preloadr_bar.png');
  },

  create: function () {
    this.state.start('Preloader');
  }

};
