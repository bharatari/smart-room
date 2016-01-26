import Ember from 'ember';

export default Ember.Controller.extend({
	displayModal(title, body) {
		this.set('modalBody', body);
		this.set('modalTitle', title);
		this.set('modalDisplay', true);	
	},
	actions: {
		update() {
			var self = this;
			this.get('temperatureMax').save().then(
				this.get('temperatureMin').save()
			).then(
				this.get('humidityMax').save()
			).then(
				this.get('humidityMin').save()
			).then(
				this.get('displayFahrenheit').save()
			).then(function() {
				self.displayModal("Success", "Your settings were updated.");
			}).catch(function() {
				self.displayModal("Whoops", "Something went wrong there, check that your values are valid.");
			});
		},
		goToIndex() {
			this.transitionToRoute('index');
		}
	}
});
