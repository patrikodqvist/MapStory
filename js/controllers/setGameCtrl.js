mapStory.controller('setGameCtrl', function($window,$rootScope,$scope, currentUser, loginService, gameModel) {
	gameModel.mapLoad=false;
	
	//Creates Game
	$scope.createGame = function(gameName,numPlayers,numWords,range,gamePassword) {
		newGame = {
			id: Math.random().toString(36).substring(7),
			name:gameName,
			numPlayers:parseInt(numPlayers),
			numWords:parseInt(numWords),
			range:parseInt(range),
			gamePassword:gamePassword,
			host: $rootScope.currentUser.username,
			channel: "",
			players:[" ",$rootScope.currentUser.username],
			location: {lat: 0, lng: 0},
			story: [],
			round: 0
		};
		console.log(newGame);
		navigator.geolocation.getCurrentPosition(function(position) {
	        var pos = {lat: position.coords.latitude, lng: position.coords.longitude};
	        newGame.location.lat = pos.lat;
	        newGame.location.lng = pos.lng;
	    	var channel = gameModel.geohash(pos.lat, newGame.range) + ' ' + gameModel.geohash(pos.lng, newGame.range);
	    	console.log(channel);
	    	$rootScope.channel = channel;
	    	newGame.channel = channel;
			loginService.createGame(newGame.id, newGame);
			
		});
	}





});