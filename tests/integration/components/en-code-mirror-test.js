import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('en-code-mirror', 'Integration | Component | en code mirror', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{en-code-mirror}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#en-code-mirror}}
      template block text
    {{/en-code-mirror}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
