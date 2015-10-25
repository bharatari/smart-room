import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return Ember.RSVP.hash({
			maxTemperature: this.store.queryRecord('setting', { filter: { key: 'maxTemperature' } }),
			minTemperature: this.store.queryRecord('setting', { filter: { key: 'minTemperature' } }),
			maxHumidity: this.store.queryRecord('setting', { filter: { key: 'maxHumidity' } }),
			minHumidity: this.store.queryRecord('setting', { filter: { key: 'minHumidity' } })
		});
	},
	setupController(controller, model) {
		controller.set('maxTemperature', model.maxTemperature);
		controller.set('minTemperature', model.minTemperature);
		controller.set('maxHumidity', model.maxHumidity);
		controller.set('minHumidity', model.minHumidity);
	}
});
