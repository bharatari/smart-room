import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		update() {
			this.get('temperatureMax').save();
			this.get('temperatureMin').save();
			this.get('humidityMax').save();
			this.get('humidityMin').save();
		}
	}
});
