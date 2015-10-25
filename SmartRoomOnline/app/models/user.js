import DS from 'ember-data';

export default DS.Model.extend({
    id: DS.attr('string'),
    username: DS.attr('string'),
    password: DS.attr('string'),
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date')
});
