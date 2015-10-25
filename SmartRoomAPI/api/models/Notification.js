module.exports = {
    tableName: 'settings',
    schema: true,
    attributes: {
        userId: {
            type: 'string'
        },
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
