mapStory.factory('gameModel', ['$rootScope', '$window', '$firebaseObject', '$firebaseAuth', '$firebaseArray', function($rootScope,$window,$firebaseArray, $firebaseAuth, $firebaseObject) {
	this.mapLoad = false;
	//Hashes out small boxes of the world map
	this.geohash = function(coord, resolution) {
		var rez = Math.pow( 10, resolution || 0 );
		console.log(rez);
	    return Math.floor(coord * rez) / rez;

	}
	//Calculates radians
	this.rad = function(x) {
  		return x * Math.PI / 180;
	};

	//Returns the distance between two cordinates
	this.getDistance = function(p1, p2) {
		var R = 6378137; // Earth’s mean radius in meter
		var dLat = this.rad(p2.lat - p1.lat);
		var dLong = this.rad(p2.lng - p1.lng);
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(this.rad(p1.lat)) * Math.cos(this.rad(p2.lat)) *
		Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		return d; // returns the distance in meter
	};

	return this;
}]);