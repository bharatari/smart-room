module.exports = {
    tableName: 'settings',
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
}