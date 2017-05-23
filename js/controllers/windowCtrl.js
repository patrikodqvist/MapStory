mapStory.controller('windowCtrl', function($window,$rootScope,$scope, Pubnub, currentUser, loginService, gameModel, firebase,$firebaseObject, $firebaseArray, $interval) {	
	if ($rootScope.currentUser) {

	}
	else {
		$window.location.href = "#!/home"
		$window.location.reload();
	}

	$rootScope.playSound = false;
	$rootScope.inGame = false;
	$rootScope.Playing =false;
	var ref = firebase.database().ref("users").child($rootScope.currentUser.id).child("friends");
    var user = $firebaseObject(ref);
    var feed = firebase.database().ref("feed");
    $firebaseArray(feed).$loaded().then(function(ref) {
    	$rootScope.feed = ref;
    });

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

	$scope.friendsList = function() {
		$window.location.href = "#!/friendsList";
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


    $scope.deleteStory = function(userID,gameID) {
    	console.log([userID,gameID]);
    	loginService.removeStory(userID,gameID)
    }
    $scope.checkUser = function() {
    	if ($rootScope.selUser.id == $rootScope.currentUser.id) {
    		return true;
    	}
    	else {
    		return false;
    	}
    }
    $scope.notUser = function() {
    	if ($rootScope.selUser.id == $rootScope.currentUser.id) {
    		return false;
    	}
    	else {
    		return true;
    	}
    }
    $scope.checkFriend = function() {
    	if ($rootScope.currentUser.friends) {
    		for (key in $rootScope.currentUser.friends){
    			if (key == $rootScope.selUser.id) {
    				$scope.UserCheck = false;
    			}
    			else {
    				$scope.UserCheck = true;
    			}
    		}
    		
    	}
    	else {
    		$scope.UserCheck = true;
    	}
    }
    $scope.addFriend = function() {
    	ref.child($rootScope.selUser.id).set({name:$rootScope.selUser.username,
    		id: $rootScope.selUser.id});
    }
    $scope.deleteFriend = function() {
    	ref.child($rootScope.selUser.id).remove();
    }
});