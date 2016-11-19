import Ember from 'ember';

const {
  get,
  set,
  computed,
  on,
  run,
  getProperties,
  setProperties,
  getWithDefault,
  Logger,
  String,
  isEmpty,
  Component
} = Em

const { warn } = Logger
const { capitalize } = String

export default Component.extend({
  classNames: ['en-code-mirror'],

  modes: Em.A([
    Em.Object.create({ id: 'javascript', mode: 'javascript', label: 'JavaScript' }),
    Em.Object.create({ id: 'text/x-java', mode: 'clike', label: 'Java' }),
    Em.Object.create({ id: 'text/csrc', mode: 'clike', label: 'C' }),
    Em.Object.create({ id: 'text/c++src', mode: 'clike', label: 'C++' }),
    Em.Object.create({ id: 'html', mode: 'htmlmixed', label: 'HTML' }),
    Em.Object.create({ id: 'css', mode: 'css', label: 'CSS' }),
    Em.Object.create({ id: 'php', mode: 'php', label: 'PHP' }),
    Em.Object.create({ id: 'python', mode: 'python', label: 'Python' }),
    Em.Object.create({ id: 'ruby', mode: 'ruby', label: 'Ruby' }),
    Em.Object.create({ id: 'go', mode: 'go', label: 'Go' }),
    Em.Object.create({ id: 'rust', mode: 'rust', label: 'Rust' }),
    Em.Object.create({ id: 'swift', mode: 'swift', label: 'Swift' })
  ]),

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
      const { mode, readOnly, autoFocus } = getProperties(
        this, 'mode', 'readOnly', 'autoFocus'
      )

      CodeMirror.modeURL = `https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.20.2/mode/%N/%N.min.js`

      this._codemirror = CodeMirror.fromTextArea(textarea, {
        readOnly: readOnly,
        autoFocus: autoFocus,
        lineNumbers: true
      })

      this._changeEditorMode(mode)

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

  _changeEditorMode (id, mode) {
    const codemirror = this._codemirror
    if (!codemirror) return

    CodeMirror.autoLoadMode(codemirror, mode)
    codemirror.setOption("mode", id)

    console.info(`[en-code-mirror] Mode now set to ${mode}`)
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
    const modeName = get(this, 'mode')
    const modes = get(this, 'modes')

    if (modes.find(mode => get(mode, 'id') === modeName) === -1) {
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
    changeMode (option) {
      const id   = get(option, 'id')
      const mode = get(option, 'mode')

      set(this, 'mode', mode)
      this._changeEditorMode(id, mode)
      this._focusOnEditor()
    }
  }
});
