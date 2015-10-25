module.exports = {
    tableName: 'settings',
    schema: true,
    attributes: {
        userId: {
            type: 'string'
        },
        key: {
            type: 'string'
        },
        value: {
            type: 'json'
        }
    }
};
