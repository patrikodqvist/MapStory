mapStory.controller('chatCtrl', function($rootScope, $scope, gameModel, firebase, loginService, $window) {
	console.log($rootScope.game);
	var refStory = firebase.database().ref().child("games").child($rootScope.game.id);
	refStory.on('value', function(ref) {
		$rootScope.game =ref.val();
	});
	console.log(refStory);
	gameModel.mapLoad = false;
	$scope.users = [];
	$scope.latestUser = "";
	var box = document.getElementById('messageBox')

	//send message function
	$scope.sendMessage = function() {
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
				$rootScope.game.round +=1;
		    	refStory.child("round").set($rootScope.game.round);
		    	refStory.child("lastUser").set($rootScope.currentUser.username);
		    	
			}
			else {
				$window.alert("only one word each")
			}
		}
	document.getElementById("messageField").value = "";
	}
	

	//quit functions
	$scope.quitGame = function() {
		for (player in $rootScope.game.players) {
			if ($rootScope.game.players[player]==$rootScope.currentUser.username) {
				$rootScope.game.players.splice(player,1);
			}
		}
		refStory.child("players").set($rootScope.game.players);
		loginService.saveStory($rootScope.currentUser.id, $rootScope.game);


	}
	
});