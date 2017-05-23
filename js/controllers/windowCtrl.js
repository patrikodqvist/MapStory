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
    // search function
	$scope.searchInfo = function(name) {
		loginService.userSearch(name);
		loginService.gameSearch(name);
	}
    // retrives the user
	$scope.getUser = function(id) {
		loginService.getUser(id);
		$window.location.href = "#!/profile";
	}
    // retrives the game
	$scope.getGame = function(id) {
		loginService.getGame(id);
		$window.location.href = "#!/searchedGame";
	}
    // home
	$scope.home = function() {
		gameModel.mapLoad=false
		$window.location.href = "#!/home";
	}
    // profile
	$scope.profile = function() {
        loginService.getUser($rootScope.currentUser.id);
		$window.location.href = "#!/profile";
	}
    // search
	$scope.search = function() {
		$window.location.href = "#!/search";
	}
    // user settings
	$scope.userSettings = function() {
		$window.location.href = "#!/userSettings";
	}
    // about us
	$scope.aboutUs = function() {
		$window.location.href = "#!/aboutUs";
	}
    // feeden
	$scope.storyFeed = function() {
		$window.location.href = "#!/storyFeed";
	}
    // friendslist
	$scope.friendsList = function() {
		$window.location.href = "#!/friendsList";
	}
    // menu bar
	$scope.splitter = function() {
		  var menu = document.getElementById('menu');
		  menu.open();
	}
    //logs out the user
	$scope.logOut = function() {
    	if ($scope.audio) {
    		$scope.audio.pause();
    	}
    	loginService.logout();
    	
    }
    //change username
    $scope.changeUsername = function(username) {
    	loginService.changeUsername(username);
    	$window.alert('Username changed to ' + username + '!');
    }
    //changes the email
    $scope.changeEmail = function(email) {
    	loginService.changeEmail(email);
    	$window.alert('Email changed to ' + email + '!');
    }
    //changes the password
    $scope.changePassword = function(password) {
    	loginService.changePassword(password);
    	$window.alert('Password changed to ' + password + '!');
    }
    //method for deleting story
    $scope.deleteStory = function(userID,gameID) {
    	console.log([userID,gameID]);
    	loginService.removeStory(userID,gameID)
    }
    //checks if the loggod in user is watching its own page
    $scope.checkUser = function() {
    	if ($rootScope.selUser.id == $rootScope.currentUser.id) {
    		return true;
    	}
    	else {
    		return false;
    	}
    }
    //checks if the loggod in user is watching its own page for add friends
    $scope.notUser = function() {
    	if ($rootScope.selUser.id == $rootScope.currentUser.id) {
    		return false;
    	}
    	else {
    		return true;
    	}
    }
    // checks if you are friends
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
    // adds friend
    $scope.addFriend = function() {
    	ref.child($rootScope.selUser.id).set({name:$rootScope.selUser.username,
    		id: $rootScope.selUser.id});
    }
    // deletes friend
    $scope.deleteFriend = function() {
    	ref.child($rootScope.selUser.id).remove();
    }
});