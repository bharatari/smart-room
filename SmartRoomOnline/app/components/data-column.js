import Ember from "ember";
import dataUtils from 'smart-room-online/utils/data-utils';

export default Ember.Component.extend({ 
	tagName: 'div',
	classNames: ['data-column', 'column'],
	classNameBindings: ['large:col-md-4:col-md-3', 'backgroundColor'],
	processedValue: Ember.computed('name', 'value', 'custom', 'suffix', function() {
		return dataUtils.processValue(this.get('name'), this.get('value'), this.get('custom'), this.get('suffix'));
	})
});
