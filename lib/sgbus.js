// This script checks the bus checks bus 55 incoming time 
// and play via the speaker attached

// Dependencies:
//  child_process - for calling shell script
//	request - for serving API

var request 		= require('request');
var fs 				= require('fs');
var moment 			= require('moment');
var child_process 	= require('child_process');
var async			= require('async');

var CONFIG_FILE_PATH = './config/config.json.local';
var config = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH));
var proc = null;
var exports = module.exports = {};

exports.getBusTime = function (bus_stop_id, bus_id, callback){
	var options = {
		url: 'http://datamall2.mytransport.sg/ltaodataservice/BusArrival?BusStopID='+bus_stop_id.toString()+'&ServiceNo='+bus_id.toString(),
		headers: {
			'AccountKey': config.secrets.LTA.AccountKey,
			'UniqueUserId': config.secrets.LTA.UniqueUserID,
			'accept':'application/json'
		}
	};
	request(options, function(error, response, body){
		if(!error && response.statusCode == 200){
			var info = JSON.parse(body);
			// console.log(body);
			var bus = {
				'id': info.Services[0].ServiceNo,
				'status': info.Services[0].Status,
				'next': Math.floor((moment(info.Services[0]['NextBus']['EstimatedArrival']).unix() - moment().unix())/60),
				'subsequent': Math.floor((moment(info.Services[0]['SubsequentBus']['EstimatedArrival']).unix() - moment().unix())/60)
			};
			return (callback && callback(null, bus));
		}else{
			return (callback && callback(error));
		}
	});
}

exports.getBusTimeAtBusStop = function(bus_stop_id, callback){
	var arriving_buses = [];
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
			for(var i=0;i<info.Services.length;i++){
				var bus = {
					'id': info.Services[i].ServiceNo,
					'status': info.Services[i].Status,
					'next': Math.floor((moment(info.Services[i]['NextBus']['EstimatedArrival']).unix() - moment().unix())/60),
					'subsequent': Math.floor((moment(info.Services[i]['SubsequentBus']['EstimatedArrival']).unix() - moment().unix())/60)
				};
				arriving_buses.push(bus);
			}
			return (callback && callback(null, arriving_buses));
		}else{
			return (callback && callback(error));
		}
	});
}

exports.getBusTimeAtFavoriteBusStops = function(bus_stop_ids, callback){
	var arriving_buses = [];
	async.each(bus_stop_ids, function(bus_stop_id, callback){
		exports.getBusTimeAtBusStop(bus_stop_id, function(err, each_arriving_buses){
			if(err){
				callback(err);
			}else{
				for(var i=0;i<each_arriving_buses.length;i++){
					arriving_buses.push(each_arriving_buses[i]);
				}
				callback(null);
			}
		});		
	}, function(err){
		if(err){
			throw err;
		}else{
			arriving_buses.sort(function(a,b){
				if(a.next != b.next){
					return a.next - b.next;
				}else{
					return a.subsequent - b.subsequent;
				}				
			});
			// console.log(JSON.stringify(arriving_buses));
			return (callback && callback(null, arriving_buses));
		}
	});
}

exports.getFavoriteBusTime = function(favorite_buses, callback){
	var arriving_buses = [];
	async.each(favorite_buses, function(favorite_bus, callback){
		exports.getBusTime(favorite_bus.bus_stop_id, favorite_bus.bus_id, function(err, bus_timing){
			if(err){
				callback(err);
			}else{
				arriving_buses.push(bus_timing);
				callback(null);
			}
		});		
	}, function(err){
		if(err){
			throw err;
		}else{
			arriving_buses.sort(function(a,b){
				return a.next - b.next;
			});
			console.log(JSON.stringify(arriving_buses));

			return (callback && callback(null, arriving_buses));
		}
	});
}

exports.speak = {
	bustime: function(bus_stop_id, bus_id, callback){
		exports.getBusTime(bus_stop_id, bus_id, function(err, bus_time){
			if(err){
				var sentence = 'I am so Sorry! Seems like we could not get a meaningful timing for Bus '+bus_time.id + 'right now. Please try again later.'
			}else{
				var greetings = 'Good ';
				if(moment().hour() < 12){
					greetings = greetings + 'Morning, ';
				}else if(moment().hour() < 18){
					greetings = greetings + 'Afternoon, ';
				}else{
					greetings = greetings + 'Evening, ';
				}
				if(bus_time.next != null){
					if(bus_time.next > 0){
						var sentence = greetings +'Bus '+bus_time.id+' is '+bus_time.status+' and arriving in '+bus_time.next+' minutes. Next one is '+bus_time.subsequent+' minutes away';
					}else{
						var sentence = greetings +'Bus '+bus_time.id+' is '+bus_time.status+' and arriving now. ' + 'Next one will arrive '+bus_time.subsequent+' minutes later.';
					}				
				}else{
					var sentence = 'I am so Sorry! Seems that we could not get a meaningful timing for Bus '+bus_time.id + 'right now. Please try again later.'
				}
			}			
			proc = child_process.execFile('./bin/speech.sh', [sentence], function(error, stdout, stderr){
				// console.log(proc);
				if(error){
					return (callback && callback(error))
				}
				return (callback && callback(null, sentence, bus_time));
			});
		});
	},
	favoritebustime: function(favorite_buses, callback){
		exports.getFavoriteBusTime(favorite_buses, function(err, arriving_buses){
			if(err){
				var sentence = 'I am so Sorry! Seems like we could not get a meaningful timing for your favourite buses right now. Please try again later.';
			}else{
				var greetings = 'Good ';
				if(moment().hour() < 12){
					greetings = greetings + 'Morning, ';
				}else if(moment().hour() < 18){
					greetings = greetings + 'Afternoon, ';
				}else{
					greetings = greetings + 'Evening, ';
				}
				var sentence = greetings;
				var counter = 0;
				for(var i=0;i<arriving_buses.length;i++){
					if(arriving_buses[i].next != null){
						if(arriving_buses[i].next > 0){
							sentence = sentence +'Bus '+arriving_buses[i].id+' is '+arriving_buses[i].status+' and arriving in '+arriving_buses[i].next+' minutes. Next one is '+arriving_buses[i].subsequent+' minutes away. ';
						}else{
							sentence = sentence +'Bus '+arriving_buses[i].id+' is '+arriving_buses[i].status+' and arriving now. ' + 'Next one will arrive '+arriving_buses[i].subsequent+' minutes later. ';
						}	
						counter = counter + 1;
					} 
				}
				if(counter === 0){
					sentence = 'I am so Sorry! Seems like we could not get a meaningful timing for your favourite buses right now. Please try again later.';
				}
			}						
			proc = child_process.execFile('./bin/speech.sh', [sentence], function(error, stdout, stderr){
				// console.log(proc);
				if(error){
					return (callback && callback(error))
				}
				return (callback && callback(null, sentence, arriving_buses));
			});
		})
	}
}