// Use Node’s HTTP module.
var http = require('http');

// An array of host configs.
var hostConfig = [];

// The function that will be called on new requests.
var requestListener = function (request, response) {
	// Find a matching host definition.
	var host = retrieveMatchingHost(request.headers.host);
	if (!host) {
		// TODO: Error handling.
	}
	var bind = retrieveMatchingBind(host, request.method, request.url);
	if (!bind) {
		// TODO: Error handling.
	}
	// Call the callback.
	bind.callback(request, response);
};

// Find a host in hostsConfig or return null.
var retrieveHostConfig = function (name) {
	var length = hostConfig.length;
	// Iterate over the hosts and find one that has the same name RegExp.
	for (var idx = 0; idx < length; idx++) {
		if (hostConfig[idx].name.toString() === name.toString()) {
			return hostConfig[idx];
		}
	}
	return null;
};

// Given a host config, HTTP method and path, find a matching bind.
var retrieveMatchingBind = function (host, method, path) {
	var length = host.binds.length;
	// Iterate over the binds and find the first with matching definition.
	for (var idx = 0; idx < length; idx++) {
		var bind = host.binds[idx];
		if (bind.method.test(method) && bind.path.test(path)) {
			return bind;
		}
	}
	return null;
};

// Given a “Host:” header, find a host definition that matches it.
var retrieveMatchingHost = function (host) {
	var length = hostConfig.length;
	// Iterate over the hosts and find the first with a matching name RegExp.
	for (var idx = 0; idx < length; idx++) {
		var config = hostConfig[idx];
		if (config.name.test(host)) {
			return config;
		}
	}
	return null;
};

// Convert a string to an anchored RegExp, escaping all special characters.
// If it already is a RegExp, return itself.
var verbatimRegExp = function (text, anchored) {
	if (typeof anchored === 'undefined') {
		anchored = true;
	}
	return text.test ? text : new RegExp(
		(anchored ? '^' : '') + text.replace(/[$*+?.()^\\{}|\]\[]/g, '\\$&') + (anchored ? '$' : '')
	);
};



/////  E X P O R T S  /////



// Set up a new or return an existing vhost.
var host = exports.host = function (name) {
	// If name is not a RegExp, make it one.
	if (!name.test) {
		// If there’s no port number, match all of them.
		var portmatch = name.match(/:/) ? '' : ':[0-9]+';
		name = new RegExp('^' + verbatimRegExp(name, false).toString().replace(
			/^\/(.*)\/$/, '$1'
		) + portmatch + '$');
	}
	// Try to find an existing config.
	var config = retrieveHostConfig(name);
	if (!config) {
		// None was found, create a new one.
		config = {
			binds: [],
			name: name
		};
		// Add it to the config array.
		hostConfig.push(config);
	}
	// Bind a new request handler.
	// path: a RegExp or String that will be matched against the request path
	// method: a RegExp or String that will be matched against the HTTP method
	// callback: a Function that will be called on a matching request
	var bind = function (path, method, callback) {
		// If path or method are no RegExps, make them one.
		path = verbatimRegExp(path);
		method = verbatimRegExp(method);
		config.binds.push({
			path: path,
			method: method,
			callback: callback
		});
	};
	return {
		bind: bind
	};
};

// Set up a listener on a new port.
var listen = exports.listen = function (port) {
	var httpServer = http.createServer(requestListener);
	httpServer.listen(port);
};
