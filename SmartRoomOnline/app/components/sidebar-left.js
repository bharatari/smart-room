/* global io */
import Ember from "ember";
import config from 'smart-room-online/config/environment';

export default Ember.Component.extend({ 
	tagName: 'div',
	classNames: ['sidebar-left', 'column', 'col-md-2'],
	didInitAttrs() {
        let self = this;

        io.socket.get(
            config.routeLocation + "/api/notifications/subscribe"
        );
        io.socket.on('new notifications', function(message) {
            if(message) {
                let notifications = self.get('notifications');
                self.set('notifications', message);
                //notifications.pushObject(message.data);
                /*
                for(let i = 0; i < notifications.length; i++) {
                    windowsUtils.notify(notifications[i].body);
                }*/
                //self.set('notifications', notifications);
            }
        });   
        io.socket.on('connect', function() {
            io.socket.get(
                config.routeLocation + "/api/notifications/subscribe"
            );
        });
    },
	notifications: [],
    actions: {
        goToSettings() {
            this.sendAction('goToSettings');
        },
        goToIndex() {
            this.sendAction('goToIndex');
        }
    }
});
