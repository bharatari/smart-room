import Ember from "ember";
import valueUtils from 'smart-room-online/utils/value-utils';

export default Ember.Component.extend({ 
	tagName: 'div',
	classNames: ['data-column', 'column'],
	classNameBindings: ['large:col-md-3:col-md-2', 'backgroundColor'],
	processedValue: Ember.computed('name', 'result', 'custom', 'suffix', function() {
		return valueUtils.processResult(this.get('name'), this.get('result'), this.get('custom'), this.get('suffix'), this.get('displayFahrenheit'));
	})
});
