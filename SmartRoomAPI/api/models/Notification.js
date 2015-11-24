module.exports = {
    tableName: 'settings',
    schema: true,
    attributes: {
        deviceId: {
            type: 'string'
        },
        title: {
            type: 'string'
        },
        body: {
            type: 'json'
        }
    }
};
