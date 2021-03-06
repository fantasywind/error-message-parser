// Generated by CoffeeScript 1.7.1
(function() {
  var ErrorMessageParser, fs;

  fs = require('fs');

  ErrorMessageParser = (function() {
    function ErrorMessageParser() {}

    ErrorMessageParser.prototype.Parser = function(options) {
      options = options || {};
      this.cwd = options.cwd, this.lang = options.lang;
      if (this.cwd && this.lang) {
        this.loadMessages();
      }
      return (function(_this) {
        return function(req, res, next) {
          req.setLang = _this.setLang;

          /*
           * Error Level
           * 1: Warning
           * 2: Error
           * 3: Fatal
           */
          res.sendError = function(code, additionalMessage) {
            if (_this.messages[code]) {
              return res.json({
                status: false,
                code: code,
                level: _this.messages[code].level || 1,
                message: additionalMessage ? "" + _this.messages[code].msg + " (" + additionalMessage + ")" : _this.messages[code].msg
              });
            } else {
              return res.json({
                status: false,
                code: -1,
                level: 3,
                message: "Server Error!"
              });
            }
          };
          return next();
        };
      })(this);
    };

    ErrorMessageParser.prototype.generateError = function(code, additionalMessage) {
      if (this.messages[code]) {
        return {
          status: false,
          code: code,
          level: this.messages[code].level || 1,
          message: additionalMessage ? "" + this.messages[code].msg + " (" + additionalMessage + ")" : this.messages[code].msg
        };
      } else {
        return {
          status: false,
          code: -1,
          level: 3,
          message: "Server Error!"
        };
      }
    };

    ErrorMessageParser.prototype.setLang = function(lang) {
      this.lang = lang;
    };

    ErrorMessageParser.prototype.setCwd = function(cwd) {
      this.cwd = cwd;
    };

    ErrorMessageParser.prototype.setMessages = function(messages) {
      this.messages = messages;
    };

    ErrorMessageParser.prototype.loadMessages = function() {
      var e;
      if (this.lang && this.cwd) {
        try {
          return this.messages = require("" + this.cwd + "/" + this.lang + ".json");
        } catch (_error) {
          e = _error;
          throw new Error("Error message file does not exist. (" + this.cwd + "/" + this.lang + ".json)");
        }
      } else if (this.lang) {
        throw new Error("You have to set language file path. Use setCwd function.");
      } else if (this.cwd) {
        throw new Error("You have to set language. Use setLang function.");
      } else {
        throw new Error("You have to initial language files.");
      }
    };

    return ErrorMessageParser;

  })();

  module.exports = new ErrorMessageParser;

}).call(this);
