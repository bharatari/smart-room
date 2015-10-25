import DS from 'ember-data';
import Inflector from 'ember-inflector';
import {singularize, pluralize} from 'ember-inflector';

export default DS.Model.extend({
    id: DS.attr('string'),
    deviceId: DS.attr('string'),
    name: DS.attr('string'),
    value: DS.attr(),
    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date')
});

Inflector.inflector.uncountable('data');
