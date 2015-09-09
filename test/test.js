var expect	= require("chai").expect;
var sgbus	= require("../lib/sgbus.js");

describe("sgbus", function(){
	describe("#getBusTime", function(){
		it("should return an object of a bus timing", function(){
			var bus_stop_id = 92079;
			var bus_id = 55;
			sgbus.getBusTime(bus_stop_id, bus_id, function(err, bus_timing){
				expect(bus_timing).to.be.a('object');
				expect(bus_timing).to.have.property('id');
				expect(bus_timing).to.have.property('next');
				expect(bus_timing).to.have.property('status');
				expect(bus_timing).to.have.property('subsequent');
			});
		});
	});
	describe("#getFavoriteBusTime", function(){
		it("should return an array of buses with correct length and sorted by next arriving time", function(){
			var favorite_buses = [
				{
					"bus_stop_id": 92301,
					"bus_id": 15
				},
				{
					"bus_stop_id": 92079,
					"bus_id": 55
				},
				{
					"bus_stop_id": 92071,
					"bus_id": 31
				},
				{
					"bus_stop_id": 92071,
					"bus_id": 48
				}
			];
			sgbus.getFavoriteBusTime(favorite_buses, function(err, favorite_buses_arriving_time){
				expect(favorite_buses_arriving_time).to.be.a('array');
				expect(favorite_buses_arriving_time).to.have.length(4);
				for(var i=1;i<favorite_buses_arriving_time.length;i++){
					expect(buses_arriving_time[i]).to.have.property('next');
					expect(buses_arriving_time[i]).to.have.property('subsequent');
					expect(buses_arriving_time[i]).to.have.property('id');
					expect(buses_arriving_time[i]).to.have.property('status');
					expect(buses_arriving_time[i].status).not.equal(null);
					expect(favorite_buses_arriving_time[i].next).to.be.above(favorite_buses_arriving_time[i-1].next);
				}
			});
		});
	});
	describe("#getBusTimeAtBusStop", function(){
		it("should return an array of buses sorted by next arriving time", function(){
			var bus_stop = 92079;
			sgbus.getBusTimeAtBusStop(bus_stop, function(err, buses_arriving_time){
				expect(buses_arriving_time).to.be.a('array');
				for(var i=1;i<buses_arriving_time.length;i++){
					expect(buses_arriving_time[i]).to.have.property('next');
					expect(buses_arriving_time[i]).to.have.property('subsequent');
					expect(buses_arriving_time[i]).to.have.property('id');
					expect(buses_arriving_time[i]).to.have.property('status');
					expect(buses_arriving_time[i].next).to.be.above(buses_arriving_time[i-1].next);
				}
			});
		});
	});
	describe("#getBusTimeAtFavoriteBusStops", function(){
		it("should return an array of buses sorted by next arriving time", function(){
			var bus_stops = [92079, 92301, 92071];
			sgbus.getBusTimeAtFavoriteBusStops(bus_stops, function(err, buses_arriving_time){
				expect(buses_arriving_time).to.be.a('array');
				for(var i=1;i<buses_arriving_time.length;i++){
					expect(buses_arriving_time[i]).to.have.property('next');
					expect(buses_arriving_time[i]).to.have.property('subsequent');
					expect(buses_arriving_time[i]).to.have.property('id');
					expect(buses_arriving_time[i]).to.have.property('status');
					expect(buses_arriving_time[i].next).to.be.above(buses_arriving_time[i-1].next);
				}
			});
		});
	});
	describe(".speak", function(){
		describe("#bustime", function(){
			it("should return a script string with at least a bus id", function(){
				var bus_stop_id = 92079;
				var bus_id = 55;
				sgbus.speak.bustime(bus_stop_id, bus_id, function(err, buses_arriving_time){
					expect(buses_arriving_time).to.be.a('string');
					expect(buses_arriving_time).to.include(bus_id.toString());
				});
			});
		});
	});
});