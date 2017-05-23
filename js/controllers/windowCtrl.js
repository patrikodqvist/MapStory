mapStory.controller('windowCtrl', function($window,$rootScope,$scope, Pubnub, currentUser, loginService, gameModel, firebase,$firebaseObject, $interval) {	
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

	$scope.searchInfo = function(name) {
		loginService.userSearch(name);
		loginService.gameSearch(name);
	}

	$scope.home = function() {
		$window.location.href = "#!/home";
		//$window.location.reload()
	}
	$scope.profile = function() {
		loginService.getUser($rootScope.currentUser.id);
		$window.location.href = "#!/profile";
	}
	$scope.search = function() {
		$window.location.href = "#!/search";
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