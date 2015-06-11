var discoverError = require('./error.js');
var https = require("https");
var syncHttp = require("urllib-sync")
var querystring = require("querystring");
var utils = require('./utils.js');

var config = {
	host: "api.elvanto.com",
	port: 443,
	method: "post",
	headers: {}
}

var options = null

// <overview> HTTP post request </overview>
var post = function(path, data, callback){
	return callback ? request(path, data, callback) : syncRequest(path, data)
}

// <overview> Make an api call to Elvanto endpoint </overview>
// @param [String] resource Path to Elvanto endpoint
// @param [Object] data
// @param [Function] callback. If callback is not present, then call will be synchronous
// @return [Object] response body
var apiCall = function(resource, data, callback){
	options = config;
	options["headers"]["Content-Type"] = "application/json";
	return post(resource, JSON.stringify(data || {}), callback)
}


// <overview> Retrieve tokens </overview>
// @param [Object] data
// @param [Function] callback. If callback is not present, then call will be synchronous
// @return [Object] {access_token: accessToken, expiresIn, refreshToken}
var retrieveTokens = function(data, callback){
	options = config;
	options["headers"]["Content-Type"] = "application/x-www-form-urlencoded";
	return post("/oauth/token", querystring.stringify(data || {}), callback)
}


// <overview> Asynchronous request </overview>
var request = function(path, data, callback){
	options["path"] = path;
	
	var request = https.request(options, function (response) {
		var payload = ""
	    response.on('data', function(chunk){
	        payload += chunk;
	    });
		response.on('end', function() {
			body = payload ? JSON.parse(payload) : {} ;

			// Throws an exception if error found
			discoverError(response.statusCode, body);

			callback(body);
	  	});
	});
	request.on('error', function (error) {
    	console.log(error.message);
	});

	request.write(data);		
	request.end();	

	return request;
}

// <overview> Synchronous request </overview>
var syncRequest = function(path, data, callback){
	var url = utils.buildURL("https", options["host"], path);
	options["data"] = data;
	options["dataType"] = "json";
	options["timeout"] = 20000;
	
	var response = syncHttp.request(url, options);
	var body = response.data;

	// Throws an exception if error found
	discoverError(response.statusCode, body);

	return body;
}

module.exports = {
	config: config,
	apiCall: apiCall,
	retrieveTokens: retrieveTokens
}

