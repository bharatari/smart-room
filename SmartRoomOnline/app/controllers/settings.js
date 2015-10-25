import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		update() {
			this.get('maxTemperature').save();
			this.get('minTemperature').save();
			this.get('maxHumidity').save();
			this.get('minHumidity').save();
		}
	}
});
