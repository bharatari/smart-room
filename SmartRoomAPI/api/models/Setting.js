module.exports = {
    tableName: 'settings',
    schema: true,
    attributes: {
        deviceId: {
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
