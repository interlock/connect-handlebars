[![build status](https://secure.travis-ci.org/interlock/connect-handlebars.png)](http://travis-ci.org/interlock/connect-handlebars)
# Introduction

`connect-handlebars` is [Connect](http://www.senchalabs.org/connect/)
middleware that pre-compiles [handlebars](http://handlebarsjs.com/) to JS.
 Since [express](http://expressjs.com) is built on top of Connect,
`connect-handlebars` will allow you to compile handlebars templates with expressjs.

# Installation

    npm install connect-handlebars

# Usage

Example in express:

    var connect_handlebars = require('connect-handlebars')
    app = require('express').createServer()

    app.use("/templates.js", connect_handlebars(__dirname + "/path/to/templates"));

    app.listen(80);

The middleware builder takes two arguments `source` and `options`

* `source`: The absolute path to the root directory of .handlebars files to compile.
* `options`: Object of options with the following keys
  * `exts`: String|Array of file extensions to pre-compille. (default: ['hbs','handlebars'])
  * `exts_re`: RegExp instance for matching file extensions you want to match. Overrides `exts`
  * `recursive`: bool indicating if sub directories are searched (default: true)
  * `encoding`: String indicating the encoding to use (default: utf8)
  * `cache`: boolean indicating if you want to use caching (default: true)

# Testing

  npm test

Specs for the Jasmine tests are in ./specs
