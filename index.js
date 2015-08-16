/* jshint node: true */
'use strict';

module.exports = {
  name: 'en-codemirror',
  included: function (app) {
    this._super.included(app)

    app.import('bower_components/codemirror/lib/codemirror.css')
    app.import('bower_components/codemirror/lib/codemirror.js')
    app.import('bower_components/codemirror/theme/3024-day.css')

    const modes = ['javascript', 'coffeescript', 'clojure', 'css', 'django', 'clike', 'haskell', 'htmlmixed', 'xml', 'python', 'ruby', 'sass', 'sql', 'swift', 'php']

    modes.forEach(function (mode) {
      app.import(`bower_components/codemirror/mode/${mode}/${mode}.js`)
    })
  }
};
