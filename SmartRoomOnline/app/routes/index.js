import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return Ember.RSVP.hash({
			temperature: this.store.queryRecord('data', {
				filter: {
					name: 'temperature'
				},
				page: {
					number: 1,
					limit: 1
				},
				sort: '-createdAt'
			}),
			humidity: this.store.queryRecord('data', {
				filter: {
					name: 'humidity'
				},
				page: {
					number: 1,
					limit: 1
				},
				sort: '-createdAt'
			}),
			motion: this.store.queryRecord('data', {
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
		controller.set('temperature', model.temperature);
		controller.set('humidity', model.humidity);
		controller.set('motion', model.motion);
	}
});
