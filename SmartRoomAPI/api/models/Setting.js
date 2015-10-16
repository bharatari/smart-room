module.exports = {
    tableName: 'settings',
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
}