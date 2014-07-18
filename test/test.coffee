process.env.NODE_ENV = 'test'

should = require 'should'
errorMessageParser = require '..'

describe 'ErrorMessageParser', ->
  
  it 'should loadMessage throw error when uninitial', ->

    (->
      errorMessageParser.loadMessages()
    ).should.throw("You have to initial language files.")

  it 'should loadMessage throw error when undefined cwd', ->
    errorMessageParser.setCwd undefined
    errorMessageParser.setLang 'zh-TW'

    (->
      errorMessageParser.loadMessages()
    ).should.throw("You have to set language file path. Use setCwd function.")

  it 'should loadMessage throw error when undefined lang', ->
    errorMessageParser.setLang undefined
    errorMessageParser.setCwd "/tmpfoo"

    (->
      errorMessageParser.loadMessages()
    ).should.throw("You have to set language. Use setLang function.")

  it "should loadMessage throw error when file isn't exist.", ->
    errorMessageParser.setCwd '/tmpfoo'
    errorMessageParser.setLang 'foobar'

    (->
      errorMessageParser.loadMessages()
    ).should.throw("Error message file does not exist. (/tmpfoo/foobar.json)")

  it "should generateError function work.", ->
    language =
      1:
        msg: 'foobar'
        level: 3
      2:
        msg: 'tester'

    errorMessageParser.setMessages language
    errorMessageParser.generateError(1).status.should.equal false
    errorMessageParser.generateError(1).code.should.equal 1
    errorMessageParser.generateError(1).level.should.equal 3
    errorMessageParser.generateError(1).message.should.equal "foobar"
    
    errorMessageParser.generateError(2).level.should.equal 1

    errorMessageParser.generateError(3).status.should.equal false
    errorMessageParser.generateError(3).code.should.equal -1
    errorMessageParser.generateError(3).level.should.equal 3
    errorMessageParser.generateError(3).message.should.equal "Server Error!"

  it "should generateError function additional message work.", ->
    errorMessageParser.generateError(1, 'additional').message.should.equal "foobar (additional)"

  it "should middleware api useful.", (done)->
    req = {}
    res = {}

    errorMessageParser.Parser() req, res, ->
      req.setLang.should.equal errorMessageParser.setLang
      res.sendError.should.type 'function'
      done()

  it 'should middleware api json work.', (done)->
    req = {}
    res =
      json: (obj)->
        obj.status.should.equal false
        obj.code.should.equal 1
        obj.level.should.equal 3
        obj.message.should.equal "foobar"
        done()

    errorMessageParser.Parser() req, res, ->
      res.sendError 1

  it 'should middleware api with imcomplete json work.', (done)->
    req = {}
    res =
      json: (obj)->
        obj.level.should.equal 1
        done()

    errorMessageParser.Parser() req, res, ->
      res.sendError 2

  it 'should middleware api with undefined code work.', (done)->
    req = {}
    res =
      json: (obj)->
        obj.status.should.equal false
        obj.code.should.equal -1
        obj.level.should.equal 3
        obj.message.should.equal "Server Error!"
        done()

    errorMessageParser.Parser() req, res, ->
      res.sendError 3

  it 'should middleware api json work.', (done)->
    req = {}
    res =
      json: (obj)->
        obj.status.should.equal false
        obj.code.should.equal 1
        obj.level.should.equal 3
        obj.message.should.equal "foobar (additional)"
        done()

    errorMessageParser.Parser() req, res, ->
      res.sendError 1, 'additional'

  it 'should middleware api initialer work', ->
    (->
      errorMessageParser.Parser
        cwd: '/tmp'
        lang: 'foo'
    ).should.throw("Error message file does not exist. (/tmp/foo.json)")

    it 'should middleware api initialer work', ->
    (->
      errorMessageParser.Parser
        cwd: '/tmp'
    ).should.not.throw()
