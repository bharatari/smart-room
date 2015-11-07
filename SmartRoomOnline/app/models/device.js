import DS from 'ember-data';

export default DS.Model.extend({
    deviceId: DS.attr('string'),
    name: DS.attr('string'),
    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date')
});
