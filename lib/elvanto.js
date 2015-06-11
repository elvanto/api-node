// Node JS wrapper for Elvanto API.
// Can work in both asynchronous over synchronous mode

var utils = require('./utils.js');
var client = require('./client.js');

const DEFAULT_OPTIONS = {
	apiVersion: "/v1/",
	accept: "json"
};

var options = {};

// @params [Object] params. In case of Oauth athentication it is {accessToken: "accessToken"}.
// When authenticating with an API key it {apiKey: "apiKey"}
exports.configure = function(params){
	options = utils.mergeOptions(DEFAULT_OPTIONS, params);
	
	if (options["apiKey"]){
		client.config["auth"] = options["apiKey"] + ':x'
	}
	else if (options["accessToken"]){
		client.config["headers"] = {"Authorization": "Bearer " + options["accessToken"]}
	}
	else {
		throw new Error('You should provide either access token or API key');
	}

	return client.config;
};

// @params [String] clientId The Client ID of your registered OAuth application.
// @params [String] redirectUri The Redirect URI of your registered OAuth application.
// @params [String] scope
// @params [String] state Optional state data to be included in the URL.
// @return [String] The authorization URL to which users of your application should be redirected.
exports.authorizeUrl = function(clientId, redirectUri, scope, state){
	if (scope instanceof Array){
		scope = scope.join();	
	}

	params = {type: "web_server", client_id: clientId, redirect_uri: redirectUri, scope: scope}

	if (state) {
    	params["state"] = state;
  	}

  	return utils.buildURL("https", client.config["host"], "oauth", params)
};

// @params [String] clientId The Client ID of your registered OAuth application.
// @param [String] clientSecret The Client Secret of your registered OAuth application.
// @param [String] code The unique OAuth code to be exchanged for an access token.
// @param [String] redirectUrl The Redirect URI of your registered OAuth application.
// @param [function] callback. If callback is not present, then call will be synchronous 
// @return [Object] {access_token: accessToken, expiresIn, refreshToken}
exports.exchangeToken = function(clientId, clientSecret, code, redirectUri, callback){
	data = {"grant_type": 'authorization_code', "client_id": clientId, "client_secret": clientSecret, "code": code, "redirect_uri": redirectUri};
	return client.retrieveTokens(data, callback);
};

// @param [String] refreshToken Was included when the original token was granted to automatically retrieve a new access token.
// @param [Function] callback. If callback is not present, then call will be synchronous
// @return [Object] {access_token: accessToken, expiresIn, refreshToken}
exports.refreshToken = function(refreshToken, callback){
  	if (typeof refreshToken === 'undefined') 
    	throw new Error('Error refreshing token. There is no refresh token set on this object');

	data = {grant_type: "refresh_token", refresh_token: refreshToken};
	return client.retrieveTokens(data, callback);
}

// @param [String] resource
// @return [String] path to resource 
var resourcePath = function(resource){
	if (!options["apiVersion"] || !options["accept"]){
		throw new Error('Most probably you forgot to call configure function');
	}

	return options["apiVersion"] + resource + "." + options["accept"]
};

// @param [String] endPoint for example: "people/getAll" or "groups/GetInfo"
// @param [Object] option List of parametrs
// @param [Function] callback for response body. If callback is not present, then call will be synchronous
// @return [Object] response body
exports.apiCall = function(endPoint, data, callback){
	return client.apiCall(resourcePath(endPoint), data, callback);
}






