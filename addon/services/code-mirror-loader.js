import Ember from 'ember';

const {
  get,
  set,
  inject,
  Service
} = Em

const {
  ajax
} = $

export default Service.extend({
  hasLoadedCSS: false,
  hasLoadedJS: false,
  loadedModes: [],

  loadCSS () {
    let cssURL = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.20.2/codemirror.min.css'

    let css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = cssURL

    document
      .head
      .insertBefore(css, document.head.lastChild)
  },

  loadJavascript () {
    let url = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.20.2/codemirror.min.js'

    if (get(this, 'hasLoadedJS')) {
      return
    }

    return ajax({
      url,
      dataType: 'script'
    }).then(() => this.loadMode('javascript'))
  },

  loadMode (mode) {
    let url = `https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.20.2/mode/${mode}/${mode}.min.js`
    let loaded = get(this, 'loadedModes')

    if (loaded.indexOf(mode) > -1) return

    set(this, 'loadedModes', loaded.concat(mode))

    return ajax({
      url,
      dataType: 'script'
    }).then(_ => console.log('loaded'))
  }
});
