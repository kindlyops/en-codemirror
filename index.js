/* jshint node: true */
'use strict';

module.exports = {
  name: 'en-codemirror',
  included: function (app) {
    this._super.included(app)

    app.import('bower_components/codemirror/lib/codemirror.css')
    app.import('bower_components/codemirror/lib/codemirror.js')
    app.import('bower_components/codemirror/addon/mode/loadmode.js')
  }
};
