import Em from 'ember'

const {
  get: get,
  set: set,
  computed,
  on
} = Em

export default Em.Controller.extend({
  value: `
    function () {
      updated: computed('value', function () {
      }),
    }
  `,

  updated: computed('value', function () {
  }),

  actions: {
    onChange (val) {
      set(this, 'value', val)
    }
  }
})
