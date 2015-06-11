var querystring = require("querystring")


/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
var mergeOptions = function(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

var buildURL = function(schema, host, path, params){
	var url = schema + "://" + host + "/" + path;
	if(params){
		url = url + "?" + querystring.stringify(params)
	}

	return url
}

module.exports = {
	buildURL: buildURL,
	mergeOptions: mergeOptions
}