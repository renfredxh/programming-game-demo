var GameEditor = {
  initialize: function() {
    this.$el = $('#editor');
    this.editor = null;

    $.get('python/preamble.py', function(data) {
      this.preamble = data;
    }.bind(this));

    $('#run').click(this.run.bind(this));
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
  show: function() {
    this.reposition();
    this.$el.show();
    this.editor = ace.edit('script');
    this.editor.setOptions({
      theme: "ace/theme/monokai",
      fontFamily: "Consolas",
      fontSize: "12pt"
    });
    this.editor.getSession().setMode("ace/mode/python");
  },
  run: function() {
    var code = this.editor.getValue();
    code = this.preamble + "\n" + code;
    $('#game-script').text(code);
    console.log(code)
    brython({debug: 0, ipy_id:['game-script']});
  }
};