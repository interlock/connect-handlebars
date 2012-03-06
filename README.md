# Introduction

`connect-handlebars` is [Connect](http://www.senchalabs.org/connect/)
middleware that pre-compiles [handlebars](http://handlebarsjs.com/)) to JS.
 Since [express](http://expressjs.com) is built on top of Connect,
`connect-handlebars` will allow you to compile handlebars templates with expressjs.

# Installation

    npm install connect-handlebars

# Usage

Example using express:

    less = require('connect-handlebars')
    app = require('express').createServer()

    app.use("/templates.js", less("path/to/handles/templates", {
    }));

    app.listen(80);

The middleware builder takes two arguments `source` and `options`

* `source`: The path to the root directory of .handlebars files to compile.
* `options`: Object of options with the following keys

# Running Tests

