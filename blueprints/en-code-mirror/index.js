module.exports = {
  afterInstall: function() {
    return this.addBowerPackagesToProject([
      { name: 'codemirror', target: '5.5.0' },
    ]);
  },

  normalizeEntityName: function() {
  }
};
