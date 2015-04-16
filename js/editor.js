var GameEditor = {
  initialize: function() {
    this.$el = $('#editor');
    this.fontSize = "1=pt";
    this.editor = null;
    this.scripts = null;

    $.get('python/preamble.py', function(data) {
      this.preamble = data;
    }.bind(this));

    $('#run-button').click(this.run.bind(this));
  },
  reposition: function() {
    var pos = $('#game canvas').offset();
    var canvasWidth = $('#game canvas').width();
    var canvasHeight = $('#game canvas').height();
    editorWidth = canvasWidth * 0.40;
    this.$el.css({
        top: pos.top + "px",
        left: (pos.left + canvasWidth) - editorWidth + "px",
        height: canvasHeight,
        width: editorWidth
    });
  },
  show: function(x, y) {
    this.scripts = Level.scripts[[x, y].toString()];
    this.reposition();
    this.$el.show();
    this.editor = ace.edit('script');
    // Prevent warnings about ace auto cursor scrolling.
    this.editor.$blockScrolling = Infinity;
    this.editor.setValue(this.scripts.player);
    this.editor.gotoLine(1);
    this.editor.setOptions({
      theme: "ace/theme/monokai",
      fontFamily: "Consolas",
      fontSize: this.fontSize
    });
    $('#console').css({ fontSize: this.fontSize });
    this.editor.getSession().setMode("ace/mode/python");
  },
  hide: function() {
    this.$el.hide();
    if (this.editor !== null) {
      this.scripts.player = this.editor.getValue();
    }
  },
  run: function() {
    var code = this.editor.getValue();
    var levelScript = this.scripts.level;
    code = this.preamble + "\n" + levelScript + "\n" + code;
    $('#game-script').text(code);
    $('#console').text('➔ ');
    brython({debug: 1, ipy_id:['game-script']});
  }
};
