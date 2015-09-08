// This script checks the bus checks bus 55 incoming time 
// and play via the speaker attached

// Dependencies:
//  child_process - for calling shell script
//	request - for serving API

var request 		= require('request');
var fs 				= require('fs');
var moment 			= require('moment');
var child_process 	= require('child_process');

var CONFIG_FILE_PATH = 'config.json';
var config = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH));
var proc = null;
var exports = module.exports = {};

exports.getBusTime = function (service_id, bus_stop_id, callback){
	var options = {
		url: 'http://datamall2.mytransport.sg/ltaodataservice/BusArrival?BusStopID='+bus_stop_id.toString()+'&ServiceNo='+service_id.toString(),
		headers: {
			'AccountKey': config.secrets.LTA.AccountKey,
			'UniqueUserId': config.secrets.LTA.UniqueUserID,
			'accept':'application/json'
		}
	};
	request(options, function(error, response, body){
		if(!error && response.statusCode == 200){
			var info = JSON.parse(body);
			return (callback && callback(null, info));
		}else{
			return (callback && callback(error));
		}
	});
}

exports.getAllBusTime = function(bus_stop_id, callback){
	var options = {
		url: 'http://datamall2.mytransport.sg/ltaodataservice/BusArrival?BusStopID='+bus_stop_id.toString(),
		headers: {
			'AccountKey': config.secrets.LTA.AccountKey,
			'UniqueUserId': config.secrets.LTA.UniqueUserID,
			'accept':'application/json'
		}
	};
	request(options, function(error, response, body){
		if(!error && response.statusCode == 200){
			var info = JSON.parse(body);
			return (callback && callback(null, info));
		}else{
			return (callback && callback(error));
		}
	});
}

exports.speak = {
	allbustime: function(bus_stop_id, callback){
		exports.getAllBusTime(bus_stop_id, function(err, info, callback){
			console.log(JSON.stringify(info));
			return (callback && callback());
		});
	},
	bustime: function(bus_stop_id, service_id, callback){
		if(proc != null){
			proc.kill('SIGTERM');
			proc == null;
		}
		exports.getBusTime(service_id, bus_stop_id, function(err, info, callback){
			if(err) throw err;
			console.log(JSON.stringify(info));
			// If there is any replied info
			if(info.Services.length > 0){
				var status = info.Services[0].Status;
				var next = Math.floor((moment(info.Services[0]['NextBus']['EstimatedArrival']).unix() - moment().unix())/60);
				var subsequent = Math.floor((moment(info.Services[0]['SubsequentBus']['EstimatedArrival']).unix() - moment().unix())/60);
				var greetings = 'Good ';
				if(moment().hour() < 12){
					greetings = greetings + 'Morning';
				}else if(moment().hour() < 18){
					greetings = greetings + 'Afternoon';
				}else{
					greetings = greetings + 'Evening';
				}
				var sentence = greetings +', Bus '+service_id+' is '+status+' and arriving in '+next+' minutes. Next one is '+subsequent+' minutes away';
				proc = child_process.execFile('./speech.sh', [sentence], function(error, stdout, stderr){
					if(error){
						return (callback && callback(error))
					}
					return (callback && callback(null, info));
				});
			}else{
				return (callback && callback(null, null));
			}
		});
	}
}