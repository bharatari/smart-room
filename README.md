# Smart Room
A web server and web app client designed to recieve, process and display data coming from a Raspberry Pi. This project is a collaboration between Bharat Arimilli, Jack Clark, Miguel De La Rocha, Danny Diep and James Linton for our CS1200 Raspberry Pi project at UT Dallas.

# About the Project

This project contains three primary components, a Node.js server (using the Sails.js framework), an Ember.js web app client and a C# Windows Universal App running on a Raspberry Pi. We also have an additional Windows Universal App written in C# designed to run on Windows 10 PCs and phones to register Cortana voice commands that can communicate with and return data from our server.

The server of this project was designed to be entirely RESTFul while following the JSON API 1.0 specification, to ensure a consistent server API that can be easily consumed by our Ember.js client (that runs the Ember Data data persistence layer). The server is built on Node.js with the Sails.js framework. Our database is a MongoDB database.

# Components

* Sails.js Server
    - Connected to MongoDB Database
* Ember.js Client
* Raspberry Pi Client in Universal Windows Platform C#
* Universal Windows Platform App in C#
    - A native web wrapper around our web interface
    - Cortana Integration
    
Only web-related components are available in this repository. Our C# Raspberry Pi application is in a different repository.

# Code

## Server

Our Sails.js project comes with a large set of configuration and scaffolding files. Our actual code exists in `/api/controllers`, `/api/models`, `/api/services` and `/config/bootstrap.js`.  Controllers were written by Bharat as they deal with HTTP and WebSocket requests. Code written by team members exists in `/api/services/UtilityService.js` and `/api/services/ValueService.js`.

### Async Code Style

Callbacks for our own async functions are written as such:

`
function(err, result) {
    if (err || !result) {
        // An error occurred.
    } else {
        // Success
    }
}
`
Assuming the callback is passed to another function as `cb` a success callback call would look like `cb(null, some_truthy_value)`, setting the error parameter to a falsy value and the result parameter to some truthy value. An error callback call would look like `cb(some_truthy_value)`, setting the error parameter to a truthy value and by default setting the result parameter to a falsy (null) value.

## Client

Our Ember.js project also comes with configuration and scaffolding files. Our actual code exists in `/app`. Code in here includes HTML templates, CSS and JavaScript. The majority of the client was written by Bharat, however, `/app/utils/value-utils.js` contains utility functions written by other team members.