import Ember from 'ember';
import valueUtils from 'smart-room-online/utils/value-utils';

export default Ember.Helper.helper(function(params) {
	return valueUtils.processTemperatureUnits(params[0], params[1]);
});