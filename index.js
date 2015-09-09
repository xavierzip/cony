var later	= require('later');
var fs		= require('fs');

var sgbus 	= require('./lib/sgbus.js');

var CONFIG_FILE_PATH = './config/config.json.local';

var config = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH));

later.date.localTime();

var check_bus_schedule = later.parse.recur().on(config.features.bus.schedule.local_time.hour).hour().on(config.features.bus.schedule.local_time.minute).minute();


var bus_timer = later.setInterval(announceBusTime, check_bus_schedule);

function announceBusTime(){
	sgbus.speak.favoritebustime(config.features.bus.favorite_buses)
}