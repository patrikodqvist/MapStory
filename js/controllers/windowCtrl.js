mapStory.controller('windowCtrl', function($window,$rootScope,$scope, Pubnub, currentUser, loginService, gameModel, firebase, $interval) {	
	/*if ($rootScope.currentUser) {

	}
	else {
		$window.location.href = "#!/login"
		$window.location.reload();
	}*/

	$rootScope.playSound = false;
	$rootScope.inGame = false;
	$rootScope.Playing =false;

	$scope.searchInfo = function(name) {
		loginService.userSearch(name);
		loginService.gameSearch(name);
	}

	$scope.getUser = function(id) {
		loginService.getUser(id);
		$window.location.href = "#!/profile";
	}

	$scope.getGame = function(id) {
		loginService.getGame(id);
		$window.location.href = "#!/searchedGame";
	}


	$scope.home = function() {
		$window.location.href = "#!/home";
	}
	$scope.profile = function() {
		$window.location.href = "#!/profile";
	}
	$scope.search = function() {
		$window.location.href = "#!/search";
	}

	$scope.userSettings = function() {
		$window.location.href = "#!/userSettings";
	}

	$scope.aboutUs = function() {
		$window.location.href = "#!/aboutUs";
	}

	$scope.storyFeed = function() {
		$window.location.href = "#!/storyFeed";
	}

	$scope.splitter = function() {
		  var menu = document.getElementById('menu');
		  menu.open();
	}

	$scope.logOut = function() {
    	if ($scope.audio) {
    		$scope.audio.pause();
    	}
    	loginService.logout();
    	
    }

    $scope.changeUsername = function(username) {
    	loginService.changeUsername(username);
    	$window.alert('Username changed to ' + username + '!');
    }
    $scope.changeEmail = function(email) {
    	loginService.changeEmail(email);
    	$window.alert('Email changed to ' + email + '!');
    }
    $scope.changePassword = function(password) {
    	loginService.changePassword(password);
    	$window.alert('Password changed to ' + password + '!');
    }
});