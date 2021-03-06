// Generated by CoffeeScript 1.7.1
(function() {
  var errorMessageParser, should;

  process.env.NODE_ENV = 'test';

  should = require('should');

  errorMessageParser = require('..');

  describe('ErrorMessageParser', function() {
    it('should loadMessage throw error when uninitial', function() {
      return (function() {
        return errorMessageParser.loadMessages();
      }).should["throw"]("You have to initial language files.");
    });
    it('should loadMessage throw error when undefined cwd', function() {
      errorMessageParser.setCwd(void 0);
      errorMessageParser.setLang('zh-TW');
      return (function() {
        return errorMessageParser.loadMessages();
      }).should["throw"]("You have to set language file path. Use setCwd function.");
    });
    it('should loadMessage throw error when undefined lang', function() {
      errorMessageParser.setLang(void 0);
      errorMessageParser.setCwd("/tmpfoo");
      return (function() {
        return errorMessageParser.loadMessages();
      }).should["throw"]("You have to set language. Use setLang function.");
    });
    it("should loadMessage throw error when file isn't exist.", function() {
      errorMessageParser.setCwd('/tmpfoo');
      errorMessageParser.setLang('foobar');
      return (function() {
        return errorMessageParser.loadMessages();
      }).should["throw"]("Error message file does not exist. (/tmpfoo/foobar.json)");
    });
    it("should generateError function work.", function() {
      var language;
      language = {
        1: {
          msg: 'foobar',
          level: 3
        },
        2: {
          msg: 'tester'
        }
      };
      errorMessageParser.setMessages(language);
      errorMessageParser.generateError(1).status.should.equal(false);
      errorMessageParser.generateError(1).code.should.equal(1);
      errorMessageParser.generateError(1).level.should.equal(3);
      errorMessageParser.generateError(1).message.should.equal("foobar");
      errorMessageParser.generateError(2).level.should.equal(1);
      errorMessageParser.generateError(3).status.should.equal(false);
      errorMessageParser.generateError(3).code.should.equal(-1);
      errorMessageParser.generateError(3).level.should.equal(3);
      return errorMessageParser.generateError(3).message.should.equal("Server Error!");
    });
    it("should generateError function additional message work.", function() {
      return errorMessageParser.generateError(1, 'additional').message.should.equal("foobar (additional)");
    });
    it("should middleware api useful.", function(done) {
      var req, res;
      req = {};
      res = {};
      return errorMessageParser.Parser()(req, res, function() {
        req.setLang.should.equal(errorMessageParser.setLang);
        res.sendError.should.type('function');
        return done();
      });
    });
    it('should middleware api json work.', function(done) {
      var req, res;
      req = {};
      res = {
        json: function(obj) {
          obj.status.should.equal(false);
          obj.code.should.equal(1);
          obj.level.should.equal(3);
          obj.message.should.equal("foobar");
          return done();
        }
      };
      return errorMessageParser.Parser()(req, res, function() {
        return res.sendError(1);
      });
    });
    it('should middleware api with imcomplete json work.', function(done) {
      var req, res;
      req = {};
      res = {
        json: function(obj) {
          obj.level.should.equal(1);
          return done();
        }
      };
      return errorMessageParser.Parser()(req, res, function() {
        return res.sendError(2);
      });
    });
    it('should middleware api with undefined code work.', function(done) {
      var req, res;
      req = {};
      res = {
        json: function(obj) {
          obj.status.should.equal(false);
          obj.code.should.equal(-1);
          obj.level.should.equal(3);
          obj.message.should.equal("Server Error!");
          return done();
        }
      };
      return errorMessageParser.Parser()(req, res, function() {
        return res.sendError(3);
      });
    });
    it('should middleware api json work.', function(done) {
      var req, res;
      req = {};
      res = {
        json: function(obj) {
          obj.status.should.equal(false);
          obj.code.should.equal(1);
          obj.level.should.equal(3);
          obj.message.should.equal("foobar (additional)");
          return done();
        }
      };
      return errorMessageParser.Parser()(req, res, function() {
        return res.sendError(1, 'additional');
      });
    });
    return it('should middleware api initialer work', function() {
      (function() {
        return errorMessageParser.Parser({
          cwd: '/tmp',
          lang: 'foo'
        });
      }).should["throw"]("Error message file does not exist. (/tmp/foo.json)");
      it('should middleware api initialer work', function() {});
      return (function() {
        return errorMessageParser.Parser({
          cwd: '/tmp'
        });
      }).should.not["throw"]();
    });
  });

}).call(this);
