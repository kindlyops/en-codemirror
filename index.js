/* jshint node: true */
'use strict';

module.exports = {
  name: 'en-codemirror',
  included: function (app) {
    this._super.included(app)

    app.import('bower_components/codemirror/lib/codemirror.css')
    app.import('bower_components/codemirror/lib/codemirror.js')

    var modes = ['javascript', 'coffeescript', 'clojure', 'css', 'django', 'clike', 'haskell', 'htmlmixed', 'xml', 'python', 'ruby', 'sass', 'sql', 'go', 'rust', 'swift', 'php']

    modes.forEach(function (mode) {
      app.import('bower_components/codemirror/mode/' + mode + '/' + mode + '.js')
    })
  }
};
