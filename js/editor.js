var GameEditor = {
  initialize: function() {
    this.$el = $('#editor');
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
    var editor = ace.edit('editor');
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
  }
};
