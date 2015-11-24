import Ember from 'ember';
import valueUtils from 'smart-room-online/utils/value-utils';

export default Ember.Route.extend({
	// Get celcius/fahrenheit setting here
	// Stock GET request defaults to last active
	// device
	
	// You can pass deviceId as a filter parameter
	model() {
		return Ember.RSVP.hash({
			temperature: this.store.queryRecord('value', {
				filter: {
					name: 'temperature'
				},
				page: {
					number: 1,
					size: 1
				},
				sort: '-createdAt'
			}),
			humidity: this.store.queryRecord('value', {
				filter: {
					name: 'humidity'
				},
				page: {
					number: 1,
					size: 1
				},
				sort: '-createdAt'
			}),
			motion: this.store.queryRecord('value', {
				filter: {
					name: 'motion'
				},
				page: {
					number: 1,
					size: 1
				},
				sort: '-createdAt'
			}),
			light: this.store.queryRecord('value', {
				filter: {
					name: 'light'
				},
				page: {
					number: 1,
					size: 1
				},
				sort: '-createdAt'
			})
		});
	},
	setupController(controller, model) {
		// Throws error when no record exists for one of the types of values, _data of undefined
		let configuration = valueUtils.processInitial(this.get('configuration'), model.temperature._internalModel._data, model.humidity._internalModel._data, model.motion._internalModel._data, model.light._internalModel._data);
		controller.set('configuration', configuration);
	},
	configuration: valueUtils.configuration
});
