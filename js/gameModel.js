mapStory.factory('gameModel', ['$rootScope', '$window', '$firebaseObject', '$firebaseAuth', '$firebaseArray', function($rootScope,$window,$firebaseArray, $firebaseAuth, $firebaseObject) {
	this.mapLoad = false;
	this.geohash = function(coord, resolution) {
		var rez = Math.pow( 10, resolution || 0 );
		console.log(rez);
	    return Math.floor(coord * rez) / rez;

	}
	return this;
}]);