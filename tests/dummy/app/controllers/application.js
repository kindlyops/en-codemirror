import Em from 'ember'

export default Em.Controller.extend({
  actions: {
    onChange (val) {
      console.log(val);
    }
  }
})
