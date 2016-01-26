# Smart Room
A web server and web app client designed to recieve, process and display data coming from a Raspberry Pi. This project was initially inspired by a project I made for my CS1200 Raspberry Pi Group project, but I since rewrote and restructured the application to be modular, secure and reliable.

# About the Project

This project contains three primary components, a Node.js server (using the Sails.js framework), an Ember.js web app client and a C# Windows Universal App running on a Raspberry Pi. We also have an additional Windows Universal App written in C# designed to run on Windows 10 PCs and phones to register Cortana voice commands that can communicate with and return data from our server.

The server of this project was designed to be entirely RESTFul while following the JSON API 1.0 specification, to ensure a consistent server API that can be easily consumed by our Ember.js client (that runs the Ember Data data persistence layer). The server is built on Node.js with the Sails.js framework. Our database is a MongoDB database.

The server and web app are currently hosted at smartroom-55120.onmodulus.net. This is the server all other components of our applications connect to.

# Features

* JSON API-compliant server for easy integration with data
persistence libraries such as Ember Data
* Live updating web app client
* Live notifications
* Cortana voice command integration

# Components

* Sails.js Server (SmartRoomAPI)
    - Connected to MongoDB Database
* Ember.js Client (SmartRoomOnline)
* Raspberry Pi Client written in C# (Universal Windows App) (SmartRoomClient)
* Universal Windows App in C# (SmartRoomApp)
    - A native web wrapper around our web interface
    - Cortana Integration
    
Only web-related components are available in this repository. Our C# Raspberry Pi application is in a different repository.

# Code

## Server

Our server runs on Node.js and uses the Sails.js MVC framework. Our Sails.js project comes with a large set of configuration files. Our actual code exists in `/api/controllers`, `/api/models`, `/api/services` and `/config/bootstrap.js`. Code in the `bootstrap.js` file registers a scheduled task that runs every minute to check for notifications to send.
URL
### Async Code Style

Callbacks for our own async functions are written as such:

    function(err, result) {
        if (err || !result) {
            // An error occurred.
        } else {
            // Success
        }   
    }

Assuming the callback is passed to another function as `cb` a success callback call would look like `cb(null, some_truthy_value)`, setting the error parameter to a falsy value and the result parameter to some truthy value. An error callback call would look like `cb(some_truthy_value)`, setting the error parameter to a truthy value and by default setting the result parameter to a falsy (null) value.

## Client

Our client uses the Ember.js MVC framework and the Ember Data data persistence library. Our Ember.js project also comes with configuration and scaffolding files. Our actual code exists in `/app`. Code in here includes HTML templates, CSS and JavaScript. 

## Raspberry Pi Client 

Our client is a Universal Windows App in C#, and it runs on our Pi through Windows IoT Core.

### Drivers
We use drivers for our TSL2561 Light Sensor and our HDC1008 Temperature & Humidity Sensor. These drivers were written specifically for Windows IoT Core and the code was available on GitHub. The repository URLs are listed at the top of the driver files. We also have two classes that abstract these drivers to be easier to use, called Temperature and Light.

These is also a class called Connection which abstracts sending data to our server into easy-to-use methods.

### DataModel

The DataModel folder mostly contains classes to serialize data into appropriately formatted JSON. Our server follows the JSON API 1.0 specification, which defines a structure for requests and responses to and from the server.

The Utility class is a static helper class that has methods that process data. One of the methods is a simple algorithm to detect whether detected values are different enough to send to the server using defined thresholds.

## Universal Windows App 

The Universal Windows App doesn't have any functionality within itself. It simply acts as a native wrapper around our web app. It also registers a background task and voice commands for use with Cortana on Windows 10. Whereever this app is installed, you can ask Cortana to get any type of data that our Pi collects, and she will get the data from our web server and return it to you.

### SmartRoomApp

This project contains very simple code to setup the WebView needed to display our webapp. It also contains a Commands.vcd file that registers our voice commands with Cortana.

### VoiceService

This project contains the background task that handles our Cortana commands. It gets data from our server and formats it for Cortana to display. Most of the code was borrowed from Windows 10 Cortana API documentation, however, there is a substantial amount of our own code that handles getting data from our server, deserializing it, processing it and finally displaying it.