import Em from 'ember'

const {
  get: get,
  set: set,
  computed,
  on
} = Em

export default Em.Controller.extend({
  actions: {
    onChange (val) {
      set(this, 'value', val)
    }
  }
})
