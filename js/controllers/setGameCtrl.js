mapStory.controller('setGameCtrl', function($window,$rootScope,$scope, Pubnub, currentUser, loginService, gameModel) {
	gameModel.mapLoad=false;
	
	//Creates Game
	$scope.createGame = function(gameName,numPlayers,numWords,range,gamePassword) {
		Pubnub.setUUID($rootScope.currentUser.username);
		var gameId = Math.random().toString(36).substring(7)
		newGame = {
			id: gameId,
			name:gameName,
			numPlayers:parseInt(numPlayers),
			numWords:parseInt(numWords),
			range:parseInt(range),
			gamePassword:gamePassword,
			host: $rootScope.currentUser.username,
			channel: gameId,
			players: "",
			location: {lat: 0, lng: 0},
			story: "",
			round: 0
		};
		console.log(newGame);
		navigator.geolocation.getCurrentPosition(function(position) {
	        var pos = {lat: position.coords.latitude, lng: position.coords.longitude};
	        newGame.location.lat = pos.lat;
	        newGame.location.lng = pos.lng;
			loginService.createGame(newGame.id, newGame);
		});
	}
});