import DS from 'ember-data';

export default DS.Model.extend({
    id: DS.attr('string'),
    deviceId: DS.attr('string'),
    name: DS.attr('string'),
    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date')
});
