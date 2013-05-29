var http = require('http'),
	utils = require('../../lib/utils');

var server_api = {
	host: 'localhost',
	port: 7002
};

// -----
// ENUMS
// -----

var localStrategyEnum = {
	INDIFFERENT: 0,
	ROUND_ROBIN: 1,
	SERVER_LOAD: 2
};

var cloudStrategyEnum = {
	INDIFFERENT: 0,
	ROUND_ROBIN: 1,
	CHEAPEST: 2,
	CLOUD_LOAD: 3
};

var stateEnum = {
	READY: 0,
	UNAVAILABLE : 1
};

// ----
// APPS
// ----

var apps = [
{
	appId: 1,
//	localStrategy: localStrategyEnum.INDIFFERENT,
//	cloudStrategy: cloudStrategyEnum.ROUND_ROBIN,
	localStrategyEvents : {
		'42374897259':{
			localStrategy : localStrategyEnum.INDIFFERENT,
			timestamp : 42374897259
		},
		'42374897240':{
			localStrategy : localStrategyEnum.INDIFFERENT,
			timestamp : 42374897240
		}
	},
	cloudStrategyEvents : {
		'42374897239':{
		cloudStrategy : cloudStrategyEnum.ROUND_ROBIN,
		timestamp : 42374897239
		}
	},
	servers : [
	{
		server: 'http://server1/app',
		status: {
			state: stateEnum.READY, //Current state of the server
			cpuLoad: 50, //Cpu load of the server 0-100
			memLoad: 50, //Memory load of the server 0-100
			timeStamp: 42374897239, //UTC time stamp of this info
			stateEvents: [{
				state: stateEnum.READY, //Future state of the serve
				applyTimeStamp: 42374897239 //UTC time stamp of this info
			}]
		}
	},
	{
		server: 'http://server2/app',
		status: {
			state: stateEnum.READY, //Current state of the server
			cpuLoad: 50, //Cpu load of the server 0-100
			memLoad: 50, //Memory load of the server 0-100
			timeStamp: 42374897239, //UTC time stamp of this info
			stateEvents: [{
				state: stateEnum.READY, //Future state of the serve
				applyTimeStamp: 42374897239 //UTC time stamp of this info
			}]
		}
	},
	{
		server: 'http://server3/app',
		status: {
			state: stateEnum.READY, //Current state of the server
			cpuLoad: 50, //Cpu load of the server 0-100
			memLoad: 50, //Memory load of the server 0-100
			timeStamp: 42374897239, //UTC time stamp of this info
			stateEvents: [{
				state: stateEnum.READY, //Future state of the serve
				applyTimeStamp: 42374897239 //UTC time stamp of this info
			}]
		}
	}
	]
},
{
	appId: 2
}
];

// -----
// TESTS
// -----
function main(){
	for(var appIdx in apps){
		var app = apps[appIdx];
		registerApp(app, registerEnd);
	}
}

// Registering apps
var registered = 0;
function registerApp(app, cbk){
	registered++;
	var data = {
		app : {
			localStrategyEvents : app.localStrategyEvents,
			cloudStrategyEvents : app.cloudStrategyEvents,
			servers: app.servers
		}
	};

	utils.httpPost('http://'+server_api.host+':'+server_api.port+'/app/'+app.appId, data ,function(status, data){
		if(status == 200){
			console.log('OK: App '+app.appId+' register');
		} else {
			console.log('FAIL: App '+app.appId+' register');
		}
		registered--;
		if(registered === 0){
			cbk();
		}
	});
}

function registerEnd(){
	getAllApps(getAllEnd);
}

// Getting all apps
function getAllApps(cbk){

	utils.httpGet('http://'+server_api.host+':'+server_api.port+'/app', function(status, data){
		if(status === 200){
			data = JSON.parse(data);
			var found = 0;
			for(var appIdx in apps){
				var app = apps[appIdx];

				for(var dataIdx in data){
					var dataApp = data[dataIdx];
					if(app.appId == dataApp.appId){
						found++;
						break;
					}
				}
			}

			if(found == apps.length) {
				console.log('OK: get all apps');
			} else {
				console.log('FAIL: get all apps');
			}

		} else {
			console.log('FAIL: get all apps');
		}

		cbk();
	});
}

function getAllEnd(){
	removeServers();
}

// Removing a server from app
function removeServers(){
	var app = apps[0];
	app.servers.shift();

	var data = {
		app : {
			localStrategyEvents : app.localStrategyEvents,
			cloudStrategyEvents : app.cloudStrategyEvents,
			servers: app.servers
		}
	};

	utils.httpPost('http://'+server_api.host+':'+server_api.port+'/app/'+app.appId, data ,function(status, data){
		if(status == 200){
			console.log('OK: remove server from app');
		} else {
			console.log('FAIL: remove server from app');
		}
		registered--;
		if(registered === 0){
			cbk();
		}
	});
}

main();
