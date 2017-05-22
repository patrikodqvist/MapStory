mapStory.controller('chatCtrl', function($rootScope, $scope, Pubnub, gameModel, firebase, loginService, $window) {
	$scope.fewWords = false;
	// Join channel
	Pubnub.subscribe({
    	channels: [$rootScope.game.channel],
    	withPresence: true
	});
	$scope.written = false;
	$scope.checkGame = function() {
		if ($rootScope.game) {
			var res = $rootScope.game.numWords - $rootScope.game.round;
			if (res == 10) {
				if ($scope.fewWords == false) {
					$window.alert('Only ten words left');
					$scope.fewWords=true;
				}
			}
			if ($rootScope.game.numWords == $rootScope.game.round) {
				var game = $rootScope.game;
				var test = confirm('The game is now over! The story will be saved to your profile');
				loginService.saveStory($rootScope.currentUser.id, $rootScope.game);
				if ($rootScope.game.host == $rootScope.currentUser.username) {
					refStory.remove(
						).then(loginService.removeHost($rootScope.currentUser.id, game
							)).then($window.location.href="#!/home")
				}
				else {
					$window.location.href="#!/home";
				}
			}
		}
	}
	gameModel.mapLoad = false;
	$scope.latestUser = "";
	// Retrives the game from firebase
	var refStory = firebase.database().ref().child("games").child($rootScope.game.id);
	refStory.on('value', function(ref) {
		$rootScope.game =ref.val();
		$scope.checkGame();
	});
	
	var box = document.getElementById('messageBox')
	// Send message function
	$scope.sendMessage = function() {
		if ($rootScope.game.numWords == $rootScope.game.round) {
			$window.alert('Game is over');
		}
		else {
			var message = document.getElementById("messageField")
			var res = message.value.split(" ");
			if ($rootScope.game.lastUser == $rootScope.currentUser.username) {
				$window.alert("wait for next round")
			}
			else {
				// string is not empty and not just whitespace
				if (res.length == 1) {
					var text = $scope.game.story
		        	text = text + " " + message.value;
					refStory.child("story").set(text);
					var round = $rootScope.game.round;
					round +=1
					refStory.child("lastUser").set($rootScope.currentUser.username);
		    		refStory.child("round").set(round);
		    		$scope.written = true;
				}
				else {
					$window.alert("only one word each")
				}
			}
			document.getElementById("messageField").value = "";
		}
		
	}
	// Returns all users
	$scope.getUsers = function() {
	    Pubnub.hereNow({
    		channels: [$rootScope.game.channel],
    		includeUUIDs: true},
    		function(status, response) {
    			angular.forEach(response.channels, function(value,key){
    				$rootScope.onlineUsers = value.occupants;
    			});
  			}
  		);
	}
	// Quit functions
	$scope.quitGame = function() {
		$rootScope.inGame=false;
		Pubnub.unsubscribe({
        	channels: [$rootScope.game.channel]
    	});
		if ($scope.written) {
			refStory.child("players").child($rootScope.currentUser.id).set($rootScope.currentUser.username)
			loginService.saveStory($rootScope.currentUser.id, $rootScope.game);
		}
		else {
			$window.location.href="#!/home"
		}
	}
	$scope.getUsers()
});