# SmartRoom

SmartRoomAPI is the server-side implementation of the SmartRoom project. It is written to be a RESTful API and follows the JSON API 1.0 specification.

# Development

Clone this repository and create a local.js file in your /config folder. 

Here is a sample of what your local.js file should look like:

    connections: {
        Mongo: {
            adapter: 'sails-mongo',
            host: 'example.database.com',
            port: 27017,
            user: 'dbuser',
            password: 'password',
            database: 'databaseName'
        }
    },

    session: {
        secret: 'random-string-goes-here'
    },

    jwtSecret: 'another-random-string-goes-here'
    


This file will allow to specify settings that won't be committed to the repository.
