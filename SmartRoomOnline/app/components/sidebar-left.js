/* global io */
import Ember from "ember";
import config from 'smart-room-online/config/environment';
import windowsUtils from 'smart-room-online/utils/windows-utils';

export default Ember.Component.extend({ 
	tagName: 'div',
	classNames: ['sidebar-left', 'column', 'col-md-2'],
	didInitAttrs() {
        let self = this;

        io.socket.get(
            config.routeLocation + "/api/notifications/subscribe"
        );
        io.socket.on('notification', function(message) {
            if(message) {
                let notifications = self.get('notifications');
                notifications.pushObject(message.data);
                windowsUtils.notify(message.data.body);
                self.set('notifications', notifications);
            }
        });   
        io.socket.on('connect', function() {
            io.socket.get(
                config.routeLocation + "/api/notifications/subscribe"
            );
        });
    },
	notifications: []
});
