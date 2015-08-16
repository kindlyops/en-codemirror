import Ember from 'ember';

const {
  get: get,
  set: set,
  computed,
  on,
  run,
  getProperties,
  Logger
} = Em

const { warn } = Logger

export default Ember.Component.extend({
  classNames: ['en-code-mirror'],
  modes: Em.A(['javascript', 'coffeescript', 'clojure', 'css', 'django', 'haskell', 'htmlmixed', 'python', 'ruby', 'sass', 'sql', 'swift', 'scheme', 'php']),

  options: computed('modes', function () {
    const modes = get(this, 'modes')
    const mapped =  modes.map(mode => Em.Object.create({id: mode, label: mode}))
    return Em.A(mapped)
  }),
  
  /**
   * @property value
   * @type {String}
   * @default ''
   */
  value: '',

  /**
   * @property mode
   * @type {String}
   * @default null
   */
  mode: 'javascript',

  /**
   * Setup CodeMirror
   *
   * @method setup
   */
  setup: on('didInsertElement', function () {
    this._listenToChanges = this._listenToChanges.bind(this)
    this._focusOnEditor = this._focusOnEditor.bind(this)

    const textarea = document.getElementById("en-code-mirror-textarea")
    const { value, mode } = getProperties(this, 'value', 'mode')

    this._codemirror = CodeMirror(textarea, {
      value: value,
      mode: mode,
      lineNumbers: true,
      theme: '3024-day',
      autoFocus: true,
    })

    this._listenToChanges()
    this._focusOnEditor()
  }),

  /**
   * Teardown CodeMirror
   *
   * @method teardown
   */

  teardown: on('willDestroyElement', function () {
    this._codemirror.off('change')
    this._codemirror = null
  }),

  /**
   * @private
   * Focuses on the editor
   *
   * @method _focusOnEditor
   */

  _focusOnEditor () {
    this._codemirror.focus()
  },

  /**
   * @private
   * Changes editor mode
   *
   * @method _changeEditorMode
   */

  _changeEditorMode (mode) {
    console.log(mode);
    this._codemirror.setOption("mode", mode)
  },

  /**
   * @private
   * Listen to any changes and update value
   *
   * @method _listenToChanges
   */
  _listenToChanges () {
    const codemirror = this._codemirror

    codemirror.on('change', () => {
      const value = codemirror.getDoc().getValue()

      run(() => {
        set(this, 'value', value)
        this.sendAction('onChange', value)
      })
    })
  },

  _checkModeCompatibility: on('didInitAttrs', 'didReceiveAttrs', function () {
    const mode = get(this, 'mode')
    const modes = get(this, 'modes')

    if (!modes.contains(mode)) {
      warn('[en-code-mirror] The mode you specified is not available.')
      return
    }
  }),

  actions: {
    changeMode (mode) {
      const id = get(mode, 'id')

      set(this, 'mode', id)
      this._changeEditorMode(id)
      this._focusOnEditor()
    }
  }
});