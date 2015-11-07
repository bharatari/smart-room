import Ember from 'ember';
import valueUtils from 'smart-room-online/utils/value-utils';

export default Ember.Route.extend({
	model() {
		return Ember.RSVP.hash({
			temperature: this.store.queryRecord('value', {
				filter: {
					name: 'temperature'
				},
				page: {
					number: 1,
					limit: 1
				},
				sort: '-createdAt'
			}),
			humidity: this.store.queryRecord('value', {
				filter: {
					name: 'humidity'
				},
				page: {
					number: 1,
					limit: 1
				},
				sort: '-createdAt'
			}),
			motion: this.store.queryRecord('value', {
				filter: {
					name: 'motion'
				},
				page: {
					number: 1,
					limit: 1
				},
				sort: '-createdAt'
			})
		});
	},
	setupController(controller, model) {
		console.log(model.temperature);
		valueUtils.processInitial(this.get('configuration'), model.temperature, model.humidity, model.motion);
		controller.set('configuration', this.get('configuration'));
	},
	configuration: valueUtils.configuration
});
