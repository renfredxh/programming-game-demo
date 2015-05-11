var GameEditor = {
  SLIDE_ANIM_SPEED: 250,
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
   * Some default autocompletions to be included in every script.
   */
  autocomplete: [
    { caption: 'print(text)', value: 'print(', meta: 'function' },
  ],
  /**
   * Autocomplete extension for ace that autocompletes variable and method names
   * for a given level script.
   */
  levelCompleter: {
    getCompletions: function(editor, session, pos, prefix, callback) {
      if (prefix.length === 0) { callback(null, []); return; }
      var wordList = GameEditor.autocomplete.concat(GameEditor.scripts.autocomplete);
      callback(null, wordList.map(function(word) {
        var matchRange, match = null;
        var session = editor.getSession();
        if (word.meta === 'method') {
          // For methods, ensure the identifier (matchPrefix) that comes before the current autcomplete
          // matches the appropriate class for that particular method.
          var matchPrefix = word.className + ".";
          matchRange = new ace.Range(pos.row, (pos.column - prefix.length - matchPrefix.length),
                                     pos.row, (pos.column - prefix.length));
          match = session.getTextRange(matchRange);
          if (match !== matchPrefix) { return {}; }
        } else if (word.meta === 'function') {
          matchRange = new ace.Range(pos.row, (pos.column - prefix.length - 1),
                                     pos.row, (pos.column - prefix.length));
          match = session.getTextRange(matchRange);
          // Don't match functions with method calls.
          if (match === '.') { return {}; }
        }
        return {
          caption: word.caption,
          name: word.value,
          value: word.value,
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
    this.scriptId = [x, y].toString();
    this.scripts = Level.scripts[this.scriptId];
    this.variables = Level.variables[this.scriptId];
    this.reposition();
    this.$el.show('slide', { direction: 'right' }, this.SLIDE_ANIM_SPEED);
    this.editor = ace.edit('script');
    this.configure();
    $('#console').css({ fontSize: this.fontSize });
    if (this.variables && this.variables.length > 0) {
      this.showVariables();
    } else {
      $('#variables').hide();
      $('#script').css('height', '75%');
    }
  },
  showVariables: function() {
    $('#variables').html("Inventory: ");
    $.each(this.variables, function(i, variable) {
      $('#variables').append("<div class='variable'>" + variable + "</div>");
    });
    var editor = this.editor;
    var session = this.editor.getSession();
    $('.variable').click(function() {
      session.insert(editor.getCursorPosition(), $(this).text());
    });
    $('#script').css('height', '70%');
    $('#variables').show();
  },
  hide: function() {
    this.$el.hide('slide', { direction: 'right' }, this.SLIDE_ANIM_SPEED);
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
