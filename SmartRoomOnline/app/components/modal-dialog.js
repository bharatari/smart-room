/* global $ */
import Ember from "ember";

export default Ember.Component.extend({
	didInsertElement() {
		$('#' + this.elementId + ' .modal').modal({
            backdrop: 'static',
            keyboard: false,
            show: false
        });
	},
    displayModalChanged: Ember.observer('displayModal', function() {
        if(this.get('displayModal')) {
            $('#' + this.elementId + ' .modal').modal('show');
        }
        else {
            $('#' + this.elementId + ' .modal').modal('hide');
        }
    }),
    actions: {
        close() {
            this.set('displayModal', false);
        }
    }
});