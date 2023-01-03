import { select } from "d3";
import cytoscape from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";
import { isDark, lighten, darken } from "khroma";
var parser = function() {
  var o = function(k, v, o2, l) {
    for (o2 = o2 || {}, l = k.length; l--; o2[k[l]] = v)
      ;
    return o2;
  }, $V0 = [1, 7], $V1 = [1, 9], $V2 = [1, 10], $V3 = [1, 14], $V4 = [1, 13], $V5 = [1, 19], $V6 = [1, 20], $V7 = [6, 9], $V8 = [1, 7, 12, 13, 16, 19], $V9 = [1, 28], $Va = [1, 29], $Vb = [1, 6, 7, 9, 12, 13, 16, 19];
  var parser2 = {
    trace: function trace() {
    },
    yy: {},
    symbols_: { "error": 2, "start": 3, "MINDMAP": 4, "document": 5, "NL": 6, "SPACELIST": 7, "stop": 8, "EOF": 9, "statement": 10, "node": 11, "ICON": 12, "CLASS": 13, "nodeWithId": 14, "nodeWithoutId": 15, "NODE_DSTART": 16, "NODE_DESCR": 17, "NODE_DEND": 18, "NODE_ID": 19, "$accept": 0, "$end": 1 },
    terminals_: { 2: "error", 4: "MINDMAP", 6: "NL", 7: "SPACELIST", 9: "EOF", 12: "ICON", 13: "CLASS", 16: "NODE_DSTART", 17: "NODE_DESCR", 18: "NODE_DEND", 19: "NODE_ID" },
    productions_: [0, [3, 2], [3, 3], [3, 3], [8, 1], [8, 1], [8, 2], [8, 2], [5, 3], [5, 2], [10, 2], [10, 2], [10, 2], [10, 1], [10, 1], [10, 1], [10, 1], [11, 1], [11, 1], [15, 3], [14, 1], [14, 4]],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
      var $0 = $$.length - 1;
      switch (yystate) {
        case 1:
        case 2:
        case 3:
          return yy;
        case 4:
          yy.getLogger().trace("Stop NL ");
          break;
        case 5:
          yy.getLogger().trace("Stop EOF ");
          break;
        case 6:
          yy.getLogger().trace("Stop NL2 ");
          break;
        case 7:
          yy.getLogger().trace("Stop EOF2 ");
          break;
        case 10:
          yy.getLogger().trace("Node: ", $$[$0].id);
          yy.addNode($$[$0 - 1].length, $$[$0].id, $$[$0].descr, $$[$0].type);
          break;
        case 11:
          yy.getLogger().trace("Icon: ", $$[$0]);
          yy.decorateNode({ icon: $$[$0] });
          break;
        case 12:
        case 15:
          yy.decorateNode({ class: $$[$0] });
          break;
        case 13:
          yy.getLogger().trace("Node: ", $$[$0].id);
          yy.addNode(0, $$[$0].id, $$[$0].descr, $$[$0].type);
          break;
        case 14:
          yy.decorateNode({ icon: $$[$0] });
          break;
        case 19:
          yy.getLogger().trace("node found ..", $$[$0 - 2]);
          this.$ = { id: $$[$0 - 1], descr: $$[$0 - 1], type: yy.getType($$[$0 - 2], $$[$0]) };
          break;
        case 20:
          this.$ = { id: $$[$0], descr: $$[$0], type: yy.nodeType.DEFAULT };
          break;
        case 21:
          yy.getLogger().trace("node found ..", $$[$0 - 3]);
          this.$ = { id: $$[$0 - 3], descr: $$[$0 - 1], type: yy.getType($$[$0 - 2], $$[$0]) };
          break;
      }
    },
    table: [{ 3: 1, 4: [1, 2], 7: [1, 3] }, { 1: [3] }, { 5: 4, 6: [1, 5], 7: $V0, 10: 6, 11: 8, 12: $V1, 13: $V2, 14: 11, 15: 12, 16: $V3, 19: $V4 }, { 4: [1, 15] }, { 1: [2, 1], 7: $V0, 10: 16, 11: 8, 12: $V1, 13: $V2, 14: 11, 15: 12, 16: $V3, 19: $V4 }, { 5: 17, 7: $V0, 10: 6, 11: 8, 12: $V1, 13: $V2, 14: 11, 15: 12, 16: $V3, 19: $V4 }, { 6: $V5, 8: 18, 9: $V6 }, o($V7, [2, 16], { 14: 11, 15: 12, 11: 21, 12: [1, 22], 13: [1, 23], 16: $V3, 19: $V4 }), o($V7, [2, 13]), o($V7, [2, 14]), o($V7, [2, 15]), o($V7, [2, 17]), o($V7, [2, 18]), o($V7, [2, 20], { 16: [1, 24] }), { 17: [1, 25] }, { 5: 26, 7: $V0, 10: 6, 11: 8, 12: $V1, 13: $V2, 14: 11, 15: 12, 16: $V3, 19: $V4 }, { 6: $V5, 8: 27, 9: $V6 }, { 1: [2, 2], 7: $V0, 10: 16, 11: 8, 12: $V1, 13: $V2, 14: 11, 15: 12, 16: $V3, 19: $V4 }, o($V8, [2, 9], { 6: $V9, 9: $Va }), o($Vb, [2, 4]), o($Vb, [2, 5]), o($V7, [2, 10]), o($V7, [2, 11]), o($V7, [2, 12]), { 17: [1, 30] }, { 18: [1, 31] }, { 1: [2, 3], 7: $V0, 10: 16, 11: 8, 12: $V1, 13: $V2, 14: 11, 15: 12, 16: $V3, 19: $V4 }, o($V8, [2, 8], { 6: $V9, 9: $Va }), o($Vb, [2, 6]), o($Vb, [2, 7]), { 18: [1, 32] }, o($V7, [2, 19]), o($V7, [2, 21])],
    defaultActions: {},
    parseError: function parseError2(str, hash) {
      if (hash.recoverable) {
        this.trace(str);
      } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
      }
    },
    parse: function parse(input) {
      var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, TERROR = 2, EOF = 1;
      var args = lstack.slice.call(arguments, 1);
      var lexer2 = Object.create(this.lexer);
      var sharedState = { yy: {} };
      for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
          sharedState.yy[k] = this.yy[k];
        }
      }
      lexer2.setInput(input, sharedState.yy);
      sharedState.yy.lexer = lexer2;
      sharedState.yy.parser = this;
      if (typeof lexer2.yylloc == "undefined") {
        lexer2.yylloc = {};
      }
      var yyloc = lexer2.yylloc;
      lstack.push(yyloc);
      var ranges = lexer2.options && lexer2.options.ranges;
      if (typeof sharedState.yy.parseError === "function") {
        this.parseError = sharedState.yy.parseError;
      } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
      }
      function lex() {
        var token;
        token = tstack.pop() || lexer2.lex() || EOF;
        if (typeof token !== "number") {
          if (token instanceof Array) {
            tstack = token;
            token = tstack.pop();
          }
          token = self.symbols_[token] || token;
        }
        return token;
      }
      var symbol, state, action, r, yyval = {}, p, len, newState, expected;
      while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
          action = this.defaultActions[state];
        } else {
          if (symbol === null || typeof symbol == "undefined") {
            symbol = lex();
          }
          action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
          var errStr = "";
          expected = [];
          for (p in table[state]) {
            if (this.terminals_[p] && p > TERROR) {
              expected.push("'" + this.terminals_[p] + "'");
            }
          }
          if (lexer2.showPosition) {
            errStr = "Parse error on line " + (yylineno + 1) + ":\n" + lexer2.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
          } else {
            errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == EOF ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
          }
          this.parseError(errStr, {
            text: lexer2.match,
            token: this.terminals_[symbol] || symbol,
            line: lexer2.yylineno,
            loc: yyloc,
            expected
          });
        }
        if (action[0] instanceof Array && action.length > 1) {
          throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
          case 1:
            stack.push(symbol);
            vstack.push(lexer2.yytext);
            lstack.push(lexer2.yylloc);
            stack.push(action[1]);
            symbol = null;
            {
              yyleng = lexer2.yyleng;
              yytext = lexer2.yytext;
              yylineno = lexer2.yylineno;
              yyloc = lexer2.yylloc;
            }
            break;
          case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
              first_line: lstack[lstack.length - (len || 1)].first_line,
              last_line: lstack[lstack.length - 1].last_line,
              first_column: lstack[lstack.length - (len || 1)].first_column,
              last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
              yyval._$.range = [
                lstack[lstack.length - (len || 1)].range[0],
                lstack[lstack.length - 1].range[1]
              ];
            }
            r = this.performAction.apply(yyval, [
              yytext,
              yyleng,
              yylineno,
              sharedState.yy,
              action[1],
              vstack,
              lstack
            ].concat(args));
            if (typeof r !== "undefined") {
              return r;
            }
            if (len) {
              stack = stack.slice(0, -1 * len * 2);
              vstack = vstack.slice(0, -1 * len);
              lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
          case 3:
            return true;
        }
      }
      return true;
    }
  };
  var lexer = function() {
    var lexer2 = {
      EOF: 1,
      parseError: function parseError2(str, hash) {
        if (this.yy.parser) {
          this.yy.parser.parseError(str, hash);
        } else {
          throw new Error(str);
        }
      },
      setInput: function(input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = "";
        this.conditionStack = ["INITIAL"];
        this.yylloc = {
          first_line: 1,
          first_column: 0,
          last_line: 1,
          last_column: 0
        };
        if (this.options.ranges) {
          this.yylloc.range = [0, 0];
        }
        this.offset = 0;
        return this;
      },
      input: function() {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
          this.yylineno++;
          this.yylloc.last_line++;
        } else {
          this.yylloc.last_column++;
        }
        if (this.options.ranges) {
          this.yylloc.range[1]++;
        }
        this._input = this._input.slice(1);
        return ch;
      },
      unput: function(ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);
        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);
        if (lines.length - 1) {
          this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;
        this.yylloc = {
          first_line: this.yylloc.first_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.first_column,
          last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
        };
        if (this.options.ranges) {
          this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
      },
      more: function() {
        this._more = true;
        return this;
      },
      reject: function() {
        if (this.options.backtrack_lexer) {
          this._backtrack = true;
        } else {
          return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        }
        return this;
      },
      less: function(n) {
        this.unput(this.match.slice(n));
      },
      pastInput: function() {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
      },
      upcomingInput: function() {
        var next = this.match;
        if (next.length < 20) {
          next += this._input.substr(0, 20 - next.length);
        }
        return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
      },
      showPosition: function() {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
      },
      test_match: function(match, indexed_rule) {
        var token, lines, backup;
        if (this.options.backtrack_lexer) {
          backup = {
            yylineno: this.yylineno,
            yylloc: {
              first_line: this.yylloc.first_line,
              last_line: this.last_line,
              first_column: this.yylloc.first_column,
              last_column: this.yylloc.last_column
            },
            yytext: this.yytext,
            match: this.match,
            matches: this.matches,
            matched: this.matched,
            yyleng: this.yyleng,
            offset: this.offset,
            _more: this._more,
            _input: this._input,
            yy: this.yy,
            conditionStack: this.conditionStack.slice(0),
            done: this.done
          };
          if (this.options.ranges) {
            backup.yylloc.range = this.yylloc.range.slice(0);
          }
        }
        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
          this.yylineno += lines.length;
        }
        this.yylloc = {
          first_line: this.yylloc.last_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.last_column,
          last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
          this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
          this.done = false;
        }
        if (token) {
          return token;
        } else if (this._backtrack) {
          for (var k in backup) {
            this[k] = backup[k];
          }
          return false;
        }
        return false;
      },
      next: function() {
        if (this.done) {
          return this.EOF;
        }
        if (!this._input) {
          this.done = true;
        }
        var token, match, tempMatch, index;
        if (!this._more) {
          this.yytext = "";
          this.match = "";
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
          tempMatch = this._input.match(this.rules[rules[i]]);
          if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
            match = tempMatch;
            index = i;
            if (this.options.backtrack_lexer) {
              token = this.test_match(tempMatch, rules[i]);
              if (token !== false) {
                return token;
              } else if (this._backtrack) {
                match = false;
                continue;
              } else {
                return false;
              }
            } else if (!this.options.flex) {
              break;
            }
          }
        }
        if (match) {
          token = this.test_match(match, rules[index]);
          if (token !== false) {
            return token;
          }
          return false;
        }
        if (this._input === "") {
          return this.EOF;
        } else {
          return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        }
      },
      lex: function lex() {
        var r = this.next();
        if (r) {
          return r;
        } else {
          return this.lex();
        }
      },
      begin: function begin(condition) {
        this.conditionStack.push(condition);
      },
      popState: function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
          return this.conditionStack.pop();
        } else {
          return this.conditionStack[0];
        }
      },
      _currentRules: function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
          return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
          return this.conditions["INITIAL"].rules;
        }
      },
      topState: function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
          return this.conditionStack[n];
        } else {
          return "INITIAL";
        }
      },
      pushState: function pushState(condition) {
        this.begin(condition);
      },
      stateStackSize: function stateStackSize() {
        return this.conditionStack.length;
      },
      options: { "case-insensitive": true },
      performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
        switch ($avoiding_name_collisions) {
          case 0:
            yy.getLogger().trace("Found comment", yy_.yytext);
            break;
          case 1:
            return 4;
          case 2:
            this.begin("CLASS");
            break;
          case 3:
            this.popState();
            return 13;
          case 4:
            this.popState();
            break;
          case 5:
            yy.getLogger().trace("Begin icon");
            this.begin("ICON");
            break;
          case 6:
            return 6;
          case 7:
            return 12;
          case 8:
            yy.getLogger().trace("end icon");
            this.popState();
            break;
          case 9:
            yy.getLogger().trace("Exploding node");
            this.begin("NODE");
            return 16;
          case 10:
            yy.getLogger().trace("Cloud");
            this.begin("NODE");
            return 16;
          case 11:
            yy.getLogger().trace("Explosion Bang");
            this.begin("NODE");
            return 16;
          case 12:
            yy.getLogger().trace("Cloud Bang");
            this.begin("NODE");
            return 16;
          case 13:
            this.begin("NODE");
            return 16;
          case 14:
            this.begin("NODE");
            return 16;
          case 15:
            this.begin("NODE");
            return 16;
          case 16:
            return 7;
          case 17:
            return 19;
          case 18:
            return 9;
          case 19:
            yy.getLogger().trace("Starting NSTR");
            this.begin("NSTR");
            break;
          case 20:
            yy.getLogger().trace("description:", yy_.yytext);
            return "NODE_DESCR";
          case 21:
            this.popState();
            break;
          case 22:
            this.popState();
            yy.getLogger().trace("node end ))");
            return "NODE_DEND";
          case 23:
            this.popState();
            yy.getLogger().trace("node end )");
            return "NODE_DEND";
          case 24:
            this.popState();
            yy.getLogger().trace("node end ...", yy_.yytext);
            return "NODE_DEND";
          case 25:
            this.popState();
            yy.getLogger().trace("node end (-");
            return "NODE_DEND";
          case 26:
            this.popState();
            yy.getLogger().trace("node end (-");
            return "NODE_DEND";
          case 27:
            this.popState();
            yy.getLogger().trace("node end ((");
            return "NODE_DEND";
          case 28:
            this.popState();
            yy.getLogger().trace("node end ((");
            return "NODE_DEND";
          case 29:
            yy.getLogger().trace("Long description:", yy_.yytext);
            return 17;
          case 30:
            yy.getLogger().trace("Long description:", yy_.yytext);
            return 17;
        }
      },
      rules: [/^(?:\s*%%.*)/i, /^(?:mindmap\b)/i, /^(?::::)/i, /^(?:.+)/i, /^(?:\n)/i, /^(?:::icon\()/i, /^(?:[\n]+)/i, /^(?:[^\)]+)/i, /^(?:\))/i, /^(?:-\))/i, /^(?:\(-)/i, /^(?:\)\))/i, /^(?:\))/i, /^(?:\(\()/i, /^(?:\()/i, /^(?:\[)/i, /^(?:[\s]+)/i, /^(?:[^\(\[\n\-\)]+)/i, /^(?:$)/i, /^(?:["])/i, /^(?:[^"]+)/i, /^(?:["])/i, /^(?:[\)]\))/i, /^(?:[\)])/i, /^(?:[\]])/i, /^(?:\(-)/i, /^(?:-\))/i, /^(?:\(\()/i, /^(?:\()/i, /^(?:[^\)\]\(]+)/i, /^(?:.+(?!\(\())/i],
      conditions: { "CLASS": { "rules": [3, 4], "inclusive": false }, "ICON": { "rules": [7, 8], "inclusive": false }, "NSTR": { "rules": [20, 21], "inclusive": false }, "NODE": { "rules": [19, 22, 23, 24, 25, 26, 27, 28, 29, 30], "inclusive": false }, "INITIAL": { "rules": [0, 1, 2, 5, 6, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], "inclusive": true } }
    };
    return lexer2;
  }();
  parser2.lexer = lexer;
  function Parser() {
    this.yy = {};
  }
  Parser.prototype = parser2;
  parser2.Parser = Parser;
  return new Parser();
}();
parser.parser = parser;
const mindmapParser = parser;
const warning = (s) => {
  console.error("Log function was called before initialization", s);
};
const log = {
  trace: warning,
  debug: warning,
  info: warning,
  warn: warning,
  error: warning,
  fatal: warning
};
let getConfig;
let sanitizeText;
let setupGraphViewbox;
const injectUtils = (_log, _setLogLevel, _getConfig, _sanitizeText, _setupGraphViewbox) => {
  _log.info("Mermaid utils injected");
  log.trace = _log.trace;
  log.debug = _log.debug;
  log.info = _log.info;
  log.warn = _log.warn;
  log.error = _log.error;
  log.fatal = _log.fatal;
  getConfig = _getConfig;
  sanitizeText = _sanitizeText;
  setupGraphViewbox = _setupGraphViewbox;
};
let nodes = [];
let cnt = 0;
const clear = () => {
  nodes = [];
  cnt = 0;
};
const getParent = function(level) {
  for (let i = nodes.length - 1; i >= 0; i--) {
    if (nodes[i].level < level) {
      return nodes[i];
    }
  }
  return null;
};
const getMindmap = () => {
  return nodes.length > 0 ? nodes[0] : null;
};
const addNode = (level, id, descr, type) => {
  var _a, _b, _c, _d;
  log.info("addNode", level, id, descr, type);
  const conf = getConfig();
  const padding = (_b = (_a = conf.mindmap) == null ? void 0 : _a.padding) != null ? _b : 15;
  const node = {
    id: cnt++,
    nodeId: sanitizeText(id),
    level,
    descr: sanitizeText(descr),
    type,
    children: [],
    width: (_d = (_c = getConfig().mindmap) == null ? void 0 : _c.maxNodeWidth) != null ? _d : 200,
    padding: type === nodeType.ROUNDED_RECT || type === nodeType.RECT ? 2 * padding : padding
  };
  const parent = getParent(level);
  if (parent) {
    parent.children.push(node);
    nodes.push(node);
  } else {
    if (nodes.length === 0) {
      nodes.push(node);
    } else {
      const error = new Error(
        'There can be only one root. No parent could be found for ("' + node.descr + '")'
      );
      error.hash = {
        text: "branch " + name,
        token: "branch " + name,
        line: "1",
        loc: { first_line: 1, last_line: 1, first_column: 1, last_column: 1 },
        expected: ['"checkout ' + name + '"']
      };
      throw error;
    }
  }
};
const nodeType = {
  DEFAULT: 0,
  NO_BORDER: 0,
  ROUNDED_RECT: 1,
  RECT: 2,
  CIRCLE: 3,
  CLOUD: 4,
  BANG: 5
};
const getType = (startStr, endStr) => {
  log.debug("In get type", startStr, endStr);
  switch (startStr) {
    case "[":
      return nodeType.RECT;
    case "(":
      return endStr === ")" ? nodeType.ROUNDED_RECT : nodeType.CLOUD;
    case "((":
      return nodeType.CIRCLE;
    case ")":
      return nodeType.CLOUD;
    case "))":
      return nodeType.BANG;
    default:
      return nodeType.DEFAULT;
  }
};
const decorateNode = (decoration) => {
  const node = nodes[nodes.length - 1];
  if (decoration && decoration.icon) {
    node.icon = sanitizeText(decoration.icon);
  }
  if (decoration && decoration.class) {
    node.class = sanitizeText(decoration.class);
  }
};
const type2Str = (type) => {
  switch (type) {
    case nodeType.DEFAULT:
      return "no-border";
    case nodeType.RECT:
      return "rect";
    case nodeType.ROUNDED_RECT:
      return "rounded-rect";
    case nodeType.CIRCLE:
      return "circle";
    case nodeType.CLOUD:
      return "cloud";
    case nodeType.BANG:
      return "bang";
    default:
      return "no-border";
  }
};
let parseError;
const setErrorHandler = (handler) => {
  parseError = handler;
};
const getLogger = () => log;
const getNodeById = (id) => nodes[id];
const mindmapDb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clear,
  getMindmap,
  addNode,
  nodeType,
  getType,
  decorateNode,
  type2Str,
  get parseError() {
    return parseError;
  },
  setErrorHandler,
  getLogger,
  getNodeById
}, Symbol.toStringTag, { value: "Module" }));
const MAX_SECTIONS = 12;
function wrap(text, width) {
  text.each(function() {
    var text2 = select(this), words = text2.text().split(/(\s+|<br>)/).reverse(), word, line = [], lineHeight = 1.1, y = text2.attr("y"), dy = parseFloat(text2.attr("dy")), tspan = text2.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    for (let j = 0; j < words.length; j++) {
      word = words[words.length - 1 - j];
      line.push(word);
      tspan.text(line.join(" ").trim());
      if (tspan.node().getComputedTextLength() > width || word === "<br>") {
        line.pop();
        tspan.text(line.join(" ").trim());
        if (word === "<br>") {
          line = [""];
        } else {
          line = [word];
        }
        tspan = text2.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineHeight + "em").text(word);
      }
    }
  });
}
const defaultBkg = function(elem, node, section) {
  const rd = 5;
  elem.append("path").attr("id", "node-" + node.id).attr("class", "node-bkg node-" + type2Str(node.type)).attr(
    "d",
    `M0 ${node.height - rd} v${-node.height + 2 * rd} q0,-5 5,-5 h${node.width - 2 * rd} q5,0 5,5 v${node.height - rd} H0 Z`
  );
  elem.append("line").attr("class", "node-line-" + section).attr("x1", 0).attr("y1", node.height).attr("x2", node.width).attr("y2", node.height);
};
const rectBkg = function(elem, node) {
  elem.append("rect").attr("id", "node-" + node.id).attr("class", "node-bkg node-" + type2Str(node.type)).attr("height", node.height).attr("width", node.width);
};
const cloudBkg = function(elem, node) {
  const w = node.width;
  const h = node.height;
  const r1 = 0.15 * w;
  const r2 = 0.25 * w;
  const r3 = 0.35 * w;
  const r4 = 0.2 * w;
  elem.append("path").attr("id", "node-" + node.id).attr("class", "node-bkg node-" + type2Str(node.type)).attr(
    "d",
    `M0 0 a${r1},${r1} 0 0,1 ${w * 0.25},${-1 * w * 0.1}
      a${r3},${r3} 1 0,1 ${w * 0.4},${-1 * w * 0.1}
      a${r2},${r2} 1 0,1 ${w * 0.35},${1 * w * 0.2}

      a${r1},${r1} 1 0,1 ${w * 0.15},${1 * h * 0.35}
      a${r4},${r4} 1 0,1 ${-1 * w * 0.15},${1 * h * 0.65}

      a${r2},${r1} 1 0,1 ${-1 * w * 0.25},${w * 0.15}
      a${r3},${r3} 1 0,1 ${-1 * w * 0.5},${0}
      a${r1},${r1} 1 0,1 ${-1 * w * 0.25},${-1 * w * 0.15}

      a${r1},${r1} 1 0,1 ${-1 * w * 0.1},${-1 * h * 0.35}
      a${r4},${r4} 1 0,1 ${w * 0.1},${-1 * h * 0.65}

    H0 V0 Z`
  );
};
const bangBkg = function(elem, node) {
  const w = node.width;
  const h = node.height;
  const r = 0.15 * w;
  elem.append("path").attr("id", "node-" + node.id).attr("class", "node-bkg node-" + type2Str(node.type)).attr(
    "d",
    `M0 0 a${r},${r} 1 0,0 ${w * 0.25},${-1 * h * 0.1}
      a${r},${r} 1 0,0 ${w * 0.25},${0}
      a${r},${r} 1 0,0 ${w * 0.25},${0}
      a${r},${r} 1 0,0 ${w * 0.25},${1 * h * 0.1}

      a${r},${r} 1 0,0 ${w * 0.15},${1 * h * 0.33}
      a${r * 0.8},${r * 0.8} 1 0,0 ${0},${1 * h * 0.34}
      a${r},${r} 1 0,0 ${-1 * w * 0.15},${1 * h * 0.33}

      a${r},${r} 1 0,0 ${-1 * w * 0.25},${h * 0.15}
      a${r},${r} 1 0,0 ${-1 * w * 0.25},${0}
      a${r},${r} 1 0,0 ${-1 * w * 0.25},${0}
      a${r},${r} 1 0,0 ${-1 * w * 0.25},${-1 * h * 0.15}

      a${r},${r} 1 0,0 ${-1 * w * 0.1},${-1 * h * 0.33}
      a${r * 0.8},${r * 0.8} 1 0,0 ${0},${-1 * h * 0.34}
      a${r},${r} 1 0,0 ${w * 0.1},${-1 * h * 0.33}

    H0 V0 Z`
  );
};
const circleBkg = function(elem, node) {
  elem.append("circle").attr("id", "node-" + node.id).attr("class", "node-bkg node-" + type2Str(node.type)).attr("r", node.width / 2);
};
const roundedRectBkg = function(elem, node) {
  elem.append("rect").attr("id", "node-" + node.id).attr("class", "node-bkg node-" + type2Str(node.type)).attr("height", node.height).attr("rx", node.padding).attr("ry", node.padding).attr("width", node.width);
};
const drawNode = function(elem, node, fullSection, conf) {
  const section = fullSection % MAX_SECTIONS - 1;
  const nodeElem = elem.append("g");
  node.section = section;
  nodeElem.attr(
    "class",
    (node.class ? node.class + " " : "") + "mindmap-node " + (section < 0 ? "section-root" : "section-" + section)
  );
  const bkgElem = nodeElem.append("g");
  const textElem = nodeElem.append("g");
  const txt = textElem.append("text").text(node.descr).attr("dy", "1em").attr("alignment-baseline", "middle").attr("dominant-baseline", "middle").attr("text-anchor", "middle").call(wrap, node.width);
  const bbox = txt.node().getBBox();
  const fontSize = conf.fontSize.replace ? conf.fontSize.replace("px", "") : conf.fontSize;
  node.height = bbox.height + fontSize * 1.1 * 0.5 + node.padding;
  node.width = bbox.width + 2 * node.padding;
  if (node.icon) {
    if (node.type === nodeType.CIRCLE) {
      node.height += 50;
      node.width += 50;
      const icon = nodeElem.append("foreignObject").attr("height", "50px").attr("width", node.width).attr("style", "text-align: center;");
      icon.append("div").attr("class", "icon-container").append("i").attr("class", "node-icon-" + section + " " + node.icon);
      textElem.attr(
        "transform",
        "translate(" + node.width / 2 + ", " + (node.height / 2 - 1.5 * node.padding) + ")"
      );
    } else {
      node.width += 50;
      const orgHeight = node.height;
      node.height = Math.max(orgHeight, 60);
      const heightDiff = Math.abs(node.height - orgHeight);
      const icon = nodeElem.append("foreignObject").attr("width", "60px").attr("height", node.height).attr("style", "text-align: center;margin-top:" + heightDiff / 2 + "px;");
      icon.append("div").attr("class", "icon-container").append("i").attr("class", "node-icon-" + section + " " + node.icon);
      textElem.attr(
        "transform",
        "translate(" + (25 + node.width / 2) + ", " + (heightDiff / 2 + node.padding / 2) + ")"
      );
    }
  } else {
    textElem.attr("transform", "translate(" + node.width / 2 + ", " + node.padding / 2 + ")");
  }
  switch (node.type) {
    case nodeType.DEFAULT:
      defaultBkg(bkgElem, node, section);
      break;
    case nodeType.ROUNDED_RECT:
      roundedRectBkg(bkgElem, node);
      break;
    case nodeType.RECT:
      rectBkg(bkgElem, node);
      break;
    case nodeType.CIRCLE:
      bkgElem.attr("transform", "translate(" + node.width / 2 + ", " + +node.height / 2 + ")");
      circleBkg(bkgElem, node);
      break;
    case nodeType.CLOUD:
      cloudBkg(bkgElem, node);
      break;
    case nodeType.BANG:
      bangBkg(bkgElem, node);
      break;
  }
  setElementById(node.id, nodeElem);
  return node.height;
};
const drawEdge = function drawEdge2(edgesElem, mindmap, parent, depth, fullSection) {
  const section = fullSection % MAX_SECTIONS - 1;
  const sx = parent.x + parent.width / 2;
  const sy = parent.y + parent.height / 2;
  const ex = mindmap.x + mindmap.width / 2;
  const ey = mindmap.y + mindmap.height / 2;
  const mx = ex > sx ? sx + Math.abs(sx - ex) / 2 : sx - Math.abs(sx - ex) / 2;
  const my = ey > sy ? sy + Math.abs(sy - ey) / 2 : sy - Math.abs(sy - ey) / 2;
  const qx = ex > sx ? Math.abs(sx - mx) / 2 + sx : -Math.abs(sx - mx) / 2 + sx;
  const qy = ey > sy ? Math.abs(sy - my) / 2 + sy : -Math.abs(sy - my) / 2 + sy;
  edgesElem.append("path").attr(
    "d",
    parent.direction === "TB" || parent.direction === "BT" ? `M${sx},${sy} Q${sx},${qy} ${mx},${my} T${ex},${ey}` : `M${sx},${sy} Q${qx},${sy} ${mx},${my} T${ex},${ey}`
  ).attr("class", "edge section-edge-" + section + " edge-depth-" + depth);
};
const positionNode = function(node) {
  const nodeElem = getElementById(node.id);
  const x = node.x || 0;
  const y = node.y || 0;
  nodeElem.attr("transform", "translate(" + x + "," + y + ")");
};
let elements = {};
const setElementById = (id, element) => {
  elements[id] = element;
};
const getElementById = (id) => {
  return elements[id];
};
const clearElementRefs = () => {
  elements = {};
};
const svgDraw = { drawNode, positionNode, drawEdge };
cytoscape.use(coseBilkent);
function drawNodes(svg, mindmap, section, conf) {
  svgDraw.drawNode(svg, mindmap, section, conf);
  if (mindmap.children) {
    mindmap.children.forEach((child, index) => {
      drawNodes(svg, child, section < 0 ? index : section, conf);
    });
  }
}
function drawEdges(edgesEl, cy) {
  cy == null ? void 0 : cy.edges().map((edge, id) => {
    const data = edge.data();
    if (edge[0]._private.bodyBounds) {
      const bounds = edge[0]._private.rscratch;
      log.trace("Edge: ", id, data);
      edgesEl.insert("path").attr(
        "d",
        `M ${bounds.startX},${bounds.startY} L ${bounds.midX},${bounds.midY} L${bounds.endX},${bounds.endY} `
      ).attr("class", "edge section-edge-" + data.section + " edge-depth-" + data.depth);
    }
  });
}
function addNodes(mindmap, cy, conf, level) {
  cy.add({
    group: "nodes",
    data: {
      id: mindmap.id,
      labelText: mindmap.descr,
      height: mindmap.height,
      width: mindmap.width,
      level,
      nodeId: mindmap.id,
      padding: mindmap.padding,
      type: mindmap.type
    },
    position: {
      x: mindmap.x,
      y: mindmap.y
    }
  });
  if (mindmap.children) {
    mindmap.children.forEach((child) => {
      addNodes(child, cy, conf, level + 1);
      cy.add({
        group: "edges",
        data: {
          id: `${mindmap.id}_${child.id}`,
          source: mindmap.id,
          target: child.id,
          depth: level,
          section: child.section
        }
      });
    });
  }
}
function layoutMindmap(node, conf) {
  return new Promise((resolve) => {
    const renderEl = select("body").append("div").attr("id", "cy").attr("style", "display:none");
    const cy = cytoscape({
      container: document.getElementById("cy"),
      style: [
        {
          selector: "edge",
          style: {
            "curve-style": "bezier"
          }
        }
      ]
    });
    renderEl.remove();
    addNodes(node, cy, conf, 0);
    cy.nodes().forEach(function(n) {
      n.layoutDimensions = () => {
        const data = n.data();
        return { w: data.width, h: data.height };
      };
    });
    cy.layout({
      name: "cose-bilkent",
      quality: "proof",
      styleEnabled: false,
      animate: false
    }).run();
    cy.ready((e) => {
      log.info("Ready", e);
      resolve(cy);
    });
  });
}
function positionNodes(cy) {
  cy.nodes().map((node, id) => {
    const data = node.data();
    data.x = node.position().x;
    data.y = node.position().y;
    svgDraw.positionNode(data);
    const el = getElementById(data.nodeId);
    log.info("Id:", id, "Position: (", node.position().x, ", ", node.position().y, ")", data);
    el.attr(
      "transform",
      `translate(${node.position().x - data.width / 2}, ${node.position().y - data.height / 2})`
    );
    el.attr("attr", `apa-${id})`);
  });
}
const draw = async (text, id, version, diagObj) => {
  const conf = getConfig();
  diagObj.db.clear();
  clearElementRefs();
  diagObj.parser.parse(text);
  log.debug("Renering info diagram\n" + text);
  const securityLevel = getConfig().securityLevel;
  let sandboxElement;
  if (securityLevel === "sandbox") {
    sandboxElement = select("#i" + id);
  }
  const root = securityLevel === "sandbox" ? select(sandboxElement.nodes()[0].contentDocument.body) : select("body");
  const svg = root.select("#" + id);
  svg.append("g");
  const mm = diagObj.db.getMindmap();
  const edgesElem = svg.append("g");
  edgesElem.attr("class", "mindmap-edges");
  const nodesElem = svg.append("g");
  nodesElem.attr("class", "mindmap-nodes");
  drawNodes(nodesElem, mm, -1, conf);
  const cy = await layoutMindmap(mm, conf);
  drawEdges(edgesElem, cy);
  positionNodes(cy);
  setupGraphViewbox(void 0, svg, conf.mindmap.padding, conf.mindmap.useMaxWidth);
};
const mindmapRenderer = {
  draw
};
const genSections = (options) => {
  let sections = "";
  for (let i = 0; i < options.THEME_COLOR_LIMIT; i++) {
    options["lineColor" + i] = options["lineColor" + i] || options["cScaleInv" + i];
    if (isDark(options["lineColor" + i])) {
      options["lineColor" + i] = lighten(options["lineColor" + i], 20);
    } else {
      options["lineColor" + i] = darken(options["lineColor" + i], 20);
    }
  }
  for (let i = 0; i < options.THEME_COLOR_LIMIT; i++) {
    const sw = "" + (17 - 3 * i);
    sections += `
    .section-${i - 1} rect, .section-${i - 1} path, .section-${i - 1} circle, .section-${i - 1} path  {
      fill: ${options["cScale" + i]};
    }
    .section-${i - 1} text {
     fill: ${options["cScaleLabel" + i]};
    }
    .node-icon-${i - 1} {
      font-size: 40px;
      color: ${options["cScaleLabel" + i]};
    }
    .section-edge-${i - 1}{
      stroke: ${options["cScale" + i]};
    }
    .edge-depth-${i - 1}{
      stroke-width: ${sw};
    }
    .section-${i - 1} line {
      stroke: ${options["cScaleInv" + i]} ;
      stroke-width: 3;
    }

    .disabled, .disabled circle, .disabled text {
      fill: lightgray;
    }
    .disabled text {
      fill: #efefef;
    }
    `;
  }
  return sections;
};
const getStyles = (options) => `
  .edge {
    stroke-width: 3;
  }
  ${genSections(options)}
  .section-root rect, .section-root path, .section-root circle  {
    fill: ${options.git0};
  }
  .section-root text {
    fill: ${options.gitBranchLabel0};
  }
  .icon-container {
    height:100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .edge {
    fill: none;
  }
`;
const mindmapStyles = getStyles;
const diagram = {
  db: mindmapDb,
  renderer: mindmapRenderer,
  parser: mindmapParser,
  styles: mindmapStyles,
  injectUtils
};
export {
  diagram
};
//# sourceMappingURL=diagram-definition.6c84763a.js.map
