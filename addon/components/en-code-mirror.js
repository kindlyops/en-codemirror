import Ember from 'ember';

const {
  get: get,
  set: set,
  computed,
  on,
  run,
  getProperties,
  getWithDefault,
  Logger,
  String,
  isEmpty
} = Em

const { warn } = Logger
const { capitalize } = String

export default Ember.Component.extend({
  classNames: ['en-code-mirror'],
  modes: Em.A(['javascript', 'coffeescript', 'clojure', 'css', 'django', 'haskell', 'htmlmixed', 'python', 'ruby', 'sass', 'sql', 'go', 'rust', 'swift', 'scheme', 'php']),

  options: computed('modes', function () {
    const modes = get(this, 'modes')
    const mapped =  modes.map(mode => {
      let label = capitalize(mode)

      if (mode === "css") label = "CSS"
      if (mode === "php") label = "PHP"
      if (mode === "sql") label = "SQL"
      if (mode === "htmlmixed") label = "HTML"

      return Em.Object.create({id: mode, label: label})
    })

    return Em.A(mapped)
  }),
  
  /**
   * @property value
   * @type {String}
   * @default ''
   */
  value: '',

  /**
   * @property readOnly
   * @type {Boolean}
   * @default false
   */
  readOnly: false,

  /**
   * @property autoFocus
   * @type {Boolean}
   * @default true
   */
  autoFocus: true,

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
    run.scheduleOnce('afterRender', () => {
      this._listenToChanges = this._listenToChanges.bind(this)
      this._focusOnEditor = this._focusOnEditor.bind(this)

      const textarea = this.$(".en-code-mirror-textarea")[0]
      const {  mode, readOnly, autoFocus } = getProperties(
        this, 'mode', 'readOnly', 'autoFocus'
      )

      this._codemirror = CodeMirror(textarea, {
        mode: mode,
        readOnly: readOnly,
        autoFocus: autoFocus,
        lineNumbers: true
      })

      this._listenToChanges()
      this._updateEditorValue()

      if (autoFocus) this._focusOnEditor()
    })
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
    const codemirror = this._codemirror
    if (!codemirror) return

    codemirror.setOption("mode", mode)
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

  _checkModeCompatibility () {
    const mode = get(this, 'mode')
    const modes = get(this, 'modes')

    if (!modes.includes(mode)) {
      warn('[en-code-mirror] The mode you specified is not available.')
      return
    }
  },

  _updateEditorValue () {
    const codemirror = this._codemirror
    if (!codemirror) return

    let value = this.getAttr('value')
    if (isEmpty(value)) value = ''

    let cursor = codemirror.getCursor()
    codemirror.setOption("value", value)
    codemirror.setCursor(cursor)
  },

  init () {
    this._super(...arguments)
    this._checkModeCompatibility()
    this._updateEditorValue()
  },

  didReceiveAttrs () {
    this._checkModeCompatibility()
    this._updateEditorValue()
  },

  actions: {
    changeMode (mode) {
      const id = get(mode, 'id')

      set(this, 'mode', id)
      this._changeEditorMode(id)
      this._focusOnEditor()
    }
  }
});
