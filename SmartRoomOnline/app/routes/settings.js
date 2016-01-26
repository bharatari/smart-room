import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return Ember.RSVP.hash({
			temperatureMax: this.store.queryRecord('setting', { filter: { key: 'temperatureMax' } }),
			temperatureMin: this.store.queryRecord('setting', { filter: { key: 'temperatureMin' } }),
			humidityMax: this.store.queryRecord('setting', { filter: { key: 'humidityMax' } }),
			humidityMin: this.store.queryRecord('setting', { filter: { key: 'humidityMin' } }),
			displayFahrenheit: this.store.queryRecord('setting', { filter: { key: 'displayFahrenheit' }})
		});
	},
	setupController(controller, model) {
		if (model.temperatureMax.length === 0) {
			let setting = this.store.createRecord('setting', {
				key: 'temperatureMax'
			});
			setting.save();
			controller.set('temperatureMax', setting);
		} else {
			controller.set('temperatureMax', model.temperatureMax);
		}
		if (model.temperatureMin.length === 0) {
			let setting = this.store.createRecord('setting', {
				key: 'temperatureMin'
			});
			setting.save();
			controller.set('temperatureMin', setting);
		} else {
			controller.set('temperatureMin', model.temperatureMin);
		}
		if (model.humidityMax.length === 0) {
			let setting = this.store.createRecord('setting', {
				key: 'humidityMax'
			});
			setting.save();
			controller.set('humidityMax', setting);
		} else {
			controller.set('humidityMax', model.humidityMax);
		}
		if (model.humidityMin.length === 0) {
			let setting = this.store.createRecord('setting', {
				key: 'humidityMin'
			});
			setting.save();
			controller.set('humidityMin', setting);
		} else {
			controller.set('humidityMin', model.humidityMin);
		}
		if (model.displayFahrenheit.length === 0) {
			let setting = this.store.createRecord('setting', {
				key: 'displayFahrenheit'
			});
			setting.save();
			controller.set('displayFahrenheit', setting);
		} else {
			controller.set('displayFahrenheit', model.displayFahrenheit);
		}
	}
});
