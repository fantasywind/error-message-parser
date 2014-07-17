fs = require 'fs'

class ErrorMessageParser
  constructor: ->

  Parser: (options)->
    {@cwd, @lang} = options

    @loadMessages() if @cwd and @lang
    
    return (req, res, next)=>
      req.setLang = @setLang

      ###
      # Error Level
      # 1: Warning
      # 2: Error
      # 3: Fatal
      ###

      res.sendError = (code, additionalMessage)=>
        if @messages[code]
          res.json
            status: false
            code: code
            level: @messages[code].level or 1
            message: if additionalMessage then "#{@messages[code]} (#{additionalMessage})" else @messages[code].msg
        else
          res.json
            status: false
            code: -1
            level: 3
            message: "Server Error!"

      next()

  generateError: (code, additionalMessage)->
    if @messages[code]
      return {
        status: false
        code: code
        level: @messages[code].level or 1
        message: if additionalMessage then "#{@messages[code]} (#{additionalMessage})" else @messages[code].msg
      }
    else
      return {
        status: false
        code: -1
        level: 3
        message: "Server Error!"
      }

  setLang: (@lang)->
  setCwd: (@cwd)->

  loadMessages: ->
    if @lang and @cwd
      try
        @messages = require "#{@cwd}/#{@lang}.json"
      catch e
        throw new Error "Error message file does not exist. (#{@cwd}/#{@lang}.json)"
    else if @lang
      throw new Error "You have to set language file path. Use setCwd function."
    else if @cwd
      throw new Error "You have to set language. Use setLang function."

module.exports = new ErrorMessageParser