/* jslint unused: false */
import Ember from "ember";

export default Ember.Component.extend({
    tagName: 'li',
    classNames: ['flyout-notification'],
    classNameBindings: ['display:flyout-visible:flyout-invisible'],
    didInitAttrs: function() {
        if(this.get('display') == null) {
            this.set('display', true);
        }
    },
    didInsertElement: function() {
        var self = this;
        setTimeout(function() {
            //self.set('display', false);
        }, 20000);
    },
    display: Ember.computed('flyout', {
        get(key) {
            return this.get('flyout').display; 
        },
        set(key, value) {
            Ember.set(this.get('flyout'), 'display', value);
            return value;
        }
    }),
    actions: {
        close: function() {
            this.set('display', false);
        }
    }
});