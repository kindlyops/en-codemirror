import Ember from 'ember';

const {
  get,
  set,
  inject,
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

  loader: inject.service('code-mirror-loader'),

  modes: Em.A([
    Em.Object.create({ id: 'javascript', label: 'JavaScript' }),
    Em.Object.create({ id: 'clike', label: 'Java' }),
    Em.Object.create({ id: 'clike', label: 'JavaScript' }),
    Em.Object.create({ id: 'clike', label: 'C' }),
    Em.Object.create({ id: 'clike', label: 'C++' }),
    Em.Object.create({ id: 'htmlmixed', label: 'HTML' }),
    Em.Object.create({ id: 'css', label: 'CSS' }),
    Em.Object.create({ id: 'php', label: 'PHP' }),
    Em.Object.create({ id: 'python', label: 'Python' }),
    Em.Object.create({ id: 'ruby', label: 'Ruby' }),
    Em.Object.create({ id: 'go', label: 'Go' }),
    Em.Object.create({ id: 'rust', label: 'Rust' }),
    Em.Object.create({ id: 'swift', label: 'Swift' }),
    Em.Object.create({ id: 'sql', label: 'SQL' }),
  ]),

  /**
   * @property isLoading
   * @type {Boolean}
   * @default false
   */
  isLoading: false,

  /**
   * @property isSimpleMode
   * @type {Boolean}
   * @default false
   */
  isSimpleMode: false,

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
      set(this, 'isLoading', true)

      this._listenToChanges = this._listenToChanges.bind(this)
      this._focusOnEditor = this._focusOnEditor.bind(this)

      const textarea = this.$(".en-code-mirror-textarea")[0]
      const { mode, readOnly, autoFocus } = getProperties(
        this, 'mode', 'readOnly', 'autoFocus'
      )

      let loader = get(this, 'loader')

      Promise
        .all([loader.loadJavascript(), loader.loadCSS()])
        .then(_ => {
          set(this, 'isLoading', false)

          this._codemirror = CodeMirror(textarea, {
            mode: mode,
            readOnly: readOnly,
            autoFocus: autoFocus,
            lineNumbers: true
          })

          this._listenToChanges()
          this._updateEditorValue()

          if (autoFocus) this._focusOnEditor()

        }).catch(err => {
          console.error(err)

          setProperties(this, {
            isLoading: false,
            isSimpleMode: true
          })
        })
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
    changeMode (mode) {
      const id = get(mode, 'id')

      get(this, 'loader').loadMode(id).then(() => {
        set(this, 'mode', id)
        this._changeEditorMode(id)
        this._focusOnEditor()
      })
    }
  }
});
