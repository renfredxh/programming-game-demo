var GameEditor = {
  initialize: function() {
    this.$el = $('#editor');
    this.fontSize = "13pt";
    this.editor = null;
    this.scripts = null;

    $.get('python/preamble.py', function(data) {
      this.preamble = data;
    }.bind(this));

    $('#run-button').click(this.run.bind(this));

    this.langTools = ace.require("ace/ext/language_tools");
    ace.Range = ace.require("ace/range").Range;
  },
  /**
   * Autocomplete extension for ace that autocompletes variable and method names
   * for a given level script.
   */
  levelCompleter: {
    getCompletions: function(editor, session, pos, prefix, callback) {
      if (prefix.length === 0) { callback(null, []); return; }
      var wordList = GameEditor.scripts.autocomplete;
      callback(null, wordList.map(function(word) {
        var session = editor.getSession();
        if (word.meta === 'method') {
          // For methods, ensure the identifier (matchPrefix) that comes before the current autcomplete
          // matches the appropriate class for that particular method.
          var matchPrefix = word.className + ".";
          var matchRange = new ace.Range(pos.row, (pos.column - prefix.length - matchPrefix.length),
                                         pos.row, (pos.column - prefix.length));
          var match = session.getTextRange(matchRange);
          if (match !== matchPrefix) { return; }
        }
        return {
          caption: word.caption,
          name: word.value,
          value: word.value,
          score: Infinity,
          meta: word.meta || 'variable'
        };
      }));
    }
  },
  configure: function() {
    // Prevent warnings about ace auto cursor scrolling.
    this.editor.$blockScrolling = Infinity;
    this.editor.setValue(this.scripts.player);
    this.editor.getSession().setMode("ace/mode/python");
    this.levelCompleter.getCompletions.bind(this);
    this.langTools.setCompleters([this.levelCompleter]);
    this.editor.setOptions({
      theme: "ace/theme/monokai",
      fontFamily: "Consolas",
      fontSize: this.fontSize,
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    });
    this.editor.gotoLine(1);
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
    this.configure();
    $('#console').css({ fontSize: this.fontSize });
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
